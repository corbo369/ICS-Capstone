/**
 * @file Integrates Server Database Through APIs
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import { useEffect, useState } from "react";

// Import Types
import { DexscreenerResponse } from "../types/dexscreener.ts";
import { Asset, Holding, Transaction } from "../types/database.ts";

const useDatabase = (userId: number) => {
    // State variables
    const [assets, setAssets] = useState<Asset[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [holdings, setHoldings] = useState<Holding[]>([]);

    // Set Token
    const token = localStorage.getItem("token");

    // Fetches assets
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                if (userId === 0) return;

                // Fetch the assets from the database
                const response = await fetch("api/v1/assets", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();

                // Update assets state
                setAssets(data);
            } catch(error) {
                console.error("Error fetching assets: ", error);
            }
        }

        fetchAssets();
    }, [])

    // Fetches transactions for logged-in user
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                if (userId === 0) return;

                // Fetch the logged-in user's transactions from the database
                const response = await fetch(`/api/v1/transactions/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();

                // Update transactions state
                setTransactions(data);
            } catch (error) {
                console.error(`Error fetching transactions for ${userId}: `, error);
            }
        }

        fetchTransactions();
    }, []);

    // Fetches holdings for logged-in user, and fetches current prices
    useEffect(() => {
        const fetchHoldingsUpdatePrices = async () => {
            try {
                if (userId === 0) return;

                // Fetch the logged-in user's holdings from the database
                const response = await fetch(`/api/v1/holdings/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                // Append required price property to each holding in the response
                const databaseHoldings = (await response.json()).map((h: any) => ({
                    ...h,
                    Price: 0,
                    PNL: 0
                })) as Holding[];

                // Fetch prices for each holding using Dexscreener's API
                const updatedHoldings = await Promise.all(
                  databaseHoldings.map(async (h) => {
                      try {
                          // Returns data including the current price
                          const response = await fetch(`/api/dexscreener/${h.ChainID}/${h.ContractAddress}`);
                          const data: DexscreenerResponse = await response.json();
                          const price = parseFloat(data[0].priceUsd);

                          // Update price property with fetched price
                          return {
                              ...h,
                              Price: price,
                              PNL: h.Amount * (price - h.AveragePrice)
                          };
                      } catch (error) {
                          console.error(`Error fetching price for ${h.Name}: `, error);
                          return h;
                      }
                  })
                );

                // Remove zero balances, order by value, and update state
                setHoldings(
                  updatedHoldings
                    .filter((h) => h.Amount !== 0)
                    .sort((a, b) => (b.Price * b.Amount) - (a.Price * a.Amount))
                );
            } catch (error) {
                console.error("Error fetching holdings: ", error);
            }
        };

        fetchHoldingsUpdatePrices();
    }, [transactions]);

    // Adds a new asset to the database
    const addAsset = async (asset: Omit<Asset, "AssetID">) => {
        try {
            // Inserts the provided asset
            const res = await fetch("/api/v1/assets", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(asset),
            });

            const data = await res.json();
            const newAsset = data[0];

            // Append the asset to current state and return it
            setAssets((prev) => [newAsset, ...prev]);
            return newAsset;
        } catch (error) {
            console.error("Failed to add asset: ", error);
        }
    }

    // Adds a new transaction for the logged-in user to the database
    const addTransaction = async (transaction: Omit<Transaction, "TransactionID">) => {
        try {
            // Inserts the provided transaction
            const resTransaction = await fetch(`/api/v1/transactions/${userId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transaction),
            });
            const dataTransaction = await resTransaction.json();

            // Fetches the asset for the provided transaction
            const resAsset = await fetch(`/api/v1/assets/${dataTransaction.AssetID}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const dataAsset = await resAsset.json();

            // Constructs a new transaction object compatible with the frontend
            const newTransaction: Transaction = {
                TransactionID: dataTransaction.TransactionID,
                Type: dataTransaction.Type,
                Name: dataAsset.Name,
                Amount: dataTransaction.Amount,
                Symbol: dataAsset.Symbol,
                Price: dataTransaction.Price,
                Date: dataTransaction.Date,
            }

            // Append the transaction to current state
            setTransactions((prev) => [newTransaction, ...prev]);
        } catch (error) {
            console.error("Failed to add transaction: ", error);
        }
    };

    // Calculates the total value of the logged-in user's holdings
    const totalValue = () => {
        let sum = 0;
        holdings.forEach((h) => {
            sum += (h.Price * h.Amount);
        })
        return sum;
    }

    return { assets, holdings, transactions, addAsset, addTransaction, totalValue };
};

export default useDatabase;
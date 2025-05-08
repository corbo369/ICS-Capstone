/**
 * @file API Route Integration Functions for Transactions
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import { useEffect, useState } from "react";

// Import Types
import { DexscreenerResponse } from "../types/dexscreener.ts";
import { Asset, Holding, Transaction } from "../types/database.ts";

const useTransactions = (userId: number) => {
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

    // Fetches holdings for logged-in user, then fetches current prices
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
            // Inserts the new transaction
            const res = await fetch(`/api/v1/transactions/${userId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transaction),
            });

            // Transaction object is returned
            const newTransaction = await res.json();

            // Append the transaction to current state
            setTransactions((prev) => [{ ...newTransaction }, ...prev]);
        } catch (error) {
            console.error("Failed to add transaction: ", error);
        }
    };

    // Edits an existing transaction in the database
    const editTransaction = async (transaction: Transaction) => {
        try {
            // Updates the edited transaction
            const res = await fetch(`/api/v1/transactions/${userId}/${transaction.TransactionID}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Amount: transaction.Amount,
                    Price: transaction.Price,
                    Type: transaction.Type,
                    Date: transaction.Date,
                }),
            });

            // Transaction object is returned
            const data = await res.json();

            // Replace the transaction with the updated transaction
            setTransactions((prev) =>
              prev.map((t) =>
                t.TransactionID === data.TransactionID ? { ...t, ...data } : t
              )
            );
        } catch (error) {
            console.error("Failed to edit transaction: ", error);
        }
    }

    const deleteTransaction = async (transactionId: number) => {
        try {
            // Delete the transaction at the provided id
            const res = await fetch(`/api/v1/transactions/${userId}/${transactionId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            // Confirm transaction was deleted
            if (res.status === 200) {
                setTransactions((prev) => prev.filter(t => t.TransactionID !== transactionId));
            }
        } catch (error) {
            console.error("Failed to delete transaction: ", error);
        }
    }

    // Calculates the total value of the logged-in user's holdings
    const totalValue = () => {
        let sum = 0;
        holdings.forEach((h) => {
            sum += (h.Price * h.Amount);
        })
        return sum;
    }

    return { assets, holdings, transactions, addAsset, addTransaction, editTransaction, deleteTransaction, totalValue };
};

export default useTransactions;
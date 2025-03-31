import { useEffect, useState } from "react";

import { DexscreenerResponse } from "../types/dexscreener.ts";
import { DexHolding, Transaction } from "../types/holdings.ts";

const useDatabase = (userId: number) => {
    const [dexHoldings, setDexHoldings] = useState<DexHolding[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchPrices = async () => {
            const storedHoldings = localStorage.getItem("holdings");
            if (!storedHoldings) return;

            let holdingsArray: DexHolding[] = JSON.parse(storedHoldings);

            const updatedHoldings = await Promise.all(
                holdingsArray.map(async (holding) => {
                    try {
                        const response = await fetch(`/api/dexscreener/${holding.chainId}/${holding.address}`);
                        const data: DexscreenerResponse = await response.json();
                        console.log(`Fetched price for ${holding.name}:`, data[0].priceUsd);

                        return {
                            ...holding,
                            price: parseFloat(data[0].priceUsd),
                        };
                    } catch (error) {
                        console.error(`Error fetching price for ${holding.name}:`, error);
                        return holding;
                    }
                })
            );

            setDexHoldings(updatedHoldings);
            localStorage.setItem("holdings", JSON.stringify(updatedHoldings));
        };

        fetchPrices();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`/api/v1/users/${userId}/transactions`);
                const data = await response.json();
                console.log(data);
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions", error);
            }
        }

        fetchTransactions();
    }, []);

    const addTransaction = async (transaction: Omit<Transaction, "TransactionID">) => {
        try {
            const res = await fetch(`/api/v1/users/${userId}/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            });

            const newTransaction = await res.json();
            setTransactions((prev) => [newTransaction, ...prev]);
        } catch (error) {
            console.error("Failed to add transaction:", error);
        }
    };

    /*
    const addDexTransaction = (transaction: Transaction) => {
        const updatedTransactions = [...transactions, transaction];
        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

        let updatedHoldings = [...dexHoldings];

        const holdingIndex = dexHoldings.findIndex(
            (holding) => holding.chainId === transaction.chainId && holding.address === transaction.address
        );

        if (holdingIndex !== -1) {
            updatedHoldings[holdingIndex] = {
                ...updatedHoldings[holdingIndex],
                amount: transaction.type
                    ? updatedHoldings[holdingIndex].amount + transaction.amount
                    : updatedHoldings[holdingIndex].amount - transaction.amount
            }
        } else {
            updatedHoldings.push({
                name: transaction.name,
                symbol: transaction.symbol,
                chainId: transaction.chainId,
                address: transaction.address,
                amount: transaction.amount,
                price: transaction.price
            });
        }

        setDexHoldings(updatedHoldings);
        localStorage.setItem("holdings", JSON.stringify(updatedHoldings));
    }
    */

    const totalValue = () => {
        let sum = 0;
        dexHoldings.forEach((holding) => {
            sum += (holding.price * holding.amount);
        })
        return sum;
    }

    return { dexHoldings, transactions, addTransaction, totalValue };
};

export default useDatabase;
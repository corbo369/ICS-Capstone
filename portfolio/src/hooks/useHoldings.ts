import { useEffect, useState } from "react";

import { DexscreenerResponse } from "../types/dexscreener.ts";
import { DexHolding, DexTransaction } from "../types/holdings.ts";

const useHoldings = () => {
    const [dexHoldings, setDexHoldings] = useState<DexHolding[]>([]);
    const [dexTransactions, setDexTransactions] = useState<DexTransaction[]>([]);

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
        const storedTransactions = localStorage.getItem("transactions");
        if (storedTransactions) {
            setDexTransactions(JSON.parse(storedTransactions));
        }
    }, []);

    const addDexTransaction = (transaction: DexTransaction) => {
        const updatedDexTransactions = [...dexTransactions, transaction];
        setDexTransactions(updatedDexTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedDexTransactions));

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

    const totalValue = () => {
        let sum = 0;
        dexHoldings.forEach((holding) => {
            sum += (holding.price * holding.amount);
        })
        return sum;
    }

    return { dexHoldings, dexTransactions, addDexTransaction, totalValue };
};

export default useHoldings;
import React, { useState, useEffect } from "react";

import useDexscreenerData from "../hooks/useDexscreenerData";

const chains = ["ethereum", "solana", "base", "hyperliquid"];

interface AddTransactionProps {
    addTransaction: (transaction: any) => void;
    setActiveTab: (tab: "holdings" | "txns" | "addTxn") => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ addTransaction, setActiveTab }) => {
    const [txnType, setTxnType] = useState<boolean>(true);
    const [contractAddress, setContractAddress] = useState<string>("");
    const [selectedAsset, setSelectedAsset] = useState<string>("");
    const [tokenResults, setTokenResults] = useState<{ name: string; symbol: string; chainId: string; address: string; price: string; }[]>([]);

    const fetchedData = chains.map((chain) => useDexscreenerData(chain, contractAddress));

    useEffect(() => {
        const results: { name: string; symbol: string; chainId: string; address: string; price: string }[] = [];

        fetchedData.forEach(({ dexscreenerData }) => {
            if (dexscreenerData) {
                results.push({
                    name: dexscreenerData.baseToken.name,
                    symbol: dexscreenerData.baseToken.symbol,
                    chainId: dexscreenerData.chainId,
                    address: dexscreenerData.baseToken.address,
                    price: dexscreenerData.priceUsd,
                });
            }
        });

        setTokenResults(results);
    }, [fetchedData]);

    return (
        <div className="h-full px-6 py-4 bg-blue-50 border-3 border-blue-400 rounded-sm flex flex-col items-center">
            <div className="flex items-center h-1/6 w-full">
                <button
                    className={`cursor-pointer h-full w-full text-black border-2 border-blue-300 ${txnType ? "bg-blue-300" : "bg-blue-100"}`}
                    onClick={() => {setTxnType(true)}}
                >
                    BUY
                </button>
                <button
                    className={`cursor-pointer h-full w-full text-black border-2 border-blue-300 ${!txnType ? "bg-blue-300" : "bg-blue-100"}`}
                    onClick={() => {setTxnType(false)}}
                >
                    SELL
                </button>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const amount = parseFloat(formData.get("amount") as string);
                    const price = parseFloat(formData.get("price") as string);

                    addTransaction({
                        name: tokenResults[0].name,
                        symbol: tokenResults[0].symbol,
                        chainId: tokenResults[0].chainId,
                        address: tokenResults[0].address,
                        amount: amount,
                        price: price,
                        type: txnType,
                    });

                    setActiveTab("holdings");
                }}
                className="flex flex-col w-full h-full mt-2"
            >
                {/* Contract Address Input */}
                <input
                    type="text"
                    placeholder="Paste Contract Address"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="w-full p-2 border"
                />

                {/* Select Dropdown for Found Assets */}
                {tokenResults.length > 0 && (
                    <div>
                        <select
                            value={selectedAsset}
                            onChange={(e) => setSelectedAsset(e.target.value)}
                            className="w-full p-2 border mt-2"
                        >
                            {tokenResults.map((token, index) => (
                                <option key={index} value={token.name}>
                                    {token.name} ({token.symbol}) - {token.chainId}
                                </option>
                            ))}
                        </select>
                        <input name="amount" type="float" placeholder="Amount" className="w-full p-2 border mt-2" />
                        <input name="price" type="float" value={tokenResults[0].price} className="w-full p-2 border mt-2" />
                    </div>
                )}

                {/* Confirm & Cancel Buttons */}
                <button type="submit" className="w-full bg-green-400 text-black p-2 mt-4">CONFIRM</button>
                <button
                    type="button"
                    className="w-full bg-red-300 text-black p-2 mt-2"
                    onClick={() => setActiveTab("holdings")}
                >
                    CANCEL
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;
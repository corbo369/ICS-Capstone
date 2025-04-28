import React, { useState, useEffect } from "react";

import ComboBox from "./ComboBox";

import { Asset } from "../types/database.ts";

import { DexscreenerResponse } from "../types/dexscreener.ts";

const chains = ["ethereum", "solana", "base", "hyperliquid"];

interface AddTransactionProps {
    assets: Asset[];
    addAsset: (asset: any) => Promise<any>;
    addTransaction: (transaction: any) => void;
    setActiveTab: (tab: "holdings" | "txns" | "addTxn") => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ assets, addAsset, addTransaction, setActiveTab }) => {
    const [txnType, setTxnType] = useState<boolean>(true);
    const [searchType, setSearchType] = useState<boolean>(true);
    const [assetSelected, setAssetSelected] = useState<boolean>(false);

    const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

    const [manualEntry, setManualEntry] = useState<DexscreenerResponse>();
    const [chainId, setChainId] = useState<string>("");
    const [contractAddress, setContractAddress] = useState<string>("");

    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    useEffect(() => {
      const fetchSelectedAssetIdPrice = async () => {
        try {
          const asset = assets.find(a => a.AssetID === selectedAssetId);
          if(asset) {
            const response = await fetch(`/api/dexscreener/${asset.ChainID}/${asset.ContractAddress}`);
            const data = await response.json();
            setName(asset.Name);
            setPrice(data[0].priceUsd);
            setAssetSelected(true);
          }
        } catch (error) {
          console.error("Error fetching dexscreener data: ", error);
        }
      };

      fetchSelectedAssetIdPrice();
    }, [selectedAssetId]);

  useEffect(() => {
    const fetchManualEntryPrice = async () => {
      try {
        const response = await fetch(`/api/dexscreener/${chainId}/${contractAddress}`);
        const data: DexscreenerResponse = await response.json();
        setName(data[0].baseToken.name);
        setPrice(data[0].priceUsd);
        setManualEntry(data);
        setAssetSelected(true);
      } catch (error) {
        console.error("Error fetching dexscreener data: ", error);
      }
    };

    fetchManualEntryPrice();
  }, [chainId, contractAddress]);

    const assetOptions = assets.map((asset) => ({
      value: asset.AssetID.toString(),
      label: `${asset.Name} (${asset.Symbol})`,
    }));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      let asset: Asset | undefined;

      if (searchType) {
        asset = assets.find(a => a.AssetID === selectedAssetId);
      } else {
        if (manualEntry) {
          const newAsset: Omit<Asset, "AssetID"> = {
            Name: manualEntry[0].baseToken.name,
            Symbol: manualEntry[0].baseToken.symbol,
            ChainID: manualEntry[0].chainId,
            ContractAddress: manualEntry[0].baseToken.address
          };
          asset = await addAsset(newAsset);
        }
      }

      if (!asset) return alert("Error Finding Asset!");

      addTransaction(
        {
          AssetID: asset.AssetID,
          Amount: parseFloat(amount),
          Price: parseFloat(price),
          Type: txnType,
          Date: new Date().toISOString().replace("T", " ").replace("Z", "").split(".")[0] + ".000",
        }
      );

      setActiveTab("holdings");
    };

    return (
      <div className="h-full p-3 bg-gray-500 border-3 border-black rounded-sm flex flex-col items-center">
        <div className="flex items-center h-2/10 w-full">
          <button
            className={`cursor-pointer h-full w-full border-2 border-gray-700 ${txnType ? "bg-gray-700" : "bg-gray-600"}`}
            onClick={() => setTxnType(true)}
          >
            BUY
          </button>
          <button
            className={`cursor-pointer h-full w-full border-2 border-gray-700 ${!txnType ? "bg-gray-700" : "bg-gray-600"}`}
            onClick={() => setTxnType(false)}
          >
            SELL
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col w-full h-full mt-2 space-y-2">

          {assetSelected ? (
            <div>
              <input
                name="name"
                type="text"
                step="any"
                className="w-full p-2 border-2 text-center"
                value={name}
              />
              <div className="flex items-center justify-center w-full">
                <input
                  name="amount"
                  type="number"
                  step="any"
                  placeholder="Amount"
                  className="w-full p-2 border-2 text-center"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <input
                  name="price"
                  type="number"
                  step="any"
                  placeholder="Price"
                  className="w-full p-2 border-2 text-center"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <input
                name="value"
                type="number"
                step="any"
                placeholder="Value"
                className="w-full p-2 border-2 text-center"
                value={parseFloat(price) * parseFloat(amount)}
              />
              <button type="submit" className="w-full bg-green-400 text-black p-2 mt-4">CONFIRM</button>
            </div>
          ) : (
            <div>
              {searchType ? (
                <div className="flex flex-col items-center w-full mt-3 mb-15 space-y-2">
                  <ComboBox
                    options={assetOptions}
                    value={selectedAssetId ? selectedAssetId.toString() : ""}
                    onChange={(newValue) => setSelectedAssetId(parseInt(newValue))}
                  />
                  <p>OR</p>
                  <button
                    className="w-1/3 bg-gray-600  p-2"
                    onClick={() => setSearchType(false)}
                  >
                    Add A New Token
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full mt-3 mb-20 space-y-2">
                    <input
                      className="w-full p-2 border-2 text-lg text-center"
                      type="text"
                      placeholder="Paste contract address"
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                    />
                    <select
                      className="w-full p-2 border-2 text-lg text-center"
                      value={chainId} onChange={(e) => setChainId(e.target.value)}
                    >
                      <option value="Placeholder">Select a Chain</option>
                      {chains.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            className="w-full bg-red-200 text-black p-2"
            onClick={() => setActiveTab("holdings")}
          >
            CANCEL
          </button>
        </form>
      </div>
    );
};

export default AddTransaction;
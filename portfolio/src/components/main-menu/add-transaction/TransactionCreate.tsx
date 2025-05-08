/**
 * @file Create New Transaction Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState, useEffect } from "react";

// Import Components
import AssetSelect from "@/components/main-menu/add-transaction/AssetSelect.tsx";
import AssetCreate from "@/components/main-menu/add-transaction/AssetCreate.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { CalendarDays } from "lucide-react";

// Import Types
import { Asset } from "@/types/database.ts";
import { DexscreenerResponse } from "@/types/dexscreener.ts";

// Component Props
interface TransactionAddProps {
  assets: Asset[];
  addAsset: (asset: any) => Promise<any>;
  addTransaction: (transaction: any) => void;
  setActiveMainMenuTab: (activeMainMenuTab: "holdingsList" | "transactionsList" | "transactionCreate" | "reports") => void;
}

const TransactionCreate: React.FC<TransactionAddProps> = ({assets, addAsset, addTransaction, setActiveMainMenuTab}) => {
  // Active tab state
  const [activeTransactionTab, setActiveTransactionTab] = useState<"assetSelect" | "assetCreate" | "transactionCreate">("assetSelect");

  // Select asset form state
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

  // Create asset form state
  const [chainId, setChainId] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");

  // Create transaction form state
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [type, setType] = useState<boolean>(true);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Fetches price for selected asset
  useEffect(() => {
    const fetchSelectedAssetData = async () => {
      try {
        const asset = assets.find(a => a.AssetID === selectedAssetId);
        if (asset) {
          const response = await fetch(`/api/dexscreener/${asset.ChainID}/${asset.ContractAddress}`);
          const data: DexscreenerResponse = await response.json();

          // Update state
          setPrice(parseFloat(data[0].priceUsd));
          setSelectedAsset(asset);
          setActiveTransactionTab("transactionCreate");
        }
      } catch (error) {
        console.error("Error fetching dexscreener data: ", error);
      }
    };

    if (selectedAssetId) {
      fetchSelectedAssetData();
    }
  }, [selectedAssetId]);

  // Fetches price for created asset
  useEffect(() => {
    const fetchCreatedAssetData = async () => {
      try {
        const response = await fetch(`/api/dexscreener/${chainId}/${contractAddress}`);
        const data: DexscreenerResponse = await response.json();

        // Construct a new asset
        const newAsset: Omit<Asset, "AssetID"> = {
          Name: data[0].baseToken.name,
          Symbol: data[0].baseToken.symbol,
          ChainID: data[0].chainId,
          ContractAddress: data[0].baseToken.address,
          ImagePath: data[0].info.imageUrl,
        };

        // Add new asset to the database
        const asset = await addAsset(newAsset);

        // Update state
        setPrice(parseFloat(data[0].priceUsd));
        setSelectedAsset(asset);
        setActiveTransactionTab("transactionCreate");
      } catch (error) {
        console.error("Error fetching dexscreener data: ", error);
      }
    };

    // Only run if both inputs are selected
    if (chainId !== "" && contractAddress !== "") {
      fetchCreatedAssetData();
    }
  }, [chainId, contractAddress]);

  // Converts input values to USD format
  const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  // Handles transaction create form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Confirm all input fields are filled
    if (!selectedAsset) return alert("Error Finding Asset");
    if (!amount) return alert("Please Enter an Amount");
    if (!price) return alert("Please Enter a Price");
    if (!date) return alert("Please Select a Date");

    // Construct new transaction
    const newTransaction = {
      AssetID: selectedAsset.AssetID,
      Amount: amount,
      Price: price,
      Type: type,
      Date: date.toISOString().split("T")[0],
    }

    // Insert into database
    addTransaction(newTransaction);

    // Set active tab
    setActiveMainMenuTab("holdingsList");
  };

  // Renders active tab based on state
  const renderActiveTransactionTab = {
    assetSelect: (
      <AssetSelect assets={assets} selectedAssetId={selectedAssetId} setSelectedAssetId={setSelectedAssetId} setActiveTransactionTab={setActiveTransactionTab} setActiveMainMenuTab={setActiveMainMenuTab} />
    ),
    assetCreate: (
      <AssetCreate chainId={chainId} setChainId={setChainId} contractAddress={contractAddress} setContractAddress={setContractAddress} setActiveTransactionTab={setActiveTransactionTab} setActiveMainMenuTab={setActiveMainMenuTab} />
    ),
    transactionCreate: (
      <form onSubmit={handleSubmit} className="h-full w-full flex flex-col justify-center m-1 space-y-3">
        {/* Asset Name and Buy/Sell Radio Buttons*/}
        <div className="h-1/6 w-full flex items-center space-x-1">
          <input
            name="name"
            type="text"
            autoComplete="off"
            className="h-full w-full p-2 rounded-sm bg-gray-500 border-3 border-gray-800 text-center text-2xl
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
            value={selectedAsset ? selectedAsset.Name : ""}
            readOnly
          />
          <button
            type="button"
            className={`cursor-pointer h-full w-full rounded-sm text-xl border-3 border-gray-800 ${type ? "bg-gray-700" : "bg-gray-500"}`}
            onClick={() => setType(true)}
          >
            Buy
          </button>
          <button
            type="button"
            className={`cursor-pointer h-full w-full rounded-sm text-xl border-3 border-gray-800 ${!type ? "bg-gray-700" : "bg-gray-500"}`}
            onClick={() => setType(false)}
          >
            Sell
          </button>
        </div>
        {/* Date Selection */}
        <div className="h-1/6 w-full flex space-x-1">
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Date:
              <Popover>
                <PopoverTrigger asChild>
                  <CalendarDays
                    className="h-2/3 w-1/4 p-1 rounded-sm text-white hover:cursor-pointer"
                  >
                  </CalendarDays>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border border-gray-700 text-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </label>
            <input
              name="value"
              type="text"
              step="any"
              autoComplete="off"
              placeholder="Select Date"
              className="h-full w-2/3 p-2 text-center
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={date ? date.toLocaleDateString("en-US") : ""}
              readOnly
            />
          </div>
        </div>
        {/* Amount and Price Inputs */}
        <div className="h-1/6 w-full flex space-x-1">
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Amount:
            </label>
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              className="h-full w-2/3 p-2 text-center
                    focus:outline-none
                    placeholder:text-gray-300
                    [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none"
              value={amount === undefined ? "" : amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Price:
            </label>
            <input
              name="price"
              type="number"
              inputMode="decimal"
              autoComplete="off"
              placeholder="$0.00"
              className="h-full w-2/3 p-2 text-center
                      focus:outline-none
                      placeholder:text-gray-300
                      [appearance:textfield]
                      [&::-webkit-inner-spin-button]:appearance-none"
              value={price === undefined ? "" : price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>
        </div>
        {/* Total Value Field */}
        <div className="h-1/6 w-full flex space-x-1">
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Transaction Value:
            </label>
            <input
              name="value"
              type="text"
              step="any"
              autoComplete="off"
              placeholder="$0.00"
              className="h-full w-2/3 p-2 text-center
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={(amount === undefined || price === undefined || isNaN(amount) || isNaN(price)) ? "" : usdFormatter.format(price * amount)}
              readOnly
            />
          </div>
        </div>
        {/* Confirm/Delete Buttons */}
        <div className="h-1/3 w-full flex flex-col items-center space-y-2">
          <button
            type="submit"
            className="w-full rounded-sm bg-green-300 border-2 border-gray-800 text-black p-2 cursor-pointer">
            Confirm
          </button>
          <button
            type="button"
            className="w-full rounded-sm bg-red-300 border-2 border-gray-800 text-black p-2 cursor-pointer"
            onClick={() => setActiveMainMenuTab("holdingsList")}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex h-full p-3 rounded-sm bg-gray-600 border-3 border-black">
      {renderActiveTransactionTab[activeTransactionTab]}
    </div>
  )
}

export default TransactionCreate;
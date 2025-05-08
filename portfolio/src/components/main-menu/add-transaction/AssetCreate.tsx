/**
 * @file Create Asset Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React from "react";

// Import Components
import ComboBox from "@/components/ui/combo-box.tsx";

// Component Props
interface AssetCreateProps {
  chainId: string;
  setChainId: (chainId: string) => void;
  contractAddress: string;
  setContractAddress: (contractAddress: string) => void;
  setActiveTransactionTab: (activeTransactionTab: "assetSelect" | "assetCreate" | "transactionCreate") => void;
  setActiveMainMenuTab: (activeMainMenuTab: "holdingsList" | "transactionsList" | "transactionCreate" | "reports") => void;
}

const AssetCreate: React.FC<AssetCreateProps> = ({ chainId, setChainId, contractAddress, setContractAddress, setActiveTransactionTab, setActiveMainMenuTab }) => {

  // Combo box options
  const chainOptions = [
    {value: "ethereum", label: "Ethereum"},
    {value: "solana", label: "Solana"},
    {value: "base", label: "Base"},
    {value: "hyperliquid", label: "Hyperliquid"},
    {value: "sui", label: "Sui"},
    {value: "pulsechain", label: "Pulsechain"},
  ]

  return (
    <div className="w-full h-full flex flex-col justify-between m-1">
      <div className="w-full h-full flex flex-col space-y-2">
        {/* Contract Address Input */}
        <input
          className="h-1/5 w-full p-2 rounded-lg bg-gray-600 border-3 border-gray-800 text-gray-100 text-center
                      focus:outline-none
                    placeholder:text-gray-300
                      [appearance:textfield]
                      [&::-webkit-inner-spin-button]:appearance-none"
          type="text"
          autoComplete="off"
          placeholder="Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        {/* Chain Select Combo Box */}
        <div className="h-1/5 rounded-lg border-3 border-gray-800">
          <ComboBox
            options={chainOptions}
            value={chainId ? chainId.toString() : ""}
            onChange={(newValue) => setChainId(newValue)}
            type={"chains"}
          />
        </div>
      </div>
      {/* Confirm and Cancel Buttons */}
      <div className="w-full flex flex-col items-center space-y-2">
        <button
          type="button"
          className="w-full rounded-sm bg-green-300 border-2 border-gray-800 text-black  p-2 cursor-pointer"
          onClick={() => setActiveTransactionTab("assetSelect")}
        >
          Return To Select
        </button>
        <button
          type="button"
          className="w-full rounded-sm bg-red-300 border-2 border-gray-800 text-black p-2 cursor-pointer"
          onClick={() => setActiveMainMenuTab("holdingsList")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AssetCreate;
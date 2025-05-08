/**
 * @file Select Asset Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React from "react";

// Import Components
import ComboBox from "@/components/ui/combo-box.tsx";

// Import Types
import { Asset } from "@/types/database.ts";

// Component Props
interface AssetSelectProps {
  assets: Asset[];
  selectedAssetId: number | null;
  setSelectedAssetId: (selectedAssetId: number) => void;
  setActiveTransactionTab: (activeTransactionTab: "assetSelect" | "assetCreate" | "transactionCreate") => void;
  setActiveMainMenuTab: (activeMainMenuTab: "holdingsList" | "transactionsList" | "transactionCreate" | "reports") => void;
}

const AssetSelect: React.FC<AssetSelectProps> = ({assets, selectedAssetId, setSelectedAssetId, setActiveTransactionTab, setActiveMainMenuTab}) => {

  // Combo box options
  const assetOptions = assets.map((a) => ({
    value: a.AssetID.toString(),
    label: `${a.Name} (${a.Symbol})`,
  }));

  return (
    <div className="w-full h-full flex flex-col m-1">
      {/* Asset Select Combo Box */}
      <div className="w-full h-full flex flex-col justify-between">
        <div className="h-1/5 rounded-lg border-3 border-gray-800">
          <ComboBox
            options={assetOptions}
            value={selectedAssetId ? selectedAssetId.toString() : ""}
            onChange={(newValue) => setSelectedAssetId(parseInt(newValue))}
            type={"assets"}
          />
        </div>
      </div>
      {/* Confirm and Cancel Buttons */}
      <div className="w-full flex flex-col items-center space-y-2">
        <button
          className="w-full rounded-sm bg-green-300 border-2 border-gray-800 text-black  p-2 cursor-pointer"
          onClick={() => setActiveTransactionTab("assetCreate")}
        >
          New Asset
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
  )
}

export default AssetSelect;
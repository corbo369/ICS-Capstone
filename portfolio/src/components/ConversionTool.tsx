/**
 * @file Conversion Tool Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState, useEffect } from "react";

// Import Components
import ComboBox from "@/components/ui/combo-box.tsx";

// Import Types
import { Asset } from "@/types/database.ts";

// Component Props
interface ConversionToolProps {
  assets: Asset[];
}

const ConversionTool: React.FC<ConversionToolProps> = ({ assets }) => {
  // Asset ID state
  const [assetOneId, setAssetOneId] = useState<number | null>(null);
  const [assetTwoId, setAssetTwoId] = useState<number | null>(null);

  // Asset price state
  const [assetOnePrice, setAssetOnePrice] = useState<number>(0);
  const [assetTwoPrice, setAssetTwoPrice] = useState<number>(0);

  // Asset amount state
  const [assetOneAmount, setAssetOneAmount] = useState<number | undefined>(undefined);
  const [assetTwoAmount, setAssetTwoAmount] = useState<number | undefined>(undefined);

  // Fetch the price of both selected assets upon selection changes
  useEffect(() => {
    const fetchSelectedAssetIdPrice = async () => {
      try {
        // Only fetch if both assets are selected
        if (assetOneId && assetTwoId) {
          // Find the assets from the array
          const assetOne = assets.find(a => a.AssetID === assetOneId);
          const assetTwo = assets.find(a => a.AssetID === assetTwoId);

          // Checks that both assets were found
          if(assetOne && assetTwo) {
            // Fetch asset one price
            const resOne = await fetch(`/api/dexscreener/${assetOne.ChainID}/${assetOne.ContractAddress}`);
            const dataOne = await resOne.json();

            // Fetch asset two price
            const resTwo = await fetch(`/api/dexscreener/${assetTwo.ChainID}/${assetTwo.ContractAddress}`);
            const dataTwo = await resTwo.json();

            // Update state
            setAssetOnePrice(dataOne[0].priceUsd);
            setAssetTwoPrice(dataTwo[0].priceUsd);
          }
        }
      } catch (error) {
        console.error("Error fetching dexscreener data: ", error);
      }
    };

    fetchSelectedAssetIdPrice();
  }, [assetOneId, assetTwoId]);

  // Generate options array for the Combo Boxes
  const options = assets.map((a) => ({
    value: a.AssetID.toString(),
    label: `${a.Name} (${a.Symbol})`,
  }));

  // Rounding helper function
  const round = (num: number, dec: number = 6) => {
    return parseFloat(num.toFixed(dec));
  };

  // Handles changes to the amount one input
  const handleAmountOneChange = (newAmount: number) => {
    // Revert to placeholders if amount is set to 0
    if (newAmount === undefined) {
      setAssetOneAmount(undefined);
      setAssetTwoAmount(undefined);
    } else {
      // Set asset one amount to the incoming value
      setAssetOneAmount(round(newAmount));
      // Calculate the converted amount for asset two amount
      setAssetTwoAmount(round((assetOnePrice * newAmount) / assetTwoPrice));
    }
  }

  // Handles changes to the amount two input
  const handleAmountTwoChange = (newAmount: number) => {
    // Revert to placeholders if amount is set to 0
    if (newAmount === undefined) {
      setAssetOneAmount(undefined);
      setAssetTwoAmount(undefined);
    } else {
      // Calculate the converted amount for asset one amount
      setAssetOneAmount(round((assetTwoPrice * newAmount) / assetOnePrice));
      // Set asset two amount to the incoming value
      setAssetTwoAmount(round(newAmount));
    }
  }

  return (
    <div className="h-full w-full rounded-sm flex flex-col justify-around dark bg-gray-700 border-3 border-black">
      <h2 className="text-lg font-semibold text-center">Conversion Tool</h2>
      {/* Asset one card */}
      <div className="h-4/10 p-2 flex flex-col justify-between">
        <div className="h-full w-full pl-3 pr-3 rounded-3xl flex flex-row justify-center dark bg-gray-600 border-3 border-gray-800">
          <div className="w-full flex flex-row justify-between items-center">
            {/* Asset one select box */}
            <div className="h-1/2 w-1/3 rounded-lg border-2 border-gray-800">
              <ComboBox
                options={options}
                value={assetOneId ? assetOneId.toString() : ""}
                onChange={(newValue) => setAssetOneId(parseInt(newValue))}
                type={"assets"}
              />
            </div>
            {/* Amount one input */}
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              autoComplete="off"
              className="w-1/2 text-right text-2xl mr-3
                focus:outline-none
                placeholder:text-gray-400
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={assetOneAmount === undefined ? "" : assetOneAmount}
              onChange={(e) => handleAmountOneChange(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
      {/* Asset two card */}
      <div className="h-4/10 w-full p-2 flex flex-col justify-between">
        <div className="h-full w-full pl-3 pr-3 rounded-3xl flex flex-row justify-center dark bg-gray-600 border-3 border-gray-800">
          <div className="w-full flex flex-row justify-between items-center">
            {/* Asset two select box */}
            <div className="h-1/2 w-1/3 rounded-lg border-2 border-gray-800">
              <ComboBox
                options={options}
                value={assetTwoId ? assetTwoId.toString() : ""}
                onChange={(newValue) => setAssetTwoId(parseInt(newValue))}
                type={"assets"}
              />
            </div>
            {/* Amount two input */}
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              autoComplete="off"
              step="any"
              className="w-1/2 text-right text-2xl mr-3
                focus:outline-none
                placeholder:text-gray-400
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={assetTwoAmount === undefined ? "" : assetTwoAmount}
              onChange={(e) => handleAmountTwoChange(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversionTool;
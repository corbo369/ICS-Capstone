import React, { useState, useEffect } from "react";

import ComboBox from "@/components/ComboBox.tsx";

import { Asset } from "../types/database.ts";

interface ConversionToolProps {
  assets: Asset[];
}

const ConversionTool: React.FC<ConversionToolProps> = ({ assets }) => {

  const [assetsSelected, setAssetsSelected] = useState<boolean>(false);

  const [assetOneId, setAssetOneId] = useState<number | null>(null);
  const [assetTwoId, setAssetTwoId] = useState<number | null>(null);

  const [assetOneSymbol, setAssetOneSymbol] = useState<string>("");
  const [assetTwoSymbol, setAssetTwoSymbol] = useState<string>("");

  const [assetOnePrice, setAssetOnePrice] = useState<string>("");
  const [assetTwoPrice, setAssetTwoPrice] = useState<string>("");

  const [assetOneAmount, setAssetOneAmount] = useState<string>("");
  const [assetTwoAmount, setAssetTwoAmount] = useState<string>("");

  useEffect(() => {
    const fetchSelectedAssetIdPrice = async () => {
      try {
        const assetOne = assets.find(a => a.AssetID === assetOneId);
        const assetTwo = assets.find(a => a.AssetID === assetTwoId);

        if(assetOne && assetTwo) {
          const responseOne = await fetch(`/api/dexscreener/${assetOne.ChainID}/${assetOne.ContractAddress}`);
          const dataOne = await responseOne.json();

          const responseTwo = await fetch(`/api/dexscreener/${assetTwo.ChainID}/${assetTwo.ContractAddress}`);
          const dataTwo = await responseTwo.json();

          setAssetOneSymbol(assetOne.Symbol);
          setAssetTwoSymbol(assetTwo.Symbol);
          setAssetOnePrice(dataOne[0].priceUsd);
          setAssetTwoPrice(dataTwo[0].priceUsd);
          setAssetsSelected(true);
        }
      } catch (error) {
        console.error("Error fetching dexscreener data: ", error);
      }
    };

    if (assetOneId !== null && assetTwoId !== null) {
      fetchSelectedAssetIdPrice();
    }
  }, [assetOneId, assetTwoId]);

  const handleConversion = (amount: string) => {
    setAssetOneAmount(amount);
    const convertedAmount = (parseFloat(amount) * parseFloat(assetOnePrice)) / parseFloat(assetTwoPrice);
    setAssetTwoAmount(convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 5 }));
  }

  const assetOneOptions = assets.map((a) => ({
    value: a.AssetID.toString(),
    label: `${a.Name} (${a.Symbol})`,
  }));

  const assetTwoOptions = assets.map((a) => ({
    value: a.AssetID.toString(),
    label: `${a.Name} (${a.Symbol})`,
  }));

    return (
        <div className="dark h-full w-full bg-gray-800 border-4 border-black rounded-sm flex flex-col">
          <h2 className="text-lg font-semibold text-center mb-1">Conversion Tool</h2>
          <div className="h-full m-3 bg-gray-700 border-2 border-black rounded-sm flex flex-col">
            <div className="flex flex-row mt-3">
              <div className="h-full w-1/2 text-center">
                <ComboBox
                  options={assetOneOptions}
                  value={assetOneId ? assetOneId.toString() : ""}
                  onChange={(newValue) => setAssetOneId(parseInt(newValue))}
                />
                {assetsSelected ? (
                  <div className="w-full flex flex-row">
                    <input
                      name="amount"
                      type="number"
                      step="any"
                      placeholder="Amount"
                      className="w-1/2 text-center p-2"
                      value={assetOneAmount}
                      onChange={(e) => handleConversion(e.target.value)}
                    />
                    <input
                      name="price"
                      type="number"
                      step="any"
                      placeholder="Price"
                      className="w-1/2 text-center p-2"
                      value={assetOnePrice}
                      onChange={(e) => setAssetOnePrice(e.target.value)}
                    />
                  </div>
                ) : (
                  <div/>
                )}
              </div>
              <div className="h-full w-1/2 text-center">
                <ComboBox
                  options={assetTwoOptions}
                  value={assetTwoId ? assetTwoId.toString() : ""}
                  onChange={(newValue) => setAssetTwoId(parseInt(newValue))}
                />
                {assetsSelected ? (
                  <div className="w-full flex flex-row">
                    <input
                      name="price"
                      type="number"
                      step="any"
                      placeholder="Price"
                      className="w-full text-center p-2"
                      value={assetTwoPrice}
                      onChange={(e) => setAssetTwoPrice(e.target.value)}
                    />
                  </div>
                ) : (
                  <div/>
                )}
              </div>
            </div>
            {assetsSelected ? (
              <div className="h-full w-full bg-gray-700 flex flex-row text-center">
                <div className="h-full w-1/2 flex flex-col text-center">
                  <h2>{assetOneAmount}</h2>
                  <h3>{assetOneSymbol}</h3>
                </div>
                <h1>{`=>`}</h1>
                <div className="h-full w-1/2 flex flex-col text-center">
                  <h2>{assetTwoAmount}</h2>
                  <h3>{assetTwoSymbol}</h3>
                </div>
              </div>
            ) : (
              <div/>
            )}
          </div>
        </div>
    );
}

export default ConversionTool;
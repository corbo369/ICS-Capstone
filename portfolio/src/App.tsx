/**
 * @file Main Vite Application
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Hooks
import useDatabase from "./hooks/useDatabase.ts";

// Import Components
import Navbar from "./components/Navbar";
import MainMenu from "./components/MainMenu";
import HoldingsChart from "./components/HoldingsChart.tsx";
import ConversionTool from "./components/ConversionTool.tsx";

// Import CSS
import "./App.css";

// TESTING VALUES REMOVE
//import {Transaction} from "./types/database.ts";
//import {Asset} from "./types/database.ts";

// TODO
// Fix rounding everywhere (something in edit holdings too)
// Add all chains from dex
// Edit txns
// Tax Query
// fix up txn post queries
// Filters on txns and holdings
// Finish reports page
// HoldingsChart colors
// Conversion tool styling

const App: React.FC = () => {

  /*
  const transactions: Transaction[] =
    [
      {
        TransactionID: 1,
        Type: true,
        Name: "Hyperliquid",
        Amount: 100,
        Symbol: "HYPE",
        Price: 15,
        Date: "2025-04-17T04:03:55.653Z"
      }
    ]
  const assets: Asset[] =
  [
    {
      AssetID: 1,
      Name: "Bitcoin",
      Symbol: "BTC",
      ChainID: "solana",
      ContractAddress: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
    },
    {
      AssetID: 2,
      Name: "Hyperliquid",
      Symbol: "HYPE",
      ChainID: "hyperliquid",
      ContractAddress: "0x0d01dc56dcaaca66ad901c959b4011ec",
    },
    {
      AssetID: 3,
      Name: "Fartcoin",
      Symbol: "Fartcoin",
      ChainID: "solana",
      ContractAddress: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
    }
  ]

 */

    const [userId] = useState<number>(() => {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) return parseInt(storedUserId);
      else return 0;
    });

    const { assets, transactions, holdings, addAsset, addTransaction, totalValue } = useDatabase(userId);

    return (
      <div className="h-screen w-screen">
          <Navbar />
          <main className="pt-16 h-full w-full flex bg-gray-700 text-white">
              <div className="w-3/5 h-full p-4">
                  <MainMenu
                      assets={assets}
                      addAsset={addAsset}
                      holdings={holdings}
                      transactions={transactions}
                      addTransaction={addTransaction}
                      totalValue={totalValue}
                  />
              </div>
              <div className="w-2/5 flex flex-col bg-gray-700">
                  <div className="h-1/2 p-4 flex items-center justify-center">
                      <HoldingsChart holdings={holdings} />
                  </div>
                  <div className="h-1/2 p-4 flex items-center justify-center">
                      <ConversionTool assets={assets} />
                  </div>
              </div>
          </main>
      </div>
  )
}

export default App

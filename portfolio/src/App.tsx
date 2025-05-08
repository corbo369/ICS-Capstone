/**
 * @file Main React Application
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Hooks
import useTransactions from "./hooks/useTransactions.ts";

// Import Components
import Navbar from "./components/Navbar";
import MainMenu from "./components/MainMenu";
import HoldingsChart from "./components/HoldingsChart.tsx";
import ConversionTool from "./components/ConversionTool.tsx";

// Import Styles
import "./App.css";

const App: React.FC = () => {
  // User ID state, fetched from local storage
  const [userId] = useState<number>(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) return parseInt(storedUserId);
    else return 0;
  });

  const {
    assets,
    transactions,
    holdings,
    addAsset,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalValue
  } = useTransactions(userId);

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <main className="pt-16 h-full w-full flex bg-gray-600 text-white">
        <div className="w-6/10 h-full p-4">
          <MainMenu
            assets={assets}
            transactions={transactions}
            holdings={holdings}
            addAsset={addAsset}
            addTransaction={addTransaction}
            editTransaction={editTransaction}
            deleteTransaction={deleteTransaction}
            totalValue={totalValue}
          />
        </div>
        <div className="w-4/10 flex flex-col bg-gray-600">
          <div className="h-6/10 p-4 flex items-center justify-center">
            <HoldingsChart holdings={holdings} />
          </div>
          <div className="h-4/10 p-4 flex items-center justify-center">
            <ConversionTool assets={assets} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

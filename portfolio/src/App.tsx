import React from "react";

import useHoldings from "./hooks/useHoldings";

import Navbar from "./components/Navbar";
import MainMenu from "./components/MainMenu";
import Chart from "./components/Chart";
import Analytics from "./components/Analytics";

import "./App.css";

// TODO
// Add average buy price in holdings
// Add PNL data
// Add 24hr and 7d %
// Fix up transaction form, reduce API calls
// Editable price in txn form
// Order holdings/txns by size/date
// Database integration
// Add cool tools

const App: React.FC = () => {

    const {dexHoldings, dexTransactions, addDexTransaction, totalValue} = useHoldings();

    return (
      <div className="h-screen w-screen">
          <Navbar />
          <main className="pt-16 h-full w-full flex bg-gray-100">
              <div className="w-1/2 h-full p-4">
                  <MainMenu
                      dexHoldings={dexHoldings}
                      dexTransactions={dexTransactions}
                      addDexTransaction={addDexTransaction}
                      totalValue={totalValue}
                  />
              </div>
              <div className="w-1/2 flex flex-col">
                  <div className="h-1/2 p-4 flex items-center justify-center">
                      <Chart dexHoldings={dexHoldings} />
                  </div>
                  <div className="h-1/2 p-4 flex items-center justify-center">
                      <Analytics />
                  </div>
              </div>
          </main>
      </div>
  )
}

export default App

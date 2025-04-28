/**
 * @file Main Menu Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Types
import { Asset, Holding, Transaction } from "../types/database.ts";

// Import Components
import Holdings from "./Holdings";
import Transactions from "./Transactions";
import AddTransaction from "./AddTransaction";
import Reports from "./Reports.tsx";

// Component Props
interface MainMenuProps {
    assets: Asset[];
    addAsset: (asset: any) => Promise<any>;
    holdings: Holding[];
    transactions: Transaction[];
    addTransaction: (transaction: any) => void;
    totalValue: () => number;
}

const MainMenu: React.FC<MainMenuProps> = ({ assets, addAsset, holdings, transactions, addTransaction, totalValue }) => {

    // State variables
    const [activeTab, setActiveTab] = useState<"holdings" | "txns" | "addTxn" | "reports">("holdings");

    // Renders active tab based on state
    const renderTab = {
        holdings: (
            <Holdings holdings={holdings} />
        ),
        txns: (
            <Transactions transactions={transactions} />
        ),
        addTxn: (
            <div className="h-7/10 px-30 py-10">
                <AddTransaction assets={assets} addAsset={addAsset} addTransaction={addTransaction} setActiveTab={setActiveTab} />
            </div>
        ),
        reports: (
            <Reports />
        )
    }

    return (
        <div className="h-full border-4 border-black rounded-sm flex flex-col">
            {/* Navbar */}
            <nav className="w-full bg-gray-900 text-white p-3 top-0 left-0">
                <div className="mx-auto flex justify-between items-center">
                    <button
                      className="bg-gray-700 border-gray-500 border-1 w-2/11 px-3 py-2 rounded-md hover:bg-gray-600 hover:cursor-pointer"
                      onClick={() => setActiveTab("reports")}
                    >
                        View Reports
                    </button>
                    <h1 className="text-3xl"> ${totalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })} </h1>
                    <button
                      className="bg-gray-700 border-gray-500 border-1 w-2/11 px-3 py-2 rounded-md hover:bg-gray-600 hover:cursor-pointer"
                      onClick={() => setActiveTab("addTxn")}
                    >
                        Add Transaction
                    </button>
                </div>
            </nav>
            {/* Total Portfolio Value Display */}
            <div className="w-full h-12 flex justify-center items-center p-4 bg-gray-800 border-b-3 border-black">
                <ul className="md:flex space-x-9 text-center">
                    <li className={`p-2 cursor-pointer ${activeTab === "holdings" ? "underline underline-offset-4 text-white" : ""}`}
                        onClick={() => setActiveTab("holdings")}
                    >
                        Holdings
                    </li>
                    <li className={`p-2 cursor-pointer ${activeTab === "txns" ? "underline underline-offset-4 text-white" : ""}`}
                        onClick={() => setActiveTab("txns")}
                    >
                        Transactions
                    </li>
                </ul>
            </div>
            {/* Active Tab */}
            <div className="dark w-full flex-1 overflow-y-auto">
                {renderTab[activeTab]}
            </div>
        </div>
    );
}

export default MainMenu;
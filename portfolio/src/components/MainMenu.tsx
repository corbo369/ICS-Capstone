/**
 * @file Main Menu Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Types
import { Asset, Holding, Transaction } from "../types/database.ts";

// Import Components
import HoldingsList from "./main-menu/holdings/HoldingsList.tsx";
import TransactionsList from "./main-menu/transactions/TransactionsList.tsx";
import TransactionCreate from "./main-menu/add-transaction/TransactionCreate.tsx";
import Reports from "./main-menu/reports/Reports.tsx";

// Component Props
interface MainMenuProps {
    assets: Asset[];
    addAsset: (asset: any) => Promise<any>;
    holdings: Holding[];
    transactions: Transaction[];
    addTransaction: (transaction: any) => void;
    editTransaction: (transaction: any) => void;
    deleteTransaction: (transactionId: number) => void;
    totalValue: () => number;
}

const MainMenu: React.FC<MainMenuProps> = ({ assets, addAsset, holdings, transactions, addTransaction, editTransaction, deleteTransaction, totalValue }) => {
    // State variables
    const [activeMainMenuTab, setActiveMainMenuTab] = useState<"holdingsList" | "transactionsList" | "transactionCreate" | "reports">("holdingsList");

    // Renders active tab based on state
    const renderTab = {
        holdingsList: (
            <HoldingsList holdings={holdings} />
        ),
        transactionsList: (
            <TransactionsList transactions={transactions} editTransaction={editTransaction} deleteTransaction={deleteTransaction} />
        ),
        transactionCreate: (
            <div className="h-8/10 px-30 py-10">
                <TransactionCreate assets={assets} addAsset={addAsset} addTransaction={addTransaction} setActiveMainMenuTab={setActiveMainMenuTab} />
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
                      onClick={() => setActiveMainMenuTab("reports")}
                    >
                        View Reports
                    </button>
                    <h1 className="text-3xl"> ${totalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })} </h1>
                    <button
                      className="bg-gray-700 border-gray-500 border-1 w-2/11 px-3 py-2 rounded-md hover:bg-gray-600 hover:cursor-pointer"
                      onClick={() => setActiveMainMenuTab("transactionCreate")}
                    >
                        Add Transaction
                    </button>
                </div>
            </nav>
            {/* Total Portfolio Value Display */}
            <div className="w-full h-12 flex justify-center items-center p-4 bg-gray-800 border-b-3 border-black">
                <ul className="md:flex space-x-9 text-center">
                    <li className={`p-2 cursor-pointer ${activeMainMenuTab === "holdingsList" ? "underline underline-offset-4 text-white" : ""}`}
                        onClick={() => setActiveMainMenuTab("holdingsList")}
                    >
                        Holdings
                    </li>
                    <li className={`p-2 cursor-pointer ${activeMainMenuTab === "transactionsList" ? "underline underline-offset-4 text-white" : ""}`}
                        onClick={() => setActiveMainMenuTab("transactionsList")}
                    >
                        Transactions
                    </li>
                </ul>
            </div>
            {/* Active Tab */}
            <div className="dark w-full flex-1 overflow-y-auto bg-gray-700">
                {renderTab[activeMainMenuTab]}
            </div>
        </div>
    );
}

export default MainMenu;
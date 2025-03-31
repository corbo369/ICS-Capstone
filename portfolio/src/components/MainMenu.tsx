import React, { useState } from "react";

import { DexHolding, Transaction } from "../types/holdings";

import Holdings from "./Holdings";
import Transactions from "./Transactions";
import AddTransaction from "./AddTransaction";

interface MainMenuProps {
    dexHoldings: DexHolding[];
    transactions: Transaction[];
    addTransaction: (transaction: any) => void;
    totalValue: () => number;
}

const MainMenu: React.FC<MainMenuProps> = ({ dexHoldings, transactions, addTransaction, totalValue }) => {

    const [activeTab, setActiveTab] = useState<"holdings" | "txns" | "addTxn">("holdings");

    const renderTab = {
        holdings: (
            <Holdings dexHoldings={dexHoldings} />
        ),
        txns: (
            <Transactions transactions={transactions} />
        ),
        addTxn: (
            <div className="h-full px-30 py-6">
                <AddTransaction addTransaction={addTransaction} setActiveTab={setActiveTab} />
            </div>
        )
    }

    return (
        <div className="h-full bg-white border-4 border-blue-600 rounded-sm flex flex-col">
            <nav className="w-full bg-blue-400 text-white p-3 top-0 left-0">
                <div className="mx-auto flex justify-between items-center">
                    <button className="text-black bg-blue-200 hover:bg-blue-100 border-2 border-blue-600 px-3 py-2 rounded-lg">
                        Select Portfolio =
                    </button>
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
                    <button className="text-black bg-blue-200 hover:bg-blue-100 border-2 border-blue-600 px-3 py-2 rounded-lg"
                            onClick={() => setActiveTab("addTxn")}
                    >
                        + Add Transaction
                    </button>
                </div>
            </nav>
            <div className="w-full h-20 flex justify-center items-center text-2xl p-4 bg-blue-200 border-b-3 border-blue-400">
                <h1> Portfolio Value: ${totalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })} </h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {renderTab[activeTab]}
            </div>
        </div>
    );
}

export default MainMenu;
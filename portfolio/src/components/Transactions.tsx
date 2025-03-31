import React from "react";

import { Transaction } from "../types/holdings";

interface TransactionsProps {
    transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({transactions}) => {

    return (
        <ul className="space-y-3">
            {transactions.map((txn) => (
                <li key={txn.TransactionID} className="flex items-center p-3 bg-blue-100 border-1 border-blue-400 rounded-lg shadow-sm w-full">
                    { txn.Type ? (
                        <h1 className="w-1/5 text-xl text-green-500 text-center">+</h1>
                    ) : (
                        <h1 className="w-1/5 text-xl text-red-500 text-center">-</h1>
                    )}
                    <p className="w-2/5 font-medium text-center">{txn.Asset?.Name}</p>
                    <p className="w-1/5 text-m text-gray-500 text-center">{txn.Amount} {txn.Asset?.Symbol}</p>
                    <p className="w-1/5 text-m text-gray-500 text-center">
                        ${txn.Price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="w-1/5 text-m text-gray-500 text-center">
                        {txn.Date}
                    </p>
                </li>
            ))}
        </ul>
    );
}

export default Transactions;
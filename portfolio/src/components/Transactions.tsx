import React from "react";

import { DexTransaction } from "../types/holdings";

interface TransactionsProps {
    dexTransactions: DexTransaction[];
}

const Transactions: React.FC<TransactionsProps> = ({dexTransactions}) => {

    return (
        <ul className="space-y-3">
            {dexTransactions.map((transaction) => (
                <li key={(transaction.amount * transaction.price)} className="flex items-center p-3 bg-blue-100 border-1 border-blue-400 rounded-lg shadow-sm w-full">
                    { transaction.type ? (
                        <h1 className="w-1/5 text-xl text-green-500 text-center">+</h1>
                    ) : (
                        <h1 className="w-1/5 text-xl text-red-500 text-center">-</h1>
                    )}
                    <p className="w-2/5 font-medium text-center">{transaction.name}</p>
                    <p className="w-1/5 text-m text-gray-500 text-center">{transaction.amount} {transaction.symbol}</p>
                    <p className="w-1/5 text-m text-gray-500 text-center">
                        ${transaction.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                </li>
            ))}
        </ul>
    );
}

export default Transactions;
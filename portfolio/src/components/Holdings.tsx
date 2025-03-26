import React from "react";

import { DexHolding } from "../types/holdings";

interface HoldingsProps {
    dexHoldings: DexHolding[];
}

const Holdings: React.FC<HoldingsProps> = ({dexHoldings}) => {

    return (
        <ul className="space-y-3">
            {dexHoldings.map((holding) => (
                <li key={(holding.amount * holding.price)} className="flex items-center p-3 bg-blue-100 border-1 border-blue-400 rounded-lg shadow-sm w-full">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <p className="w-1/3 font-medium text-center">{holding.name}</p>
                    <p className="w-1/5 text-m text-gray-500 text-center">{holding.amount} {holding.symbol}</p>
                    <p className="w-1/5 text-m text-gray-500 text-center">
                        ${holding.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="w-1/5 font-medium text-right">
                        ${(holding.amount * holding.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                </li>
            ))}
        </ul>
    );
}

export default Holdings;
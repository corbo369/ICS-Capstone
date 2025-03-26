import React from "react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import {DexHolding} from "../types/holdings.ts";

interface ChartProps {
    dexHoldings: DexHolding[];
}

const Chart: React.FC<ChartProps> = ({ dexHoldings }) => {

    const data = dexHoldings.map((holding) => ({
        name: holding.symbol,
        value: Number((holding.amount * holding.price).toFixed(2)),
    }));

    const colors: string[] = ["#ff7300", "#005aac", "#00C49F", "#FFBB28", "#FF8042", "#A28BE3", "#FF4560"];

    return (
        <div className="h-full w-full bg-blue-100 border-4 border-blue-600 rounded-sm flex flex-col">
            <h2 className="text-lg font-semibold text-center mb-4">Portfolio Allocation</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Chart;
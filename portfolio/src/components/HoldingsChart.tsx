import React from "react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import {Holding} from "../types/database.ts";

interface ChartProps {
    holdings: Holding[];
}

// TODO
// Fix color scheme

const HoldingsChart: React.FC<ChartProps> = ({ holdings }) => {

    // Calculates the total value of the user's holdings
    const totalValue = holdings.reduce((sum, h) => sum + h.Amount * h.Price, 0);

    const threshold = 0.015;
    const grouped: { name: string; value: number }[] = [];
    let otherTotal = 0;

    holdings.forEach((h) => {
        const value = h.Amount * h.Price;
        const percent = value / totalValue;
        if (percent < threshold) {
            otherTotal += value;
        } else {
            grouped.push({
                name: h.Symbol,
                value: parseFloat(value.toFixed(2)),
            });
        }
    });

    if (otherTotal > 0) {
        grouped.push({
            name: "Other",
            value: parseFloat(otherTotal.toFixed(2)),
        });
    }

    const colors: string[] = ["#ff7300", "#005aac", "#00C49F", "#FFBB28", "#FF8042", "#A28BE3", "#FF4560"];

    return (
        <div className="h-full w-full bg-gray-800 border-4 border-black rounded-sm flex flex-col">
            <h2 className="text-lg font-semibold text-center mb-4">Portfolio Allocation</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={grouped}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {grouped.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default HoldingsChart;
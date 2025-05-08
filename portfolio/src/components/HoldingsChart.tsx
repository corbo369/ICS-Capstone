/**
 * @file Holdings Chart Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React from "react";

// Import Components
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Import Types
import {Holding} from "../types/database.ts";

// Component Props
interface ChartProps {
    holdings: Holding[];
}

const HoldingsChart: React.FC<ChartProps> = ({ holdings }) => {

    // Calculates the total value of the user's holdings
    const totalValue = holdings.reduce((sum, h) => sum + h.Amount * h.Price, 0);

    // Set minimum threshold to include in chart
    const threshold = 0.015;
    // Holdings over the threshold percentage
    const grouped: { name: string; value: number }[] = [];
    // Holdings lower than threshold added to others
    let otherTotal = 0;

    // Group holdings by threshold
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

    // Push the other group to the list
    if (otherTotal > 0) {
        grouped.push({
            name: "Other",
            value: parseFloat(otherTotal.toFixed(2)),
        });
    }

    // Hex codes for the chart colors
    const colors: string[] = ["#ff7300", "#32c3fc", "#0aff70", "#FFBB28", "#A28BE3", "#FF4560", "#bababa"];

    return (
        <div className="h-full w-full bg-gray-700 border-4 border-black rounded-sm flex flex-col items-center">
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
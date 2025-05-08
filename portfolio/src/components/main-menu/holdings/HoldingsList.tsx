/**
 * @file HoldingsList List Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table.tsx"
import { ArrowUpDown } from "lucide-react";

// Import Types
import { Holding } from "@/types/database.ts";

// Component Props
interface HoldingsProps {
    holdings: Holding[];
}

const HoldingsList: React.FC<HoldingsProps> = ({holdings}) => {
    // Sorting state
    const [sortField, setSortField] = useState<"PNL" | "Value">("Value");
    const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");

    // Sorts the holdings list according to the active sort field
    const sortHoldings = [...holdings]
      .sort((a, b) => {
          if (sortField === "PNL") {
              const valueA = a.PNL;
              const valueB = b.PNL;
              return sortType === "DESC" ? valueB - valueA : valueA - valueB;
          } else {
              const valueA = a.Amount * a.Price;
              const valueB = b.Amount * b.Price;
              return sortType === "DESC" ? valueB - valueA : valueA - valueB;
          }
      });

    // Handles changes to the active sort field
    const handleSort = (field: "PNL" | "Value") => {
        if (sortField === field) {
            setSortType(sortType === "DESC" ? "ASC" : "DESC");
        } else {
            setSortField(field);
            setSortType("DESC");
        }
    }

    // Helper function for PNL styling
    const getPnlColor = (pnl: number) => {
        if (pnl > 0) return "text-green-300 text-right";
        if (pnl < 0) return "text-red-300 text-right";
        return "text-gray-400 text-right";
    };

    // Helper function for PNL multiplier
    const getPnlMultiplier = (pnl: number) => {
        if (pnl >= 0) return 1;
        else return -1;
    };

    return (
      <Table className="bg-gray-700">
          <TableHeader>
              <TableRow>
                  <TableHead className="text-left font-bold"> Asset </TableHead>
                  <TableHead className="text-right font-bold"> Balance </TableHead>
                  <TableHead className="text-right font-bold"> Price </TableHead>
                  <TableHead className="text-right font-bold"> Entry </TableHead>
                  <TableHead className="text-right font-bold">
                      <div className="flex flex-row items-center justify-end gap-1">
                          PNL
                          <ArrowUpDown
                            className="cursor-pointer h-4 w-4"
                            onClick={() => handleSort("PNL")}
                          />
                      </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                      <div className="flex flex-row items-center justify-end gap-1">
                          Value
                          <ArrowUpDown
                            className="cursor-pointer h-4 w-4"
                            onClick={() => handleSort("Value")}
                          />
                      </div>
                  </TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {sortHoldings.map((h) => (
                <TableRow className="h-15" key={h.Name}>
                    <TableCell className="text-left">
                        <div className="flex items-center gap-2">
                            <img
                              src={h.ImagePath}
                              alt={h.Symbol}
                              className="w-6 h-6 rounded-full border border-gray-700"
                            />
                            <span className="text-gray-100 font-bold">
                                {h.Name}
                                <span className="text-gray-400"> ({h.Symbol})</span>
                            </span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-100"> {h.Amount.toLocaleString()} </TableCell>
                    <TableCell className="text-right text-gray-100">
                        ${h.Price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 9 })}
                    </TableCell>
                    {h.AveragePrice < 0 ? (
                      <TableCell className="text-right text-gray-100">
                          {"< $0.00"}
                      </TableCell>
                    ) : (
                      <TableCell className="text-right text-gray-100">
                        ${h.AveragePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    )}
                    <TableCell className={getPnlColor(h.PNL)}>
                        ${(getPnlMultiplier(h.PNL) * h.PNL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right text-gray-100 font-bold">
                        ${(h.Amount * h.Price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                </TableRow>
              ))}
          </TableBody>
      </Table>
    );
}

export default HoldingsList;
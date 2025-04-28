/**
 * @file Holdings List Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react";

// Import Types
import { Holding } from "../types/database.ts";

// Component Props
interface HoldingsProps {
    holdings: Holding[];
}

const Holdings: React.FC<HoldingsProps> = ({holdings}) => {
    const [sortField, setSortField] = useState<"PNL" | "Value">("Value");
    const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");

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
        if (pnl > 0) return "text-green-600 text-center";
        if (pnl < 0) return "text-red-600 text-center";
        return "text-gray-500 text-center";
    };

    // Helper function for PNL type
    const getPnlMultiplier = (pnl: number) => {
        if (pnl >= 0) return 1;
        else return -1;
    };

    return (
      <Table className="bg-gray-700">
          <TableHeader>
              <TableRow>
                  <TableHead className="text-center"> Asset </TableHead>
                  <TableHead className="text-center"> Balance </TableHead>
                  <TableHead className="text-center"> Price </TableHead>
                  <TableHead className="text-center"> Entry </TableHead>
                  <TableHead className="text-center">
                      <div className="flex flex-row items-center justify-center gap-1">
                          PNL
                          <ArrowUpDown
                            className="cursor-pointer h-4 w-4"
                            onClick={() => handleSort("PNL")}
                          />
                      </div>
                  </TableHead>
                  <TableHead className="text-center">
                      <div className="flex flex-row items-center justify-center gap-1">
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
                <TableRow key={h.Name}>
                    <TableCell className="text-center"> {h.Name }</TableCell>
                    <TableCell className="text-center"> {h.Amount} {h.Symbol} </TableCell>
                    <TableCell className="text-center">
                        {h.Price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </TableCell>
                    <TableCell className="text-center">
                        {h.AveragePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={getPnlColor(h.PNL)}>
                        {(getPnlMultiplier(h.PNL) * h.PNL).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                        ${(h.Amount * h.Price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                </TableRow>
              ))}
          </TableBody>
      </Table>
    );
}

export default Holdings;
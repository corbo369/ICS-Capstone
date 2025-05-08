/**
 * @file Realized Profit Report Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table.tsx"
import { ArrowUpDown, Filter } from "lucide-react";

// Import Types
import { RealizedProfitReport } from "@/types/database.ts";

// Component Props
interface BalanceChangeProps {
  realizedProfitReport: RealizedProfitReport[];
}

const RealizedProfit: React.FC<BalanceChangeProps> = ({realizedProfitReport}) => {
  // Sorting/filtering state
  const [sortField, setSortField] = useState<"firstDate" | "lastDate" | "profit">("profit");
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");
  const [filters, setFilters] = useState({ type: "", asset: "" });

  // Sorts the holdings list according to the active sort field
  const sortReport = [...realizedProfitReport]
    .sort((a, b) => {
      if (sortField === "firstDate") {
        const valueA = new Date(a.FirstTransactionDate).getTime();
        const valueB = new Date(b.FirstTransactionDate).getTime();
        return sortType === "DESC" ? valueB - valueA : valueA - valueB;
      } else if (sortField === "lastDate") {
        const valueA = new Date(a.LastTransactionDate).getTime();
        const valueB = new Date(b.LastTransactionDate).getTime();
        return sortType === "DESC" ? valueB - valueA : valueA - valueB;
      } else {
        const valueA = a.RealizedProfit;
        const valueB = b.RealizedProfit;
        return sortType === "DESC" ? valueB - valueA : valueA - valueB;
      }
    });

  // Handles changes to the active sort field
  const handleSort = (field: "lastDate" | "firstDate" | "profit") => {
    if (sortField === field) {
      setSortType(sortType === "DESC" ? "ASC" : "DESC");
    } else {
      setSortField(field);
      setSortType("DESC");
    }
  }

  // Helper function for profit styling
  const getProfitColor = (profit: number) => {
    if (profit > 0) return "text-green-300 text-right";
    if (profit < 0) return "text-red-300 text-right";
    return "text-gray-400 text-right";
  };

  // Helper function for profit multiplier
  const getProfitMultiplier = (profit: number) => {
    if (profit >= 0) return 1;
    else return -1;
  };

  return (
    <Table className="bg-gray-700">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left font-bold"> Asset </TableHead>
          <TableHead className="text-right font-bold">
            <div className="flex flex-row items-center justify-end gap-1">
              First Transaction
              <ArrowUpDown
                className="cursor-pointer h-4 w-4"
                onClick={() => handleSort("firstDate")}
              />
            </div>
          </TableHead>
          <TableHead className="text-right font-bold">
            <div className="flex flex-row items-center justify-end gap-1">
              Last Transaction
              <ArrowUpDown
                className="cursor-pointer h-4 w-4"
                onClick={() => handleSort("lastDate")}
              />
            </div>
          </TableHead>
          <TableHead className="flex justify-end text-right font-bold">
            <div className="flex flex-row items-center justify-center gap-1">
              Realized Profit
              <ArrowUpDown
                className="cursor-pointer h-4 w-4"
                onClick={() => handleSort("profit")}
              />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center">
                  <Filter className="h-4 w-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark w-48">

                  <div className="px-2 py-1 text-xs text-gray-400">Type</div>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "gain"}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === "gain" ? "" : "gain"
                    }))}
                  >
                    Gain
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "loss"}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === "loss" ? "" : "loss"
                    }))}
                  >
                    Loss
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />

                  <div className="px-2 py-1 text-xs text-gray-400">Asset</div>
                  {Array.from(new Set(realizedProfitReport.map(t => t.Name))).map(asset => (
                    <DropdownMenuCheckboxItem
                      key={asset}
                      checked={filters.asset === asset}
                      onCheckedChange={() => setFilters(prev => ({
                        ...prev,
                        asset: prev.asset === asset ? "" : asset
                      }))}
                    >
                      {asset}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-300 cursor-pointer"
                    onClick={() => setFilters({ type: "", asset: "" })}
                  >
                    Clear Filters
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortReport
          .filter(t => {
            const typeMatch = filters.type
              ? (filters.type === "gain"
                ? t.RealizedProfit >= 0
                : t.RealizedProfit < 0)
              : true;
            const assetMatch = filters.asset
              ? t.Name === filters.asset
              : true;
            return typeMatch && assetMatch;
          })
          .map(r => (
            <TableRow className="h-15" key={r.Name}>
              <TableCell className="text-left">
                <div className="flex items-center gap-2">
                  <img
                    src={r.ImagePath}
                    alt={r.Symbol}
                    className="w-6 h-6 rounded-full border border-gray-700"
                  />
                  <span className="text-gray-100 font-bold">
                      {r.Name + " "}
                    <span className="text-gray-400">({r.Symbol})</span>
                    </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  timeZone: "UTC"
                }).format(new Date(r.FirstTransactionDate + "T00:00:00Z"))}
              </TableCell>
              <TableCell className="text-right">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  timeZone: "UTC"
                }).format(new Date(r.LastTransactionDate + "T00:00:00Z"))}
              </TableCell>
              <TableCell className={getProfitColor(r.RealizedProfit)}>
                ${(getProfitMultiplier(r.RealizedProfit) * r.RealizedProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default RealizedProfit;
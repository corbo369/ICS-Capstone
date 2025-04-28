/**
 * @file Transactions List Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table"

// Import Types
import { Transaction } from "../types/database.ts";

// Component Props
interface TransactionsProps {
    transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({transactions}) => {
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");
  const [filters, setFilters] = useState({ type: "", asset: "" });

  const sortTransactions = [...transactions]
    .sort((a, b) => {
      const valueA = new Date(a.Date).getTime();
      const valueB = new Date(b.Date).getTime();
      return sortType === "DESC" ? valueB - valueA : valueA - valueB;
    });

  return (
    <Table className="bg-gray-700">
      <TableHeader>
        <TableRow>
            <TableHead className="text-center"> Type </TableHead>
            <TableHead className="text-center"> Asset </TableHead>
            <TableHead className="text-center"> Amount </TableHead>
            <TableHead className="text-center"> Price </TableHead>
            <TableHead className="text-center">
              <div className="flex flex-row items-center justify-center gap-1">
                Date
                <ArrowUpDown
                  className="cursor-pointer h-4 w-4"
                  onClick={() => setSortType(sortType === "DESC" ? "ASC" : "DESC")}
                />
              </div>
            </TableHead>
            <TableHead className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center">
                  <Filter className="h-4 w-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark w-48">

                  <div className="px-2 py-1 text-xs text-gray-400">Type</div>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "buy"}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === "buy" ? "" : "buy"
                    }))}
                  >
                    Buy
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "sell"}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === "sell" ? "" : "sell"
                    }))}
                  >
                    Sell
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />

                  <div className="px-2 py-1 text-xs text-gray-400">Asset</div>
                  {Array.from(new Set(transactions.map(t => t.Name))).map(asset => (
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
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortTransactions
            .filter(t => {
              const typeMatch = filters.type ? (filters.type === "buy" ? t.Type : !t.Type) : true;
              const assetMatch = filters.asset ? t.Name === filters.asset : true;
              return typeMatch && assetMatch;
            })
            .map(t => (
            <TableRow key={t.TransactionID}>
              { t.Type ? (
                <TableCell className="text-2xl text-green-500 text-center">+</TableCell>
              ) : (
                <TableCell className="text-2xl text-red-500 text-center">-</TableCell>
              )}
              <TableCell className="text-center">
                {t.Name}
              </TableCell>
              <TableCell className="text-center">
                {t.Amount} {t.Symbol}
              </TableCell>
              <TableCell className="text-center">
                ${t.Price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-center">
                {new Date(t.Date).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </TableCell>
              <TableCell className="cursor-pointer">
                Edit
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}

export default Transactions;
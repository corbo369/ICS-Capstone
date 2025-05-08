/**
 * @file Transactions List Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table.tsx"
import TransactionEdit from "@/components/main-menu/transactions/TransactionEdit.tsx";
import { ArrowUpDown, Filter, SquarePen, CircleX } from "lucide-react";

// Import Types
import { Transaction } from "@/types/database.ts";

// Component Props
interface TransactionsListProps {
  transactions: Transaction[];
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: number) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({transactions, editTransaction, deleteTransaction}) => {
  // Active tab state
  const [activeTransactionsListTab, setActiveTransactionsListTab] = useState<"transactionsList" | "transactionEdit">("transactionsList");

  // Sorting/Filtering state
  const [sortField, setSortField] = useState<"Value" | "Date">("Date");
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");
  const [filters, setFilters] = useState({ type: "", asset: "" });

  // Edit/Delete row selection state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Sorts transactions depending on active state
  const sortTransactions = [...transactions].sort((a, b) => {
    if (sortField === "Date") {
      const valueA = new Date(a.Date).getTime();
      const valueB = new Date(b.Date).getTime();
      return sortType === "DESC" ? valueB - valueA : valueA - valueB;
    } else {
      const valueA = a.Amount * a.Price;
      const valueB = b.Amount * b.Price;
      return sortType === "DESC" ? valueB - valueA : valueA - valueB;
    }
  });

  // Handles changes to the active sort field
  const handleSort = (field: "Value" | "Date") => {
    if (sortField === field) {
      setSortType(sortType === "DESC" ? "ASC" : "DESC");
    } else {
      setSortField(field);
      setSortType("DESC");
    }
  }

  // Handles clicks to the edit transaction buttons
  const handleTransactionEdit = (transactionId: number) => {
    const transaction = transactions.find(t => t.TransactionID === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setActiveTransactionsListTab("transactionEdit");
    }
  }

  // Renders active tab based on state
  const renderActiveTransactionsListTab = {
    transactionsList: (
      <Table className="bg-gray-700">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left font-bold"> Asset </TableHead>
            <TableHead className="text-right font-bold"> Amount </TableHead>
            <TableHead className="text-right font-bold"> Price </TableHead>
            <TableHead className="text-center font-bold">
              <div className="flex flex-row items-center justify-end gap-1">
                Value
                <ArrowUpDown
                  className="cursor-pointer h-4 w-4"
                  onClick={() => handleSort("Value")}
                />
              </div>
            </TableHead>
            <TableHead className="text-right font-bold">
              <div className="flex items-center justify-end gap-1">
                Date
                <ArrowUpDown
                  className="cursor-pointer h-4 w-4"
                  onClick={() => handleSort("Date")}
                />
              </div>
            </TableHead>
            <TableHead className="text-right font-bold">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2">
                    Filter
                    <Filter className="h-4 w-4 cursor-pointer" />
                  </div>
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
                  {Array.from(new Set(sortTransactions.map(t => t.Name))).map(asset => (
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
              const typeMatch = filters.type
                ? (filters.type === "buy"
                  ? t.Type
                  : !t.Type)
                : true;
              const assetMatch = filters.asset
                ? t.Name === filters.asset
                : true;
              return typeMatch && assetMatch;
            })
            .map(t => (
              <TableRow className="h-15" key={t.TransactionID}>
                <TableCell className="text-left">
                  <div className="flex items-center gap-2">
                    <img
                      src={t.ImagePath}
                      alt={t.Symbol}
                      className="w-6 h-6 rounded-full border border-gray-700"
                    />
                    <span className="text-gray-100 font-bold">
                      {t.Name + " "}
                      <span className="text-gray-400">
                        ({t.Symbol})
                      </span>
                    </span>
                  </div>
                </TableCell>
                { t.Type ? (
                  <TableCell className="text-green-300 text-right">
                    {t.Amount.toLocaleString()}
                  </TableCell>
                ) : (
                  <TableCell className="text-red-300 text-right">
                    {t.Amount.toLocaleString()}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  ${t.Price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right text-gray-100">
                  ${(t.Amount * t.Price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    timeZone: "UTC"
                  }).format(new Date(t.Date + "T00:00:00Z"))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-4">
                    <SquarePen
                      className="cursor-pointer h-5 w-5 text-green-300"
                      onClick={() => handleTransactionEdit(t.TransactionID)}
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <CircleX
                          className="cursor-pointer h-5 w-5 text-red-300"
                          onClick={() => setConfirmDeleteId(t.TransactionID)}
                        />
                      </DialogTrigger>
                      <DialogContent className="bg-gray-700 border-3 border-gray-500 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-3xl text-center">Delete This Transaction?</DialogTitle>
                        </DialogHeader>
                        <p className="text-center">Transaction Will Be Permanently Deleted</p>
                        <div className="pt-4 flex flex-col gap-2">
                          <button
                            className="w-full rounded-sm bg-red-300 border-2 border-gray-800 text-black p-2 cursor-pointer"
                            onClick={() => {
                              if (confirmDeleteId !== null) {
                                deleteTransaction(confirmDeleteId);
                                setConfirmDeleteId(null);
                              }
                            }}
                          >
                            Delete
                          </button>
                          <button
                            className="w-full rounded-sm bg-gray-300 border-2 border-gray-800 text-black p-2 cursor-pointer"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    ),
    transactionEdit: (
      <div className="h-8/10 px-30 py-10">
        <TransactionEdit
          selectedTransaction={selectedTransaction}
          editTransaction={editTransaction}
          setActiveTransactionsListTab={setActiveTransactionsListTab}
        />
      </div>
    ),
  }

  return (
    <div className="h-full w-full">
      {renderActiveTransactionsListTab[activeTransactionsListTab]}
    </div>
  );
}

export default TransactionsList;
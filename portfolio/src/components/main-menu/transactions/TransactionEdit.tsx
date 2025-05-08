/**
 * @file Edit Existing Transaction Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Components
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { CalendarDays } from "lucide-react";

// Import Types
import { Transaction } from "@/types/database.ts";

// Component Props
interface TransactionEditProps {
  selectedTransaction: Transaction | null;
  editTransaction: (transaction: Transaction) => void;
  setActiveTransactionsListTab: (tab: "transactionsList" | "transactionEdit") => void;
}

const TransactionEdit: React.FC<TransactionEditProps> = ({selectedTransaction, editTransaction, setActiveTransactionsListTab}) => {
  // Transaction values state
  const [type, setType] = useState<boolean>(selectedTransaction ? selectedTransaction.Type : true);
  const [amount, setAmount] = useState<number | undefined>(selectedTransaction ? selectedTransaction.Amount : 0);
  const [price, setPrice] = useState<number | undefined>(selectedTransaction ? selectedTransaction.Price : 0);
  const [date, setDate] = useState<Date | undefined>(selectedTransaction ? new Date(selectedTransaction.Date) : undefined);

  // Converts input values to USD format
  const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  // Handles transaction create edit submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Confirm all input fields are filled
    if (!selectedTransaction) return alert("Error Finding Transaction");
    if (!amount) return alert("Please Enter an Amount");
    if (!price) return alert("Please Enter a Price");
    if (!date) return alert("Please Enter a Date");

    // Construct updated transaction
    const updatedTransaction = {
      ...selectedTransaction,
      Type: type,
      Amount: amount,
      Price: price,
      Date: date.toISOString().split("T")[0],
    }

    // Update in database
    editTransaction(updatedTransaction);

    // Set active tab
    setActiveTransactionsListTab("transactionsList");
  };

  return (
    <div className="flex h-full p-3 rounded-sm bg-gray-600 border-3 border-black">
      <form onSubmit={handleSubmit} className="h-full w-full flex flex-col justify-center m-1 space-y-3">
        {/* Asset Name and Buy/Sell Radio Buttons*/}
        <div className="h-1/6 w-full flex items-center space-x-1">
          <input
            name="name"
            type="text"
            autoComplete="off"
            className="h-full w-full p-2 rounded-sm bg-gray-500 border-3 border-gray-800 text-center text-2xl
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
            value={selectedTransaction ? selectedTransaction.Name : ""}
            readOnly
          />
          <button
            type="button"
            className={`cursor-pointer h-full w-full rounded-sm text-xl border-3 border-gray-800 ${type ? "bg-gray-700" : "bg-gray-500"}`}
            onClick={() => setType(true)}
          >
            Buy
          </button>
          <button
            type="button"
            className={`cursor-pointer h-full w-full rounded-sm text-xl border-3 border-gray-800 ${!type ? "bg-gray-700" : "bg-gray-500"}`}
            onClick={() => setType(false)}
          >
            Sell
          </button>
        </div>
        {/* Date Selection */}
        <div className="h-1/6 w-full flex space-x-1">
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Date:
              <Popover>
                <PopoverTrigger asChild>
                  <CalendarDays
                    className="h-2/3 w-1/4 p-1 rounded-sm text-white hover:cursor-pointer"
                  >
                  </CalendarDays>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border border-gray-700 text-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </label>
            <input
              name="value"
              type="text"
              step="any"
              autoComplete="off"
              placeholder="Select Date"
              className="h-full w-2/3 p-2 text-center
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={date ? date.toLocaleDateString("en-US") : ""}
              readOnly
            />
          </div>
        </div>
        {/* Amount and Price Inputs */}
        <div className="h-1/6 w-full flex space-x-1">
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Amount:
            </label>
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              className="h-full w-2/3 p-2 text-center
                    focus:outline-none
                    placeholder:text-gray-300
                    [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none"
              value={amount ?? ""}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Price:
            </label>
            <input
              name="price"
              type="number"
              inputMode="decimal"
              autoComplete="off"
              placeholder="$0.00"
              className="h-full w-2/3 p-2 text-center
                      focus:outline-none
                      placeholder:text-gray-300
                      [appearance:textfield]
                      [&::-webkit-inner-spin-button]:appearance-none"
              value={price ?? ""}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>
        </div>
        {/* Total Value Field */}
        <div className="h-1/6 w-full flex space-x-1">
          <div className="flex items-center h-full w-full rounded-sm bg-gray-500 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              Transaction Value:
            </label>
            <input
              name="value"
              type="text"
              step="any"
              autoComplete="off"
              placeholder="$0.00"
              className="h-full w-2/3 p-2 text-center
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={(amount === undefined || price === undefined || isNaN(amount) || isNaN(price)) ? "" : usdFormatter.format(price * amount)}
              readOnly
            />
          </div>
        </div>
        {/* Confirm/Delete Buttons */}
        <div className="h-1/3 w-full flex flex-col items-center space-y-2">
          <button type="submit" className="w-full rounded-sm bg-green-300 border-2 border-gray-800 text-black p-2 cursor-pointer">
            CONFIRM
          </button>
          <button type="button" className="w-full rounded-sm bg-red-300  border-2 border-gray-800 text-black p-2 cursor-pointer"
                  onClick={() => setActiveTransactionsListTab("transactionsList")}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionEdit
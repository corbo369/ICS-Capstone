/**
 * @file Reports Menu Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Hooks
import useReports from "@/hooks/useReports.ts";

// Import Components
import BalanceChange from "@/components/main-menu/reports/BalanceChange.tsx";
import RealizedProfit from "@/components/main-menu/reports/RealizedProfit.tsx";
import TaxInformation from "@/components/main-menu/reports/TaxInformation.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import ComboBox from "@/components/ui/combo-box.tsx";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover.tsx";
import { CalendarDays } from "lucide-react";

const Reports: React.FC = () => {
  // Active tab state
  const [activeReportTab, setActiveReportTab] = useState<"none" | "balanceChange" | "realizedProfit" | "taxInformation">("none");

  // Report type state
  const [reportType, setReportType] = useState<string>("");

  // Start/End Date state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // User ID state, fetched from local storage
  const [userId] = useState<number>(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) return parseInt(storedUserId);
    else return 0;
  });

  const {
    balanceChangeReport,
    realizedProfitReport,
    taxInformationReport,
    generateBalanceChangeReport,
    generateRealizedProfitReport,
    generateTaxInformationReport
  } = useReports(userId);

  // Combo box report options
  const options = [
    { value: "balanceChange", label: "Balance Change" },
    { value: "realizedProfit", label: "Realized Profit" },
    { value: "taxInformation", label: "Tax Information" },
  ]

  // Handles clicks to the generate report button
  const handleGenerate = async () => {

    // Ensures both dates are selected
    if (!startDate || !endDate) return alert("Please Select a Date Range");

    if (reportType === "balanceChange") {
      await generateBalanceChangeReport(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]);
      setActiveReportTab("balanceChange");
    }

    if (reportType === "realizedProfit") {
      await generateRealizedProfitReport(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]);
      setActiveReportTab("realizedProfit");
    }

    if (reportType === "taxInformation") {
      await generateTaxInformationReport(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]);
      setActiveReportTab("taxInformation");
    }
  }

  // Renders active tab based on state
  const renderActiveReportTab = {
    none: (
      <div/>
    ),
    balanceChange: (
      <BalanceChange balanceChangeReport={balanceChangeReport} />
    ),
    realizedProfit: (
      <RealizedProfit realizedProfitReport={realizedProfitReport} />
    ),
    taxInformation: (
      <TaxInformation taxInformationReport={taxInformationReport} />
    ),
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-700">
      <div className="h-1/10 w-full pl-3 pr-3 flex items-center justify-between border-b-3">
        <div className="h-3/4 w-1/5 rounded-lg border-3 border-gray-800">
          <ComboBox
            options={options}
            value={reportType ? reportType : ""}
            onChange={(newValue) => setReportType(newValue)}
            type={"reports"}
          />
        </div>
        <div className="h-3/4 w-1/5 flex space-x-1">
          <div className="flex items-center h-full w-full rounded-lg bg-gray-600 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              <Popover>
                <PopoverTrigger asChild>
                  <CalendarDays
                    className="h-full w-full p-1 rounded-sm text-white hover:cursor-pointer"
                  >
                  </CalendarDays>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border border-gray-700 text-white">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
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
              placeholder="Start Date"
              className="h-full w-2/3 p-2 text-center
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={startDate ? startDate.toLocaleDateString("en-US") : ""}
              readOnly
            />
          </div>
        </div>
        <div className="h-3/4 w-1/5 flex space-x-1">
          <div className="flex items-center h-full w-full rounded-lg bg-gray-600 border-3 border-gray-800 text-gray-100">
            <label className="flex items-center justify-center h-full w-1/3 border-r-2 border-gray-700">
              <Popover>
                <PopoverTrigger asChild>
                  <CalendarDays
                    className="h-full w-full p-1 rounded-sm text-white hover:cursor-pointer"
                  >
                  </CalendarDays>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border border-gray-700 text-white">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
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
              placeholder="End Date"
              className="h-full w-2/3 p-2 text-center
                focus:outline-none
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none"
              value={endDate ? endDate.toLocaleDateString("en-US") : ""}
              readOnly
            />
          </div>
        </div>
        <button
          className="h-3/4 w-1/5 rounded-lg bg-gray-600 border-3 border-gray-800 text-gray-200 hover:cursor-pointer hover:bg-gray-500"
          onClick={() => handleGenerate()}
        >
          Generate
        </button>
      </div>
      <div className="h-9/10 w-full">
        {renderActiveReportTab[activeReportTab]}
      </div>
    </div>
  );
}

export default Reports;
/**
 * @file Tax Information Report Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useState } from "react";

// Import Components
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { ArrowUpDown, Filter } from "lucide-react";

// Import Types
import { TaxInformationReport } from "@/types/database.ts";

// Component Props
interface TaxInformationProps {
  taxInformationReport: TaxInformationReport[];
}

const TaxInformation: React.FC<TaxInformationProps> = ({taxInformationReport}) => {
  // Sorting/filtering state
  const [sortField, setSortField] = useState<"shortTermGains" | "longTermGains">("shortTermGains");
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");
  const [filters, setFilters] = useState({ asset: "" });

  // Sorts the holdings list according to the active sort field
  const sortReport = [...taxInformationReport]
    .sort((a, b) => {
      if (sortField === "shortTermGains") {
        const valueA = a.TotalShortTermCapitalGains;
        const valueB = b.TotalShortTermCapitalGains;
        return sortType === "DESC" ? valueB - valueA : valueA - valueB;
      } else {
        const valueA = a.TotalLongTermCapitalGains;
        const valueB = b.TotalLongTermCapitalGains;
        return sortType === "DESC" ? valueB - valueA : valueA - valueB;
      }
    });

  // Handles changes to the active sort field
  const handleSort = (field: "shortTermGains" | "longTermGains") => {
    if (sortField === field) {
      setSortType(sortType === "DESC" ? "ASC" : "DESC");
    } else {
      setSortField(field);
      setSortType("DESC");
    }
  }

  // Helper function for Gains styling
  const getGainColor = (gain: number) => {
    if (gain > 0) return "text-green-300 text-right";
    if (gain < 0) return "text-red-300 text-right";
    return "text-gray-400 text-right";
  };

  // Helper function for Gains multiplier
  const getGainMultiplier = (gain: number) => {
    if (gain >= 0) return 1;
    else return -1;
  };

  return (
    <Table className="bg-gray-700">
      <TableHeader>
        <TableRow>
          <TableHead className="flex justify-start font-bold">
            <div className="flex flex-row items-center gap-1">
              Asset
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center">
                  <Filter className="h-4 w-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark w-48">
                  <div className="px-2 py-1 text-xs text-gray-400">Asset</div>
                  {Array.from(new Set(taxInformationReport.map(t => t.Name))).map(asset => (
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
                    onClick={() => setFilters({ asset: "" })}
                  >
                    Clear Filters
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableHead>
          <TableHead className="text-right font-bold"> ST Amount Eligible </TableHead>
          <TableHead className="text-right font-bold"> LT Amount Eligible </TableHead>
          <TableHead className="text-right font-bold">
            <div className="flex flex-row items-center justify-end gap-1">
              ST Gain/Loss
              <ArrowUpDown
                className="cursor-pointer h-4 w-4"
                onClick={() => handleSort("shortTermGains")}
              />
            </div>
          </TableHead>
          <TableHead className="text-right font-bold">
            <div className="flex flex-row items-center justify-end gap-1">
              LT Gain/Loss
              <ArrowUpDown
                className="cursor-pointer h-4 w-4"
                onClick={() => handleSort("longTermGains")}
              />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortReport
          .filter(t => {
            return filters.asset
              ? t.Name === filters.asset
              : true;
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
                {r.TotalShortTermEligibleAmount}
              </TableCell>
              <TableCell className="text-right">
                {r.TotalLongTermEligibleAmount}
              </TableCell>
              <TableCell className={getGainColor(r.TotalShortTermCapitalGains)}>
                ${(getGainMultiplier(r.TotalShortTermCapitalGains) * r.TotalShortTermCapitalGains).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className={getGainColor(r.TotalLongTermCapitalGains)}>
                ${(getGainMultiplier(r.TotalLongTermCapitalGains) * r.TotalLongTermCapitalGains).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

export default TaxInformation;
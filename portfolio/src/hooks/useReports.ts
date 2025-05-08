/**
 * @file API Route Integration Functions for Reports
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import { useState } from "react";

// Import Typers
import { BalanceChangeReport, RealizedProfitReport, TaxInformationReport } from "@/types/database.ts";

const useReports = (userId: number) => {
  // State variables
  const [balanceChangeReport, setBalanceChangeReport] = useState<BalanceChangeReport[]>([]);
  const [realizedProfitReport, setRealizedProfitReport] = useState<RealizedProfitReport[]>([]);
  const [taxInformationReport, setTaxInformationReport] = useState<TaxInformationReport[]>([]);

  // Set Token
  const token = localStorage.getItem("token");

  // Fetch balance change report
  const generateBalanceChangeReport = async (startDate: string, endDate: string) => {
    try {
      const url = new URL(`/api/v1/reports/${userId}/balance-change`, window.location.origin);
      url.searchParams.append("StartDate", startDate);
      url.searchParams.append("EndDate", endDate);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      const data = await res.json();
      setBalanceChangeReport(data);
    } catch (error) {
      console.error("Failed to generate balance change report: ", error);
    }
  }

  // Fetch realized profit report
  const generateRealizedProfitReport = async (startDate: string, endDate: string) => {
    try {
      const url = new URL(`/api/v1/reports/${userId}/realized-profit`, window.location.origin);
      url.searchParams.append("StartDate", startDate);
      url.searchParams.append("EndDate", endDate);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      const data = await res.json();
      setRealizedProfitReport(data);
    } catch (error) {
      console.error("Failed to generate realized profit report: ", error);
    }
  }

  // Fetch tax information report
  const generateTaxInformationReport = async (startDate: string, endDate: string) => {
    try {
      const url = new URL(`/api/v1/reports/${userId}/tax-information`, window.location.origin);
      url.searchParams.append("StartDate", startDate);
      url.searchParams.append("EndDate", endDate);
      url.searchParams.append("CurrentDate", (new Date()).toISOString().split("T")[0]);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      const data = await res.json();
      setTaxInformationReport(data);
    } catch (error) {
      console.error("Failed to generate tax information report: ", error);
    }
  }

  return { balanceChangeReport, realizedProfitReport, taxInformationReport, generateBalanceChangeReport, generateRealizedProfitReport, generateTaxInformationReport };
}

export default useReports;
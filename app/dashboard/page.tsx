"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidenavbar from "../components/navbars/sidenavbar";
import Topnavbar from "../components/navbars/topnavbar";
import Charts from "../components/charts/charts";
import YearlyCharts from "../components/yearlyCharts/yearlyCharts";
import Transactions from "../components/transactions/transactions";
import {
  User,
  Transaction,
  TransactionTypeColor,
  CategoryColor,
} from "../types";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [transactionsError, setTransactionsError] = useState(null);
  const [yearlyTransactions, setYearlyTransactions] = useState<Transaction[]>();
  const [categoryColors, setCategoryColors] = useState<CategoryColor[]>();
  const [typeColors, setTypeColors] = useState<TransactionTypeColor[]>();
  const [activeTab, setActiveTab] = useState("charts");
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<string>("monthly");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const view = searchParams.get("view");
    if (view) setMode(view);
  }, []);

  const [userYears, setUserYears] = useState([]);

  const router = useRouter();

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    Number(searchParams.get("month")) || today.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    Number(searchParams.get("year")) || today.getFullYear()
  );

  const updateSelection = (month: number, year: number, view: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setMode(view);
    const params = new URLSearchParams();
    params.set("year", `${year}`);
    params.set("view", view);
    if (view === "monthly") {
      params.set("month", `${month}`);
    }
    if (router) {
      router.replace(`?${params.toString()}`);
    }
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
          {
            credentials: "include",
            headers: {
              timezone: userTimezone,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setUser(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error(err.message);
        } else {
          setError("Error fetching user data");
        }
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${selectedMonth}/${selectedYear}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setTransactions(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error(err.message);
        } else {
          setError("Error fetching transactions");
        }
      }
    }

    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    async function fetchYears() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/years`,
        { credentials: "include" }
      );

      const data = await res.json();
      setUserYears(data.years);
    }

    fetchYears();
  }, []);

  useEffect(() => {
    async function fetchYearlyTransactions() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/yearly/${selectedYear}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setYearlyTransactions(data);
    }

    fetchYearlyTransactions();
  }, [selectedYear]);

  useEffect(() => {
    async function fetchCategoryColors() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categoryColors/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      setCategoryColors(data);
    }

    fetchCategoryColors();
  }, [categoryColors]);

  useEffect(() => {
    async function fetchTransactionTypeColors() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactionTypeColors/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      setTypeColors(data);
    }

    fetchTransactionTypeColors();
  }, [typeColors]);

  if (!user) return <p>Loading dashboard...</p>;

  if (error) return error;

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/logout`;
  };

  const handleActiveTabChange = (e: React.ChangeEvent<HTMLElement>) => {
    setActiveTab(e.target.id);
  };

  return (
    <div className={styles.dashboard}>
      <Sidenavbar
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        availableYears={userYears}
        updateSelection={updateSelection}
        mode={mode}
      ></Sidenavbar>
      <div className={styles.content}>
        <Topnavbar
          userName={user.displayName}
          handleLogout={handleLogout}
          activeTab={activeTab}
          handleActiveTabChange={(e) => handleActiveTabChange(e)}
          categoryColors={categoryColors}
          typeColors={typeColors}
        />
        {activeTab === "charts" ? (
          mode == "monthly" ? (
            <Charts
              transactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              mode={mode}
              categoryColors={categoryColors}
              typeColors={typeColors}
            ></Charts>
          ) : (
            <YearlyCharts
              transactions={yearlyTransactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              mode={mode}
              categoryColors={categoryColors}
              typeColors={typeColors}
            ></YearlyCharts>
          )
        ) : mode == "monthly" ? (
          <Transactions transactions={transactions}></Transactions>
        ) : (
          <Transactions transactions={yearlyTransactions}></Transactions>
        )}
      </div>
    </div>
  );
}

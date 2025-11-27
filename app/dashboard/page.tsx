"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidenavbar from "../components/navbars/sidenavbar";
import Topnavbar from "../components/navbars/topnavbar";
import Charts from "../components/charts/charts";
import YearlyCharts from "../components/yearlyCharts/yearlyCharts";
import Transactions from "../components/transactions/transactions";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsError, setTransactionsError] = useState(null);
  const [yearlyTransactions, setYearlyTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("charts");
  const [userYears, setUserYears] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    Number(searchParams.get("month")) || today.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    Number(searchParams.get("year")) || today.getFullYear()
  );

  const updateSelection = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    const params = new URLSearchParams({ month, year });
    router.replace(`?${params.toString()}`);
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
        setError(err);
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
        setTransactionsError(err);
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
  }, []);

  if (!user) return <p>Loading dashboard...</p>;

  if (error) return error;

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/logout`;
  };

  const handleActiveTabChange = (e) => {
    setActiveTab(e.target.id);
  };

  return (
    <div className={styles.dashboard}>
      <Sidenavbar
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={(m) => updateSelection(m, selectedYear)}
        setSelectedYear={(y) => updateSelection(selectedMonth, y)}
        availableYears={userYears}
      ></Sidenavbar>
      <div className={styles.content}>
        <Topnavbar
          userName={user.displayName}
          handleLogout={handleLogout}
          activeTab={activeTab}
          handleActiveTabChange={handleActiveTabChange}
        />
        {activeTab === "charts" ? (
          <Charts
            transactions={transactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          ></Charts>
        ) : (
          <Transactions transactions={transactions}></Transactions>
        )}
      </div>
    </div>
  );
}

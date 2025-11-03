"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Charts from "../components/charts/charts";
import Sidenavbar from "../components/navbars/sidenavbar";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsError, setTransactionsError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const today = new Date();

  // const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  // const [selectedYear, setSelectedYear] = useState(today.getFullYear());

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
    router.replace(`?${params.toString()}`); // updates URL without reload
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
        console.log("user: ", result);
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

  const expenses = transactions.filter((tx) => tx.type === "Expense");
  const totals = new Map();

  expenses.forEach((tx) => {
    totals.set(tx.category, (totals.get(tx.category) || 0) + tx.amount);
  });

  const categoryTotals = totals;

  if (!user) return <p>Loading dashboard...</p>;

  if (error) return error;

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/logout`;
  };

  const handleTransactionsRedirect = () => {
    router.push("/transactions");
  };

  return (
    <div className={styles.dashboard}>
      <Sidenavbar
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={(m) => updateSelection(m, selectedYear)}
      ></Sidenavbar>
      <div className={styles.content}>
        <div className={styles.topnavbar}>
          <h1>Welcome {user.displayName}!</h1>
          <button onClick={handleTransactionsRedirect}>Transactions</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        {categoryTotals.size > 0 ? (
          <Charts categoryTotals={categoryTotals}></Charts>
        ) : (
          <p>No data for {selectedMonth+1}/{selectedYear}</p>
        )}
      </div>
    </div>
  );
}

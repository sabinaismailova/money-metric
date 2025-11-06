"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DonutChart from "../components/charts/donutChart";
import LineChart from "../components/charts/lineChart";
import Sidenavbar from "../components/navbars/sidenavbar";
import BarGraphY from "../components/charts/barGraphY";
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
  const expensesTotals = new Map();

  expenses.forEach((tx) => {
    expensesTotals.set(
      tx.category,
      (expensesTotals.get(tx.category) || 0) + tx.amount
    );
  });

  const categoryTotals = expensesTotals;

  const labels = Array.from(categoryTotals.keys());
  const data = Array.from(categoryTotals.values());

  const income = transactions.filter((tx) => tx.type === "Income");

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
        {transactions.length > 0 ? (
          <div className={styles.charts}>
            {data.length>1 && (
              <div className={styles.chart}>
                <DonutChart labels={labels} data={data} />
              </div>
            )}
            <div className={styles.chart}>
              <LineChart
                month={selectedMonth}
                income={income}
                expenses={expenses}
              ></LineChart>
            </div>
            <div className={styles.chart}>
              <BarGraphY income={income}></BarGraphY>
            </div>
          </div>
        ) : (
          <p>
            No data for {selectedMonth + 1}/{selectedYear}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DonutChart from "../components/donutChart";
import "./dashboard.css";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsError, setTransactionsError] = useState(null);

  const router = useRouter();

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
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
  }, []);

  const categoryTotals = useMemo(() => {
    if (!transactions.length) return new Map();

    const expenses = transactions.filter((tx) => tx.type === "Expense");
    const totals = new Map();

    expenses.forEach((tx) => {
      totals.set(tx.category, (totals.get(tx.category) || 0) + tx.amount);
    });

    return totals;
  }, [transactions]);

  const labels = Array.from(categoryTotals.keys());
  const data = Array.from(categoryTotals.values());

  if (!user) return <p>Loading dashboard...</p>;

  if (error) return error;

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth/logout`;
  };

  const handleTransactionsRedirect = () => {
    router.push("/transactions");
  };

  return (
    <div className="dashboard p-2">
      <div className="navbar">
        <h1>Welcome {user.displayName}</h1>
        <p>Email: {user.email}</p>
        <p>Timezone: {userTimezone}</p>
        <button onClick={handleLogout}>Logout</button>
        <br></br>
        <button onClick={handleTransactionsRedirect}>Transactions</button>
      </div>
      <div className="charts">
        <div className="chart">
          <h2>Expense Distribution</h2>
          {categoryTotals.size > 0 ? (
            <DonutChart labels={labels} data={data} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

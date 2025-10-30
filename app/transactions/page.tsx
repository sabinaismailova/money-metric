"use client";
import { useEffect, useState } from "react";
import Form from "next/form";
import "./transactions.css";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

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
        setError(err);
      }
    }

    fetchTransactions();
  }, []);

  const handleAddTransaction = () => {
    router.push("/transactions/add");
  };

  return (
    <div>
      <div className="header">
        <h1>Transactions</h1>
        <button className="add-t-btn" onClick={handleAddTransaction}>
          + Add Transaction
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Recurring</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6}>No transactions yet</td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>${t.amount}</td>
                <td>{t.note}</td>
                <td>{t.isRecurring ? "Yes" : "No"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

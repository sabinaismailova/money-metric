"use client";
import { useState, useEffect } from "react";
import styles from "./charts.module.css";

const AvailableBalanceCard = ({ selectedMonth = 0, selectedYear = 0 }) => {
  let [transactions, setTransactions] = useState([]);

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
        console.log("Error fetching all transactions: ", err);
      }
    }

    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  const cutoffDate = new Date(selectedYear, selectedMonth + 1, 0);

  const incomeTotal = transactions
    .filter((tx) => tx.type === "Income" && new Date(tx.date) <= cutoffDate)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expensesTotal = transactions
    .filter((tx) => tx.type === "Expense" && new Date(tx.date) <= cutoffDate)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const availableBalance = incomeTotal - expensesTotal;

  return (
    <div className={styles.card} style={{ backgroundColor: `#1d273b` }}>
      <h3 style={{ fontSize: 16, fontWeight: 'bold'}}>Available Balance</h3>
      <span className={styles.amount} style={{ paddingTop: 8, fontSize: 32, color: 'rgb(75, 192, 192)'}}>
        ${availableBalance.toFixed(2)}
      </span>
    </div>
  );
};

export default AvailableBalanceCard;

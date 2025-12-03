"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CashflowWaterfallChart = ({
  income = [],
  expenses = [],
  selectedMonth = 0,
  selectedYear = 0,
}) => {
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

  const cutoffDate = new Date(selectedYear, selectedMonth, 0);

  const prevTransactions = transactions.filter(
    (tx) => new Date(tx.date) <= cutoffDate
  );

  let startTotal = 0;

  prevTransactions.forEach((tx) => {
    const d = new Date(tx.date).getDate();
    const change = tx.type === "Income" ? tx.amount : -tx.amount;
    startTotal += change;
  });

  const incomeTotal = income.reduce((a, b) => a + b.amount, 0);
  const expenseTotal = expenses.reduce((a, b) => a + b.amount, 0);

  const endingBalance = startTotal + incomeTotal - expenseTotal;

  const labels = ["Start", "Income", "Expenses", "End"];

  const invisibleBase = [0, startTotal, startTotal + incomeTotal, 0];

  const visibleValues = [startTotal, incomeTotal, -expenseTotal, endingBalance];

  const backgroundColors = ["#4fd1c5", "#4fd1c5", "#f87171", "#60a5fa"];

  const data = {
    labels,
    datasets: [
      {
        label: "Base",
        data: invisibleBase,
        backgroundColor: "rgba(0,0,0,0)",
        borderWidth: 0,
        stack: "combined",
      },
      {
        label: "Flow",
        data: visibleValues,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 2,
        stack: "combined",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.6,
    categoryPercentage: 0.6,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw;
            return (val >= 0 ? "+" : "") + val.toLocaleString();
          },
        },
      },
      title: {
        display: true,
        text: "Cashflow Waterfall",
        color: "#FFFFFF",
      },
    },
    scales: {
      x: {
        grid: { color: "#1d273b" },
        ticks: { color: "white" },
      },
      y: {
        grid: { color: "#1d273b" },
        ticks: { color: "white" },
        title: { display: true, text: "Amount ($)" },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CashflowWaterfallChart;

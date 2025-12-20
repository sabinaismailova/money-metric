"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Transaction } from "@/app/types";
import { useState, useEffect } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface CashflowWaterfallChartProps {
  income: Transaction[]|undefined;
  expenses: Transaction[]|undefined;
  selectedMonth: number;
  selectedYear: number;
  incomeColor: string|undefined;
  expenseColor: string|undefined;
}

const CashflowWaterfallChart: React.FC<CashflowWaterfallChartProps> = ({
  income,
  expenses,
  selectedMonth,
  selectedYear,
  incomeColor,
  expenseColor,
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
    (tx: Transaction) => new Date(tx.date) <= cutoffDate
  );

  let startTotal = 0;

  prevTransactions.forEach((tx: Transaction) => {
    const d = new Date(tx.date).getDate();
    const change = tx.type === "Income" ? tx.amount : -tx.amount;
    startTotal += change;
  });

  const incomeTotal = income?.reduce((a, b) => a + b.amount, 0);
  const expenseTotal = expenses?.reduce((a, b) => a + b.amount, 0);

  const endingBalance = incomeTotal && expenseTotal && startTotal + incomeTotal - expenseTotal;

  const labels = ["Start", "Income", "Expenses", "End"];

  const invisibleBase = incomeTotal && [0, startTotal, startTotal + incomeTotal, 0];

  const visibleValues = expenseTotal && [startTotal, incomeTotal, - expenseTotal, endingBalance];

  const backgroundColors = [
    "#ec8836",
    `${incomeColor}`,
    `${expenseColor}`,
    "#60a5fa",
  ];

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
          label: (ctx: TooltipItem<"bar">) => {
            const val = ctx.raw as number;
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

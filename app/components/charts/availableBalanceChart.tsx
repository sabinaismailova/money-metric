"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
} from "chart.js";
import { Transaction } from "@/app/types";
import { useEffect, useState } from "react";
import styles from "./charts.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface AvailableBalanceChartProps {
  income: Transaction[]|undefined;
  expenses: Transaction[]|undefined;
  selectedMonth: number;
  selectedYear: number;
}

const AvailableBalanceChart: React.FC<AvailableBalanceChartProps> = ({
  income,
  expenses,
  selectedMonth,
  selectedYear,
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

  const dailyNet = new Map();

  income?.forEach((tx) => {
    const dateOnly = tx.date.split("T")[0];
    const localDate = new Date(`${dateOnly}T00:00:00`);
    const dayKey = localDate.getTime();
    const current = dailyNet.get(dayKey) || 0;
    dailyNet.set(dayKey, current + tx.amount);
  });

  expenses?.forEach((tx) => {
    const dateOnly = tx.date.split("T")[0];
    const localDate = new Date(`${dateOnly}T00:00:00`);
    const dayKey = localDate.getTime();
    const current = dailyNet.get(dayKey) || 0;
    dailyNet.set(dayKey, current - tx.amount);
  });

  const sortedDaily = Array.from(dailyNet.entries()).sort(
    ([dayA], [dayB]) => dayA - dayB
  );

  const cumulative = new Map();
  let running = startTotal;

  for (let [day, total] of sortedDaily) {
    running += total;
    cumulative.set(day, running);
  }

  const cumulativePoints = Array.from(cumulative.entries()).map(
    ([day, total]) => ({
      x: new Date(day),
      y: total,
    })
  );

  const data = {
    label: "Available Balance",
    datasets: [
      {
        label: "Cumulative Balance",
        data: cumulativePoints,
        borderColor: "#4fd1c5",
        backgroundColor: "rgba(79, 209, 197, 0.2)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems: TooltipItem<"line">[]) {
            const date = tooltipItems[0].parsed.x;
            const day = date && new Date(date).toDateString();
            return `${day}`;
          },
        },
      },
      legend: { position: "top" },
      title: { display: true, text: "Available Balance", color: "#FFFFFF" },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "dd",
          },
        },
        grid: {
          color: "#111827",
        },
        title: { display: true, text: "Date" },
      },
      y: {
        grid: { color: "#111827" },
        title: { display: true, text: "Amount ($)" },
      },
    },
  };

  return <Line className={styles.lineChart} data={data} options={options} />;
};

export default AvailableBalanceChart;

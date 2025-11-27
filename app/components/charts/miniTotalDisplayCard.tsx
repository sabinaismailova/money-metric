"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import styles from "./charts.module.css";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

const MiniTotalDisplayCard = ({
  title = "",
  transactions = [],
  lineColor = "#2563eb",
}) => {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = {
    labels: sorted.map((t) =>
      new Date(t.date).getDate().toString().padStart(2, "0")
    ),
    datasets: [
      {
        data: sorted.map((t) => t.amount),
        borderColor: lineColor,
        backgroundColor: lineColor,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: { borderJoinStyle: "round" },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.amount} style={{ color: lineColor }}>${totalSpent.toFixed(2)}</span>
      </div>
      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MiniTotalDisplayCard;

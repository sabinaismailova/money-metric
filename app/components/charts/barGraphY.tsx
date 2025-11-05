import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./charts.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarGraphY({ income = [] }) {
  const incomeCategoryTotals = new Map();

  income.forEach((tx) => {
    incomeCategoryTotals.set(
      tx.category,
      (incomeCategoryTotals.get(tx.category) || 0) + tx.amount
    );
  });

  const categories = Array.from(incomeCategoryTotals.keys());
  const totalIncome = Array.from(incomeCategoryTotals.values()).reduce(
    (a, b) => a + b,
    0
  );
  const percentages = categories.map((category) =>
    ((incomeCategoryTotals.get(category) / totalIncome) * 100).toFixed(1)
  );

  const sorted = categories
    .map((category, i) => ({ category, pct: parseFloat(percentages[i]) }))
    .sort((a, b) => b.pct - a.pct);

  const sortedCategories = sorted.map((s) => s.category);
  const sortedPercentages = sorted.map((s) => s.pct);

  const data = {
    labels: sortedCategories,
    datasets: [
      {
        label: "% of Total Income",
        data: sortedPercentages,
        borderColor: "rgba(75, 192, 192, 0.2)",
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Income Sources by Category (%)",
        color: "#FFFFFF",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x}%`,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "% of Total Income" },
        },
      },
    },
  };

  return <Bar className={styles.barGraphY} data={data} options={options} />;
}

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CategoryRanking({ expenses = [] }) {
  const colors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  const expensesCategoryTotals = new Map();

  expenses.forEach((tx) => {
    expensesCategoryTotals.set(
      tx.category,
      (expensesCategoryTotals.get(tx.category) || 0) + tx.amount
    );
  });

  const categories = Array.from(expensesCategoryTotals.keys());
  const totalExpenses = Array.from(expensesCategoryTotals.values()).reduce(
    (a, b) => a + b,
    0
  );
  const percentages = categories.map((category) =>
    ((expensesCategoryTotals.get(category) / totalExpenses) * 100).toFixed(1)
  );

  const sorted = categories
    .map((category, i) => ({ category, pct: parseFloat(percentages[i]) }))
    .sort((a, b) => b.pct - a.pct);

  const sortedCategories = sorted.map((s) => s.category);
  const sortedPercentages = sorted.map((s) => s.pct);

  const categoryColorMap = new Map();
  sortedCategories.forEach((category, i) =>
    categoryColorMap.set(category, colors[i % colors.length])
  );

  const data = {
    labels: sortedCategories,
    datasets: [
      {
        label: "% of Total Expenses",
        data: sortedPercentages,
        backgroundColor: sortedCategories.map((cat) =>
          categoryColorMap.get(cat)
        ),
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
        text: "Expenses Sources by Category (%)",
        color: "#FFFFFF",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x}%`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "% of Total Expenses" },
        grid: {
          color: "#111827",
        },
      },
      y: {
        grid: {
          color: "#111827",
        },
      },
    },
  };

  return (
    <>{expenses.length > 0 ? <Bar data={data} options={options} /> : <></>}</>
  );
}

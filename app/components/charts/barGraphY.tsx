import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
} from "chart.js";
import styles from "./charts.module.css";
import { Transaction, CategoryColor } from "@/app/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarGraphYProps {
  income: Transaction[]|undefined;
  categoryColors: CategoryColor[]|undefined;
}

const BarGraphY: React.FC<BarGraphYProps> = ({ income, categoryColors }) => {
  const colorMap = new Map(categoryColors?.map((c) => [c.category, c.color]));
  const incomeCategoryTotals = new Map();

  income?.forEach((tx) => {
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
  const colors = sorted.map((s) => colorMap.get(s.category));

  const data = {
    labels: sortedCategories,
    datasets: [
      {
        label: "% of Total Income",
        data: sortedPercentages,
        borderColor: colors,
        backgroundColor: colors,
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
          label: (ctx: TooltipItem<"bar">) => `${ctx.parsed.x}%`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "% of Total Income" },
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

  return <Bar className={styles.barGraphY} data={data} options={options} />;
};

export default BarGraphY;

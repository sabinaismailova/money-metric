import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Transaction, CategoryColor } from "@/app/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryRankingProps {
  expenses: Transaction[]|undefined;
  categoryColors: CategoryColor[]|undefined;
}

const CategoryRanking: React.FC<CategoryRankingProps> = ({
  expenses,
  categoryColors,
}) => {
  const colorMap = new Map(categoryColors?.map((c) => [c.category, c.color]));

  const expensesCategoryTotals = new Map();

  expenses?.forEach((tx: Transaction) => {
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

  const sorted = categories
    .map((category, i) => ({
      category,
      amount: expensesCategoryTotals.get(category),
    }))
    .sort((a, b) => b.amount - a.amount);

  const sortedCategories = sorted.map((s) => s.category);
  const sortedAmounts = sorted.map((s) => s.amount??0);

  const data: ChartData<"bar"> = {
    labels: sortedCategories,
    datasets: [
      {
        label: "% of Total Expenses",
        data: sortedAmounts,
        backgroundColor: sortedCategories.map((cat) => colorMap.get(cat) || "#4bc0c0"),
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
        text: "Expenses by Category",
        color: "#FFFFFF",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.x}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: totalExpenses,
        title: { display: true, text: "$ of Total Expenses" },
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
    <Bar data={data} options={options} />
  );
};

export default CategoryRanking;

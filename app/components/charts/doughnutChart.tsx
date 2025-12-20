"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem
} from "chart.js";
import { Transaction, CategoryColor } from "@/app/types";
import styles from "./charts.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  expenses: Transaction[] | undefined;
  categoryColors: CategoryColor[] | undefined;
}

const DonutChart: React.FC<DonutChartProps> = ({
  expenses,
  categoryColors,
}) => {
  const colorMap = new Map(categoryColors?.map((c) => [c.category, c.color]));
  const expensesTotals = new Map();

  expenses?.forEach((tx) => {
    expensesTotals.set(
      tx.category,
      (expensesTotals.get(tx.category) || 0) + tx.amount
    );
  });

  const categoryTotals = expensesTotals;

  const labels = Array.from(categoryTotals.keys());
  const data = Array.from(categoryTotals.values());
  const backgroundColors = labels.map((category) => colorMap.get(category));

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        hoverOffset: 10,
        borderColor: "#F0F0F0",
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems: TooltipItem<"doughnut">[]) {
            const label = tooltipItems[0].label;
            return `${label}`;
          },
        },
      },
      legend: { position: "top" },
      title: { display: true, text: "Expenses Distribution", color: "#FFFFFF" },
    },
  };

  return (
    <Doughnut
      className={styles.donutChart}
      data={chartData}
      options={options}
    />
  );
};

export default DonutChart;

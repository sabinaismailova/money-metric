"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, 
    TooltipItem,} from "chart.js";
import { Transaction, CategoryColor } from "@/app/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IncomeSourcesPieChartProps {
  income: Transaction[]|undefined;
  categoryColors: CategoryColor[]|undefined;
}

const IncomeSourcesPieChart: React.FC<IncomeSourcesPieChartProps> = ({
  income,
  categoryColors,
}) => {
  const categoryTotals = new Map();
  const colorMap = new Map(categoryColors?.map((c) => [c.category, c.color]));

  income?.forEach((tx, i) => {
    categoryTotals.set(
      tx.category,
      (categoryTotals.get(tx.category) || 0) + tx.amount
    );
  });

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
            const category = tooltipItems[0].label;
            return `${category}`;
          },
        },
      },
      legend: { position: "top" },
      title: { display: true, text: "Income Distribution", color: "#FFFFFF" },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default IncomeSourcesPieChart;

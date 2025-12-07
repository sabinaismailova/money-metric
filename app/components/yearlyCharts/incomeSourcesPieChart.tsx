"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeSourcesPieChart = ({ income = [], categoryColors = [] }) => {
  const colors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  const categoryTotals = new Map();
  const colorMap = new Map(categoryColors.map((c) => [c.category, c.color]));

  income.forEach((tx, i) => {
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
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

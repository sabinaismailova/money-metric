"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./charts.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ expenses = [] }) => {
  const expensesTotals = new Map();

  expenses.forEach((tx) => {
    expensesTotals.set(
      tx.category,
      (expensesTotals.get(tx.category) || 0) + tx.amount
    );
  });

  const categoryTotals = expensesTotals;

  const labels = Array.from(categoryTotals.keys());
  const data = Array.from(categoryTotals.values());

  const backgroundColors = labels.map(
    (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 50%)`
  );

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
            const date = tooltipItems[0].parsed.x;
            const day = new Date(date).toDateString();
            return `${day}`;
          },
        },
      },
      legend: { position: "top" },
      title: { display: true, text: "Expenses Distribution", color: "#FFFFFF" },
    },
  };

  return (
    <>
      {expenses.length > 0 ? (
        <Doughnut
          className={styles.donutChart}
          data={chartData}
          options={options}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default DonutChart;

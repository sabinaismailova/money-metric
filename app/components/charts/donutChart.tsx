"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./charts.module.css"

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ labels = [], data = [], colors = [] }) {
  const backgroundColors =
    colors.length > 0
      ? colors
      : labels.map(
          (_, i) =>
            `hsl(${(i * 360) / labels.length}, 70%, 50%)`
        );

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
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
      title: { display: true, text: "Expenses Distribution", color: "#FFFFFF"},
    },
  }

  return <Doughnut className={styles.donutChart} data={chartData} options={options}/>;
}

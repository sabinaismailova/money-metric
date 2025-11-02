"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

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

  return <Doughnut width={200} height={200} data={chartData} />;
}

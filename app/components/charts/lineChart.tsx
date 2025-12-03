import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import styles from "./charts.module.css";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ month = 0, income = [], expenses = [] }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthName = months[month];

  const expenseMap = new Map();

  expenses.forEach((tx) => {
    const dateOnly = tx.date.split("T")[0];
    const localDate = new Date(`${dateOnly}T00:00:00`);
    const dayKey = localDate.getTime();
    const current = expenseMap.get(dayKey) || 0;
    expenseMap.set(dayKey, current + tx.amount);
  });

  const expensePoints = Array.from(expenseMap.entries()).map(
    ([day, total]) => ({
      x: new Date(day),
      y: total,
    })
  );

  const incomeMap = new Map();

  income.forEach((tx) => {
    const dateOnly = tx.date.split("T")[0];
    const localDate = new Date(`${dateOnly}T00:00:00`);
    const dayKey = localDate.getTime();
    const current = incomeMap.get(dayKey) || 0;
    incomeMap.set(dayKey, current + tx.amount);
  });

  const incomePoints = Array.from(incomeMap.entries()).map(([day, total]) => ({
    x: new Date(day),
    y: total,
  }));

  const data = {
    datasets: [
      {
        label: "Income ($)",
        data: incomePoints,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: "Expenses ($)",
        data: expensePoints,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        pointRadius: 4,
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
      title: { display: true, text: "Income vs Expenses", color: "#FFFFFF" },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "dd",
          },
        },
        title: { display: true, text: monthName },
        grid: {
          color: "#111827",
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount ($)" },
        grid: {
          color: "#111827",
        },
      },
    },
  };

  return <Line className={styles.lineChart} data={data} options={options} />;
};

export default LineChart;

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

const CategoryTrendsLineGraph = ({ expenses = [] }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  function getCategoryTrends(transactions: []) {
    const categories = [...new Set(transactions.map((t) => t.category))];

    const result = new Map();

    categories.forEach((category) => {
      result.set(category, Array(12).fill(0));

      transactions
        .filter((t) => t.category === category)
        .forEach((t) => {
          const m = new Date(t.date).getMonth();
          result.get(category)[m] += t.amount;
        });
    });

    return result;
  }

  const monthlyCategoryTrends = getCategoryTrends(expenses);
  const categories = [...monthlyCategoryTrends.keys()];

  const colors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  const data = {
    labels: months,
    datasets: categories.map((category, index) => ({
      label: category,
      data: monthlyCategoryTrends.get(category),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.3,
      pointRadius: 4,
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#FFFFFF",
        },
      },
      title: {
        display: true,
        text: "Category Trend Over Months",
        color: "#FFFFFF",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: "Months" },
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
    <>{expenses.length > 0 ? <Line data={data} options={options} /> : <></>}</>
  );
};

export default CategoryTrendsLineGraph;

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IncomeExpensesBarGraph = ({ income = [], expenses = [] }) => {
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

  const incomeMonthlyTotals = new Map();

  income.forEach((tx) => {
    let month = new Date(tx.date).getMonth();
    incomeMonthlyTotals.set(
      month,
      (incomeMonthlyTotals.get(month) || 0) + tx.amount
    );
  });

  const expensesMonthlyTotals = new Map();

  expenses.forEach((tx) => {
    let month = new Date(tx.date).getMonth();
    expensesMonthlyTotals.set(
      month,
      (expensesMonthlyTotals.get(month) || 0) + tx.amount
    );
  });

  const monthlyIncomeExpenses = months.map((month, i) => ({
    month: month,
    income: incomeMonthlyTotals.get(i) || 0,
    expenses: expensesMonthlyTotals.get(i) || 0,
  }));

  const data = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: monthlyIncomeExpenses.map((m) => m.income),
        backgroundColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Expenses",
        data: monthlyIncomeExpenses.map((m) => m.expenses),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const options = {
    indexAxis: "x",
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
        text: "Income vs Expenses by Month",
        color: "#FFFFFF",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Month" },
        grid: {
          color: "#111827",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#111827",
        },
        ticks: {
          autoSkip: false,
          maxTicksLimit: 16,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default IncomeExpensesBarGraph;

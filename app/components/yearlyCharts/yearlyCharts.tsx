"use client";
import { useEffect, useState } from "react";
import styles from "./yearlyCharts.module.css";
import InsightsChatbot from "../chatbot/insightsChatbot";
import IncomeExpensesBarGraph from "./incomeExpensesBarGraph";
import CategoryTrendsLineGraph from "./categoryTrendsLineGraph";
import CategoryRanking from "./categoryRankingHorizontalBarChart";
import IncomeSourcesPieChart from "./incomeSourcesPieChart";

const YearlyCharts = ({
  transactions = [],
  selectedMonth = 0,
  selectedYear = 0,
  mode = "",
  categoryColors = [],
  typeColors = [],
}) => {
  const [userSummary, setUserSummary] = useState({});

  useEffect(() => {
    async function fetchUserSummary() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-summary?year=${selectedYear}&month=${selectedMonth}&mode=${mode}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const summary = await response.json();
        setUserSummary(summary);
      } catch (err) {
        console.log(err);
      }
    }

    fetchUserSummary();
  }, [selectedMonth, selectedYear]);

  const expenses = transactions.filter((tx) => tx.type === "Expense");

  const income = transactions.filter((tx) => tx.type === "Income");

  const incomeColor = typeColors.filter((t) => t.type === "Income")[0]?.color;

  const expenseColor = typeColors.filter((t) => t.type === "Expense")[0]?.color;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        width: "100%",
        height: "auto",
        overflowY: "scroll",
      }}
    >
      <div className={styles.charts}>
        <div className={styles.chartGroup}>
          <div className={styles.chart}>
            <IncomeExpensesBarGraph
              income={income}
              expenses={expenses}
              incomeColor={incomeColor}
              expenseColor={expenseColor}
            ></IncomeExpensesBarGraph>
          </div>
          <div className={styles.smallChart}>
            <CategoryRanking
              expenses={expenses}
              categoryColors={categoryColors}
            ></CategoryRanking>
          </div>
          {income.length > 0 && (
            <div className={styles.smallChart}>
              <IncomeSourcesPieChart
                income={income}
                categoryColors={categoryColors}
              ></IncomeSourcesPieChart>
            </div>
          )}
          <div className={styles.chart}>
            <CategoryTrendsLineGraph
              expenses={expenses}
              categoryColors={categoryColors}
            ></CategoryTrendsLineGraph>
          </div>
        </div>
        <div className={styles.side}>
          <div className={styles.chatbotContainer}>
            <InsightsChatbot userSummary={userSummary}></InsightsChatbot>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyCharts;

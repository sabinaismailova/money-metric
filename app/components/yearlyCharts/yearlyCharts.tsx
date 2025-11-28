"use client";
import { useEffect, useState } from "react";
import styles from "../charts/charts.module.css";
import InsightsChatbot from "../chatbot/insightsChatbot";

const YearlyCharts = ({ transactions = [], selectedMonth = 0, selectedYear = 0, mode = ""}) => {
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
  }, [selectedYear]);

  const expenses = transactions.filter((tx) => tx.type === "Expense");

  const income = transactions.filter((tx) => tx.type === "Income");

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
            {/* {expenses.length > 0 && (
              <div className={styles.chart}>
                <DonutChart expenses={expenses} />
              </div>
            )}
            <div className={styles.cardChart}>
              <div className={styles.miniCardsContainer}>
                {expenses.length > 1 && (
                  <MiniTotalDisplayCard
                    title="Expenses"
                    transactions={expenses}
                    lineColor="rgb(255, 99, 132)"
                  />
                )}
                {income.length > 1 && (
                  <MiniTotalDisplayCard
                    title="Income"
                    transactions={income}
                    lineColor="rgb(75, 192, 192)"
                  />
                )}
              </div>
            </div>
            <div className={styles.chart}>
              <CashflowWaterfallChart
                income={income}
                expenses={expenses}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </div>
            <div className={styles.lineChart}>
              <LineChart
                month={selectedMonth}
                income={income}
                expenses={expenses}
              ></LineChart>
            </div>
            <div className={styles.lineChart}>
              <AvailableBalanceChart
                income={income}
                expenses={expenses}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              ></AvailableBalanceChart>
            </div>
            {income.length > 0 && (
              <div className={styles.chart}>
                <BarGraphY income={income}></BarGraphY>
              </div>
            )} */}
          </div>
          <div className={styles.side}>
            <div className={styles.cardChart}>
              {/* <AvailableBalanceCard
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              /> */}
            </div>
            <div className={styles.chatbotContainer}>
              <InsightsChatbot userSummary={userSummary}></InsightsChatbot>
            </div>
          </div>
        </div>
    </div>
  );
};

export default YearlyCharts;

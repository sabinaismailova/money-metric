"use client";
import DonutChart from "./donutChart";
import LineChart from "./lineChart";
import BarGraphY from "./barGraphY";
import MiniTotalDisplayCard from "./miniTotalDisplayCard";
import AvailableBalanceCard from "./availableBalanceCard";
import styles from "./charts.module.css";
import AvailableBalanceChart from "./availableBalanceChart";
import CashflowWaterfallChart from "./cashflowWaterfallChart";
import InsightsChatbot from "../chatbot/insightsChatbot";

const Charts = ({ transactions = [], selectedMonth = 0, selectedYear = 0 }) => {
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
      {transactions.length > 0 ? (
        <div className={styles.charts}>
          <div className={styles.cardChart}>
            <AvailableBalanceCard
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>
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
          {expenses.length > 0 && (
            <div className={styles.chart}>
              <DonutChart expenses={expenses} />
            </div>
          )}
          <div className={styles.chartGroup}>
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
            <div className={styles.chart}>
              <BarGraphY income={income}></BarGraphY>
            </div>
          </div>
          <div className={styles.chatbotContainer}>
            <InsightsChatbot></InsightsChatbot>
          </div>
        </div>
      ) : (
        <p>
          No data for {selectedMonth + 1}/{selectedYear}
        </p>
      )}
    </div>
  );
};

export default Charts;

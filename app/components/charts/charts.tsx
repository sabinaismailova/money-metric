"use client";
import { useEffect, useState } from "react";
import DonutChart from "./doughnutChart";
import LineChart from "./lineChart";
import BarGraphY from "./barGraphY";
import MiniTotalDisplayCard from "./miniTotalDisplayCard";
import AvailableBalanceCard from "./availableBalanceCard";
import styles from "./charts.module.css";
import AvailableBalanceChart from "./availableBalanceChart";
import CashflowWaterfallChart from "./cashflowWaterfallChart";
import InsightsChatbot from "../chatbot/insightsChatbot";
import {
  CategoryColor,
  Transaction,
  TransactionTypeColor,
  UserSummary,
} from "@/app/types";

interface ChartsProps {
  transactions: Transaction[] | undefined;
  selectedMonth: number;
  selectedYear: number;
  mode: string;
  categoryColors: CategoryColor[] | undefined;
  typeColors: TransactionTypeColor[] | undefined;
}

const Charts: React.FC<ChartsProps> = ({
  transactions,
  selectedMonth,
  selectedYear,
  mode,
  categoryColors,
  typeColors,
}) => {
  const [userSummary, setUserSummary] = useState<UserSummary>();

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
        console.log("summary: ", summary);
        setUserSummary(summary);
      } catch (err) {
        console.log(err);
      }
    }

    fetchUserSummary();
  }, [selectedMonth, selectedYear]);

  const expenses = transactions?.filter((tx) => tx.type === "Expense");

  const income = transactions?.filter((tx) => tx.type === "Income");

  const incomeColor = typeColors?.filter((t) => t.type === "Income")[0].color;

  const expenseColor = typeColors?.filter((t) => t.type === "Expense")[0].color;

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
      {transactions && transactions.length>0 ? (
        <div className={styles.charts}>
          <div className={styles.chartGroup}>
            {expenses && expenses.length > 0 && (
              <div className={styles.chart}>
                <DonutChart
                  expenses={expenses}
                  categoryColors={categoryColors}
                />
              </div>
            )}
            <div className={styles.cardChart}>
              <div className={styles.miniCardsContainer}>
                {expenses && expenses.length > 1 && (
                  <MiniTotalDisplayCard
                    title="Expenses"
                    transactions={expenses}
                    lineColor={expenseColor}
                  />
                )}
                {income && income.length > 1 && (
                  <MiniTotalDisplayCard
                    title="Income"
                    transactions={income}
                    lineColor={incomeColor}
                  />
                )}
              </div>
            </div>
            {expenses && expenses.length > 1 && income && income.length > 1 && (
              <div className={styles.chart}>
                <CashflowWaterfallChart
                  income={income}
                  expenses={expenses}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  incomeColor={incomeColor}
                  expenseColor={expenseColor}
                />
              </div>
            )}
            <div className={styles.lineChart}>
              <LineChart
                month={selectedMonth}
                income={income}
                expenses={expenses}
                incomeColor={incomeColor}
                expenseColor={expenseColor}
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
            {income && income.length > 0 && (
              <div className={styles.chart}>
                <BarGraphY
                  income={income}
                  categoryColors={categoryColors}
                ></BarGraphY>
              </div>
            )}
          </div>
          <div className={styles.side}>
            <div className={styles.cardChart}>
              <AvailableBalanceCard
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                incomeColor={incomeColor}
                expenseColor={expenseColor}
              />
            </div>
            <div className={styles.chatbotContainer}>
              <InsightsChatbot userSummary={userSummary}></InsightsChatbot>
            </div>
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

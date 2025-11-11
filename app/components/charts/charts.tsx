"use client";
import DonutChart from "./donutChart";
import LineChart from "./lineChart";
import BarGraphY from "./barGraphY";
import MiniTotalDisplayCard from "./miniTotalDisplayCard";
import AvailableBalanceCard from "./availableBalanceCard";
import styles from "./charts.module.css";

const Charts = ({ transactions = [], selectedMonth = 0, selectedYear = 0 }) => {
  const expenses = transactions.filter((tx) => tx.type === "Expense");

  const income = transactions.filter((tx) => tx.type === "Income");

  return (
    <div>
      {transactions.length > 0 ? (
        <div className={styles.charts}>
          <div className={styles.chart}>
            <AvailableBalanceCard selectedMonth={selectedMonth} selectedYear={selectedYear}/>
          </div>
          <div className={styles.chart}>
            <DonutChart expenses={expenses} />
          </div>
          <div className={styles.chart}>
            <div className={styles.miniCardsContainer}>
              {expenses.length > 0 && (
                <MiniTotalDisplayCard
                  title="Expenses"
                  transactions={expenses}
                  lineColor="rgb(255, 99, 132)"
                />
              )}
              {income.length > 0 && (
                <MiniTotalDisplayCard
                  title="Income"
                  transactions={income}
                  lineColor="rgb(75, 192, 192)"
                />
              )}
            </div>
          </div>
          <div className={styles.chart}>
            <LineChart
              month={selectedMonth}
              income={income}
              expenses={expenses}
            ></LineChart>
          </div>
          <div className={styles.chart}>
            <BarGraphY income={income}></BarGraphY>
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

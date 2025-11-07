"use client";
import DonutChart from "./donutChart";
import LineChart from "./lineChart";
import BarGraphY from "./barGraphY";
import styles from "./charts.module.css";

const Charts = ({ transactions=[], selectedMonth=0, selectedYear=0 }) => {
  const expenses = transactions.filter((tx) => tx.type === "Expense");

  const income = transactions.filter((tx) => tx.type === "Income");

  return (
    <div>
        {transactions.length > 0 ? (
          <div className={styles.charts}>
            <div className={styles.chart}>
              <DonutChart expenses={expenses} />
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
}

export default Charts
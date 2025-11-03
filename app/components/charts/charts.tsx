"use client";
import DonutChart from "./donutChart";
import styles from "./charts.module.css";
import React from "react";

interface ChartsProps {
  categoryTotals: Map<any, any>;
}

const Charts: React.FC<ChartsProps> = ({ categoryTotals }) => {
  const labels = Array.from(categoryTotals.keys());
  const data = Array.from(categoryTotals.values());

  return (
    <div className={styles.charts}>
      <div className={styles.chart}>
        <h2>Expense Distribution</h2>
        {categoryTotals.size > 0 ? (
          <DonutChart labels={labels} data={data} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Charts;

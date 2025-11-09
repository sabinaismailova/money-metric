"use client";
import styles from "./charts.module.css";

const AvailableBalanceCard = ({
  expenses = [],
  income = [],
}) => {
  const expensesTotal = expenses.reduce((sum, t) => sum + t.amount, 0);
  const incomeTotal = income.reduce((sum, t) => sum + t.amount, 0);
  const availableBalance = incomeTotal - expensesTotal;


  return (
    <div className={styles.card} style={{ backgroundColor: `rgb(0,128,128)` }}>
        <h3>Available Balance</h3>
        <span className={styles.amount} style={{ paddingTop: 8, fontSize: 20}}>
          ${availableBalance.toFixed(2)}
        </span>
    </div>
  );
};

export default AvailableBalanceCard;

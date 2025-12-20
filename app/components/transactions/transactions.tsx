"use client";
import { Transaction } from "@/app/types";
import styles from "./transactions.module.css";
import { useRouter } from "next/navigation";

interface TransactionsProps {
  transactions: Transaction[] | undefined;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  const router = useRouter();

  const handleAddTransaction = () => {
    router.push("/addTransaction");
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Transactions</h1>
        <button className={styles.addtbtn} onClick={handleAddTransaction}>
          + Add Transaction
        </button>
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Type</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Note</th>
            <th className={styles.th}>Recurring</th>
            <th className={styles.th}>Recurrence Interval</th>
            <th className={styles.th}>Next recurrance</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {transactions && transactions.length == 0 ? (
            <tr className={styles.tr}>
              <td colSpan={6}>No transactions for this month.</td>
            </tr>
          ) : (
            transactions?.map((t: Transaction) => (
              <tr key={t._id} className={styles.tr}>
                <td className={styles.td}>
                  {new Date(t.date).toISOString().split("T")[0]}
                </td>
                <td className={styles.td}>{t.type}</td>
                <td className={styles.td}>{t.category}</td>
                <td className={styles.td}>${t.amount}</td>
                <td className={styles.td}>{t.note}</td>
                <td className={styles.td}>{t.isRecurring ? "Yes" : "No"}</td>
                {t.isRecurring ? (
                  <>
                    <td className={styles.td}>{t.recurrenceInterval}</td>
                    <td className={styles.td}>
                      {t.nextRecurrence
                        ? new Date(t.nextRecurrence).toISOString().split("T")[0]
                        : null}
                    </td>
                  </>
                ) : (
                  <>
                    <td className={styles.td}></td>
                    <td className={styles.td}></td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;

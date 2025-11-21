"use client";
import { useState } from "react";
import styles from "./addtransactions.module.css";
import { useRouter } from "next/navigation";

export default function AddTransaction() {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    date: "",
    note: "",
    isRecurring: false,
    recurrenceInterval: "",
    nextRecurrence: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function addTransaction() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            timezone: userTimezone
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess("Transaction added successfully!");
      router.push("/dashboard");
    } catch (err) {
      setError(err);
      console.error(err);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction();
  };

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Transaction Form</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Transaction type
          <select className={styles.select} name="type" value={formData.type} onChange={handleChange}>
            <option value="select"></option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>
        <label className={styles.label}>
          Category
          <input
            className={styles.input}
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Amount
          <input
            className={styles.input}
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Date
          <input
            className={styles.input}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <label className={styles.noteLabel}>
          Note
          <textarea
            name="note"
            rows={3}
            value={formData.note}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Enter your note..."
          />
        </label>
        <label className={styles.label}>
          Recurring?
          <input
            className={styles.input}
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
          />
        </label>
        {formData.isRecurring && (
          <>
            <label className={styles.label}>
              How often
              <select
                className={styles.select}
                name="recurrenceInterval"
                value={formData.recurrenceInterval}
                onChange={handleChange}
              >
                <option value="select"></option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Biweekly">Biweekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </label>
            <label className={styles.label}>
              Next recurrence
              <input
                className={styles.input}
                type="date"
                name="nextRecurrence"
                value={formData.nextRecurrence}
                onChange={handleChange}
              />
            </label>
          </>
        )}
        <button className={styles.button} type="submit" onClick={handleSubmit}>
          Add Transaction
        </button>
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </form>
    </div>
  );
}

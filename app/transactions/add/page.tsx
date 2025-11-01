"use client";
import { useState } from "react";
import "./styles.css";
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
      router.push("/transactions");
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
    <div>
      <h1>Transaction Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Transaction type
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="select"></option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>
        <label>
          Category
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <label>
          Note
          <textarea
            name="note"
            rows={3}
            value={formData.note}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your thoughts here..."
          />
        </label>
        <label>
          Recurring?
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
          />
        </label>
        {formData.isRecurring && (
          <>
            <label>
              How often
              <select
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
            <label>
              Next recurrence
              <input
                type="date"
                name="nextRecurrence"
                value={formData.nextRecurrence}
                onChange={handleChange}
              />
            </label>
          </>
        )}
        <button type="submit" onClick={handleSubmit}>
          Add Transaction
        </button>
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </form>
    </div>
  );
}

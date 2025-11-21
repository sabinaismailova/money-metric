import { useState } from "react";
import styles from "./chatbot.module.css";
import UpArrow from "./uparrow.svg";
import Image from "next/image";

export default function InsightsChatbot({ userSummary = {} }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function askQuestion(msg, year, month) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chatbot/ask`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: msg, year, month }),
      }
    );

    const data = await res.json();
    return data.answer;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askQuestion(
        userMsg,
        userSummary.year,
        userSummary.month
      );
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry — something went wrong." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <h2>Insights Assistant</h2>
        <p>Ask anything about your transactions this month</p>
      </div>
      <div className={styles.chatbotMessages}>
        <div className={styles.chatbotMessageRow}>
          <div className={styles.chatbotMessage}>{userSummary.summaryText}</div>
        </div>
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? styles.chatbotUserRow
                : styles.chatbotMessageRow
            }
          >
            {m.role === "assistant" ? (
              <div className={styles.chatbotMessage}>{m.text}</div>
            ) : (
              <div
                className={styles.chatbotMessage}
                style={{ backgroundColor: "#53607e" }}
              >
                {m.text}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.chatbotInputArea}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask about your transactions this month"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <Image alt="Send button icon" src={UpArrow} />
          </button>
        </form>
      </div>
    </div>
  );
}

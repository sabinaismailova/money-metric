import styles from "./chatbot.module.css";
import UpArrow from "./uparrow.svg";
import Image from "next/image";

export default function InsightsChatbot() {
  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <h2>Insights Assistant</h2>
        <p>Ask anything about your transactions this month</p>
      </div>
      <div className={styles.chatbotMessages}>
        <div className={styles.chatbotMessageRow}>
          <div className={styles.chatbotMessage}>
            This month, your spending on food increased by
            <span className={styles.highlight}> 22%</span>.
          </div>
        </div>
        <div className={styles.chatbotMessageRow}>
          <div className={styles.chatbotMessage}>
            Your biggest spending day was on the 6th due to a rent payment.
          </div>
        </div>
      </div>
      <div className={styles.chatbotInputArea}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Ask about your transactions this month"
          />
          <button type="submit">
            <Image alt="Send button icon" src={UpArrow} />
          </button>
        </form>
      </div>
    </div>
  );
}

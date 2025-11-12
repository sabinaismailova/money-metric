"use client";
import styles from "./navbars.module.css";

interface TopnavbarProps {
  userName: String;
  handleLogout: () => void;
  activeTab: String;
  handleActiveTabChange: (e: any) => void;
}

const Topnavbar: React.FC<TopnavbarProps> = ({userName, handleLogout, activeTab, handleActiveTabChange}) => {

  return (
    <div className={styles.topnavbar}>
      <h1 className={styles.welcome}>Welcome {userName}!</h1>
      <button
        id="charts"
        onClick={(e) => handleActiveTabChange(e)}
        className={`${styles.btn} ${
          activeTab === "charts" ? styles.activeBtn : ""
        }`}
      >
        Charts
      </button>
      <button
        id="transactions"
        onClick={(e) => handleActiveTabChange(e)}
        className={`${styles.btn} ${
          activeTab === "transactions" ? styles.activeBtn : ""
        }`}
      >
        Transactions
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Topnavbar;

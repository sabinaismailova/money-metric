"use client";
import { useState } from "react";
import styles from "./navbars.module.css";

interface TopnavbarProps {
  userName: String;
  handleLogout: () => void;
  activeTab: String;
  handleActiveTabChange: (e: any) => void;
  transactions: [];
  yearlyTransactions: [];
  mode: String;
}

const Topnavbar: React.FC<TopnavbarProps> = ({
  userName,
  handleLogout,
  activeTab,
  handleActiveTabChange,
  transactions,
  yearlyTransactions,
  mode,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleColorChange = (category: string, newColor: string) => {
    
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const categoryColors = new Map()

  if(mode=="yearly"){
    yearlyTransactions.forEach((tx) => {
        categoryColors.set(tx.category, (tx.color||""))
    })
  }
  else{ 
    transactions.forEach((tx) => {
        categoryColors.set(tx.category, (tx.color||""))
    })
  }

  const categories = Array.from(categoryColors.keys());

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
      <button id="settings" onClick={handleSettingsClick}>
        Settings
      </button>
      <button onClick={handleLogout}>Logout</button>

      {settingsOpen && (
        <div className={styles.settingsBackdrop}>
          <div className={styles.settings}>
            <h3 className={styles.heading}>Category Colors</h3>

            <div className={styles.categoryColorsList}>
              {categories.map((category) => (
                <div key={category} className={styles.categoryColor}>
                  <span>{category}</span>
                  <label>
                    <input
                      type="color"
                      value={categoryColors.get(category) || "#ffffff"}
                      onChange={(e) =>
                        handleColorChange(category, e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              className={styles.closeButton}
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topnavbar;

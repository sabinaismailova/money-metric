"use client";
import { useState } from "react";
import styles from "./navbars.module.css";

interface TopnavbarProps {
  userName: String;
  handleLogout: () => void;
  activeTab: String;
  handleActiveTabChange: (e: any) => void;
  categoryColors: [];
}

const Topnavbar: React.FC<TopnavbarProps> = ({
  userName,
  handleLogout,
  activeTab,
  handleActiveTabChange,
  categoryColors,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const colors = new Map(categoryColors.map((c) => [c.category, c.color]));
  const [colorMap, setColorMap] = useState(colors);

  const isEqual = (m1: Map<string, string>, m2: Map<string, string>) =>
    m1.size === m2.size && [...m1].every(([k, v]) => m2.get(k) === v);

  const handleColorChange = (category: string, newColor: string) => {
    const updated = new Map(colorMap);
    updated.set(category, newColor);
    setColorMap(updated);
  };

  const handleSettingsClick = () => {
    setColorMap(colors);
    setSettingsOpen(true);
  };

  const saveColors = async () => {
    const payload = Array.from(colorMap).map(([category, color]) => ({
      category,
      color,
    }));

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categoryColors/update`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates: payload }),
      }
    );

    setSettingsOpen(false);
  };

  const categories = Array.from(colorMap.keys());

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
                      value={colorMap.get(category) || "#ffffff"}
                      onChange={(e) =>
                        handleColorChange(category, e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>

            {!isEqual(colors, colorMap) && (
              <button className={styles.saveButton} onClick={saveColors}>
                Save
              </button>
            )}
            <button
              className={styles.closeButton}
              onClick={() => {
                setSettingsOpen(false), setColorMap(colors);
              }}
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

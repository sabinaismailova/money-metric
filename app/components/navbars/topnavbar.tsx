"use client";
import { useState } from "react";
import styles from "./navbars.module.css";
import { CategoryColor, TransactionTypeColor, TransactionType} from "@/app/types";

interface TopnavbarProps {
  userName: string|undefined;
  handleLogout: () => void;
  activeTab: string;
  handleActiveTabChange: (e: any) => void;
  categoryColors: CategoryColor[] | undefined;
  typeColors: TransactionTypeColor[] | undefined;
}

const Topnavbar: React.FC<TopnavbarProps> = ({
  userName,
  handleLogout,
  activeTab,
  handleActiveTabChange,
  categoryColors,
  typeColors,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const colors = new Map(categoryColors?.map((c) => [c.category, c.color]));
  const [colorMap, setColorMap] = useState(colors);
  const typeColor = new Map(typeColors?.map((t) => [t.type, t.color]));
  const [typeColorMap, setTypeColorMap] = useState(typeColor);

  const isEqual = (m1: Map<string, string>, m2: Map<string, string>) =>
    m1.size === m2.size && [...m1].every(([k, v]) => m2.get(k) === v);

  const handleColorChange = (category: string, newColor: string) => {
    const updated = new Map(colorMap);
    updated.set(category, newColor);
    setColorMap(updated);
  };

  const handleTypeColorChange = (type: TransactionType, newColor: string) => {
    const updated = new Map(typeColorMap);
    updated.set(type, newColor);
    setTypeColorMap(updated);
  };

  const handleSettingsClick = () => {
    setColorMap(colors);
    setTypeColorMap(typeColor);
    setSettingsOpen(true);
  };

  const saveColors = async () => {
    const categoriesPayload = Array.from(colorMap).map(([category, color]) => ({
      category,
      color,
    }));
    const typesPayload = Array.from(typeColorMap).map(([type, color]) => ({
      type,
      color,
    }));

    if (!isEqual(colors, colorMap)) {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categoryColors/update`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates: categoriesPayload }),
        }
      );
    }
    if (!isEqual(typeColor, typeColorMap)) {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactionTypeColors/update`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates: typesPayload }),
        }
      );
    }

    setSettingsOpen(false);
  };

  const categories = Array.from(colorMap.keys());
  const types = Array.from(typeColor.keys());

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
      <button id="logout" onClick={() => setLogout(true)}>
        Logout
      </button>

      {settingsOpen && (
        <div className={styles.settingsBackdrop}>
          <div className={styles.settings}>
            <h3 className={styles.heading}>Settings</h3>

            <h4 className={styles.subheading}>Category Colors</h4>
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
            <h4 className={styles.subheading}>Transaction Type Colors</h4>
            <div className={styles.categoryColorsList}>
              {types.map((type) => (
                <div key={type} className={styles.categoryColor}>
                  <span>{type}</span>
                  <label>
                    <input
                      type="color"
                      value={typeColorMap.get(type) || "#ffffff"}
                      onChange={(e) =>
                        handleTypeColorChange(type, e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>

            {(!isEqual(colors, colorMap) ||
              !isEqual(typeColor, typeColorMap)) && (
              <button className={styles.saveButton} onClick={saveColors}>
                Save
              </button>
            )}
            <button
              className={styles.closeButton}
              onClick={() => {
                setSettingsOpen(false),
                  setColorMap(colors),
                  setTypeColorMap(typeColor);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {logout && (
        <div className={styles.settingsBackdrop}>
          <div className={styles.logout}>
            <h3 className={styles.heading}>Confirm Log out</h3>

            <span>Are you sure you want to log out? </span>

            <div className={styles.buttons}>
              <button className={styles.saveButton} onClick={handleLogout}>
                Log out
              </button>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setLogout(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topnavbar;

"use client";
import styles from "./navbars.module.css";
import React, { Dispatch, SetStateAction, useState } from "react";

interface SidenavbarProps {
  selectedYear: Number;
  selectedMonth: Number;
  availableYears: number[];
  updateSelection: (month: any, year: any, view: any) => void;
}

const Sidenavbar: React.FC<SidenavbarProps> = ({
  selectedYear,
  selectedMonth,
  availableYears,
  updateSelection,
}) => {
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  function handleYearSelect(year) {
    setYearPickerOpen(false);
    updateSelection(selectedMonth, year, "yearly");
    setIsActive(true);
  }

  return (
    <div className={styles.sidenavbar}>
      {months.map((month, index) => (
        <button
          key={month}
          className={`${styles.monthButton} ${
            selectedMonth === index && isActive==false? styles.activeMonth : ""
          }`}
          onClick={() => {
            updateSelection(index, selectedYear, "monthly");
            setIsActive(false);
          }}
        >
          {month}
        </button>
      ))}
      <button
        className={`${styles.yearButton} ${isActive ? styles.activeYear : ""}`}
        onClick={() => setYearPickerOpen(true)}
      >
        {selectedYear}
      </button>

      {yearPickerOpen && (
        <div className={styles.yearPickerBackdrop}>
          <div className={styles.yearPicker}>
            <h3>Select a Year</h3>

            <div className={styles.yearList}>
              {availableYears.map((year) => (
                <button
                  key={year}
                  className={`${styles.yearItem} ${
                    year === selectedYear ? styles.activeYear : ""
                  }`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <button
              className={styles.closeButton}
              onClick={() => setYearPickerOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidenavbar;

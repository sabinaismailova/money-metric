"use client";
import styles from "./navbars.module.css";
import React, { Dispatch, SetStateAction, useState } from "react";

interface SidenavbarProps {
  selectedYear: Number;
  selectedMonth: Number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  availableYears: number[];
}

const Sidenavbar: React.FC<SidenavbarProps> = ({
  selectedYear,
  selectedMonth,
  setSelectedMonth,
  setSelectedYear,
  availableYears,
}) => {
  const [yearPickerOpen, setYearPickerOpen] = useState(false);

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

  return (
    <div className={styles.sidenavbar}>
      {months.map((month, index) => (
        <button
          key={month}
          className={`${styles.monthButton} ${
            selectedMonth === index ? styles.activeMonth : ""
          }`}
          onClick={() => setSelectedMonth(index)}
        >
          {month}
        </button>
      ))}
      <button
        className={styles.yearButton}
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
                  onClick={() => {
                    setSelectedYear(year);
                    setYearPickerOpen(false);
                  }}
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

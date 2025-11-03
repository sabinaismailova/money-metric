"use client";
import styles from "./navbars.module.css";
import React, { Dispatch, SetStateAction } from "react";

interface SidenavbarProps {
  selectedYear: Number;
  selectedMonth: Number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
}

const Sidenavbar: React.FC<SidenavbarProps> = ({
  selectedYear,
  selectedMonth,
  setSelectedMonth,
}) => {
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

  console.log("month: ", selectedMonth)

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
      <button>{selectedYear}</button>
    </div>
  );
};

export default Sidenavbar;

import React from "react";
import styles from "./Tabs.module.css";

export type Tab = "packing" | "summary";

interface TabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "packing" ? styles.active : ""
          }`}
          onClick={() => onTabChange("packing")}
        >
          Packing
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "summary" ? styles.active : ""
          }`}
          onClick={() => onTabChange("summary")}
        >
          Podsumowanie
        </button>
      </div>
    </div>
  );
};

export default Tabs;

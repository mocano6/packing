// src/components/ActionTypeToggle/ActionTypeToggle.tsx
import React from "react";
import styles from "./ActionTypeToggle.module.css";

interface ActionTypeToggleProps {
  actionType: "pass" | "dribble";
  onActionTypeChange: (type: "pass" | "dribble") => void;
}

const ActionTypeToggle: React.FC<ActionTypeToggleProps> = ({
  actionType,
  onActionTypeChange,
}) => {
  return (
    <div className={styles.toggleContainer}>
      <button
        className={`${styles.toggleButton} ${
          actionType === "pass" ? styles.active : ""
        }`}
        onClick={() => onActionTypeChange("pass")}
      >
        Podanie
      </button>
      <button
        className={`${styles.toggleButton} ${
          actionType === "dribble" ? styles.active : ""
        }`}
        onClick={() => onActionTypeChange("dribble")}
      >
        Drybling
      </button>
    </div>
  );
};

export default ActionTypeToggle;

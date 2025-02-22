// src/components/PointsButtons/PointsButtons.tsx

import React from "react";
import styles from "./PointsButtons.module.css";
import { PointsButtonsProps } from "./PointsButtons.types";
import { ACTION_BUTTONS } from "./constants";

const PointsButtons: React.FC<PointsButtonsProps> = ({
  currentPoints,
  onAddPoints,
  onSaveAction,
  onReset,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.pointsDisplay}>
        <span className={styles.pointsLabel}>Punkty:</span>
        <span className={styles.pointsValue}>{currentPoints.toFixed(1)}</span>
      </div>

      <div className={styles.buttonsGrid}>
        {ACTION_BUTTONS.map((button, index) => (
          <button
            key={index}
            className={styles.actionButton}
            onClick={() => onAddPoints(button.points)}
            title={button.description}
          >
            <span className={styles.buttonLabel}>{button.label}</span>
            <span className={styles.buttonDescription}>
              {button.description}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.controlButtons}>
        <button
          className={`${styles.controlButton} ${styles.resetButton}`}
          onClick={onReset}
        >
          Resetuj
        </button>
        <button
          className={`${styles.controlButton} ${styles.saveButton}`}
          onClick={onSaveAction}
        >
          Zapisz akcję
        </button>
      </div>
    </div>
  );
};

export default PointsButtons;

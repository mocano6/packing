// src/components/FootballPitch/ZoneCell.tsx

import React from "react";
import styles from "./FootballPitch.module.css";
import { ZoneCellProps } from "./FootballPitch.types";

const ZoneCell: React.FC<ZoneCellProps> = ({
  zoneIndex,
  xTValue,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`${styles.zoneCell} ${isSelected ? styles.selected : ""}`}
      onClick={() => onSelect(zoneIndex)}
      style={{
        // Gradient od zielonego do czerwonego bazując na wartości xT
        backgroundColor: `rgba(${Math.round(255 * xTValue)}, 
                              ${Math.round(255 * (1 - xTValue))}, 
                              0, 
                              0.2)`,
      }}
    >
      <span className={styles.xTValue}>{xTValue.toFixed(3)}</span>
    </div>
  );
};

export default ZoneCell;

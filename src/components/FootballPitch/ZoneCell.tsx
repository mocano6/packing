// src/components/FootballPitch/ZoneCell.tsx

import React from "react";
import styles from "./FootballPitch.module.css";
import { ZoneCellProps } from "./FootballPitch.types";
import { getXTColor, getZoneDescription, formatXTValue } from "./utils";

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
        backgroundColor: getXTColor(xTValue),
      }}
      title={`${getZoneDescription(zoneIndex)}
Wartość xT: ${formatXTValue(xTValue)}`}
    >
      <span className={styles.xTValue}>{formatXTValue(xTValue)}</span>
    </div>
  );
};

export default ZoneCell;

import React from "react";
import styles from "./FootballPitch.module.css";
import { ZoneCellProps } from "./FootballPitch.types";
import { getXTColor } from "./utils";

const ZoneCell: React.FC<ZoneCellProps> = ({
  zoneIndex,
  xTValue,
  isSelected,
  isFirstSelection,
  isSecondSelection,
  onSelect,
}) => {
  const getSelectionClass = () => {
    if (isFirstSelection) return styles.firstSelection;
    if (isSecondSelection) return styles.secondSelection;
    if (isSelected) return styles.selected;
    return "";
  };

  return (
    <div
      className={`${styles.zoneCell} ${getSelectionClass()}`}
      onClick={() => onSelect(zoneIndex)}
      style={{
        backgroundColor: getXTColor(xTValue),
      }}
    >
      {!isFirstSelection && !isSecondSelection && (
        <span className={styles.xTValue}>{xTValue.toFixed(3)}</span>
      )}
      {isFirstSelection && <span className={styles.actionText}>PASS</span>}
      {isSecondSelection && <span className={styles.actionText}>RECEIVE</span>}
    </div>
  );
};

export default ZoneCell;

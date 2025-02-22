import React from "react";
import styles from "./FootballPitch.module.css";
import { FootballPitchProps } from "./FootballPitch.types";
import { XT_VALUES } from "./constants";
import ZoneCell from "./ZoneCell";

const FootballPitch: React.FC<FootballPitchProps> = ({
  selectedZone,
  onZoneSelect,
}) => {
  return (
    <div className={styles.pitchContainer}>
      <div className={styles.pitch}>
        <div className={styles.grid}>
          {XT_VALUES.map((row, rowIndex) =>
            row.map((xTValue, colIndex) => {
              const zoneIndex = rowIndex * 12 + colIndex;
              return (
                <ZoneCell
                  key={zoneIndex}
                  zoneIndex={zoneIndex}
                  xTValue={xTValue}
                  isSelected={selectedZone === zoneIndex}
                  onSelect={onZoneSelect}
                />
              );
            })
          )}
        </div>

        {/* Linie boiska */}
        <div className={styles.pitchLines}>
          <div className={styles.centerLine} />
          <div className={styles.centerCircle} />
          <div className={styles.penaltyAreaLeft} />
          <div className={styles.goalAreaLeft} />
          <div className={styles.penaltyAreaRight} />
          <div className={styles.goalAreaRight} />
        </div>
      </div>
    </div>
  );
};

export default FootballPitch;

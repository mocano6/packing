import React, { useState } from "react";
import styles from "./FootballPitch.module.css";
import { FootballPitchProps } from "./FootballPitch.types";
import { XT_VALUES } from "./constants";
import ZoneCell from "./ZoneCell";

const FootballPitch: React.FC<FootballPitchProps> = ({
  selectedZone,
  onZoneSelect,
}) => {
  const [firstClickZone, setFirstClickZone] = useState<number | null>(null);
  const [secondClickZone, setSecondClickZone] = useState<number | null>(null);
  const [firstClickValue, setFirstClickValue] = useState<number | null>(null);

  const handleZoneClick = (zoneIndex: number) => {
    const row = Math.floor(zoneIndex / 12);
    const col = zoneIndex % 12;
    const clickedValue = XT_VALUES[row][col];

    if (!firstClickZone) {
      setFirstClickZone(zoneIndex);
      setFirstClickValue(clickedValue);
      onZoneSelect(zoneIndex, undefined, clickedValue, undefined);
    } else if (!secondClickZone && zoneIndex !== firstClickZone) {
      setSecondClickZone(zoneIndex);
      if (firstClickValue !== null) {
        const xt = clickedValue - firstClickValue;
        onZoneSelect(zoneIndex, xt, firstClickValue, clickedValue);
      }
    } else {
      setSecondClickZone(null);
      setFirstClickZone(zoneIndex);
      setFirstClickValue(clickedValue);
      onZoneSelect(zoneIndex, undefined, clickedValue, undefined);
    }
  };

  return (
    <div className={styles.pitchContainer}>
      <div className={styles.pitch}>
        <div className={styles.grid}>
          {Array.from({ length: 96 }, (_, index) => {
            const row = Math.floor(index / 12);
            const col = index % 12;
            const xTValue = XT_VALUES[row][col];

            return (
              <ZoneCell
                key={index}
                zoneIndex={index}
                xTValue={xTValue}
                isSelected={selectedZone === index}
                isFirstSelection={firstClickZone === index}
                isSecondSelection={secondClickZone === index}
                onSelect={handleZoneClick}
              />
            );
          })}
        </div>
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

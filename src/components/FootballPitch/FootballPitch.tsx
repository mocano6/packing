// src/components/FootballPitch/FootballPitch.tsx

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
  const [clickValue1, setClickValue1] = useState<number | null>(null);
  const [clickValue2, setClickValue2] = useState<number | null>(null);

  const handleZoneClick = (zoneIndex: number) => {
    const row = Math.floor(zoneIndex / 12);
    const col = zoneIndex % 12;
    const clickedValue = XT_VALUES[row][col];

    if (!firstClickZone) {
      // Pierwsze kliknięcie
      setFirstClickZone(zoneIndex);
      setFirstClickValue(clickedValue);
      setClickValue1(clickedValue);
      onZoneSelect(zoneIndex, undefined, clickedValue, undefined);
    } else if (!secondClickZone) {
      // Drugie kliknięcie
      setSecondClickZone(zoneIndex);
      setClickValue2(clickedValue);
      if (firstClickValue !== null) {
        const xT = clickedValue - firstClickValue; // odwrócona kolejność
        onZoneSelect(zoneIndex, xT, firstClickValue, clickedValue);
      }
    } else {
      // Reset po drugim kliku
      setFirstClickZone(null);
      setSecondClickZone(null);
      setFirstClickValue(null);
      setClickValue1(null);
      setClickValue2(null);
      onZoneSelect(zoneIndex);
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

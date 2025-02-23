// src/components/SelectionContainer/SelectionContainer.tsx

import React from "react";
import styles from "./SelectionContainer.module.css";
import { SelectionContainerProps } from "./SelectionContainer.types";

const SelectionContainer: React.FC<SelectionContainerProps> = ({
  players,
  selectedPlayerId,
  selectedReceiverId,
  onReceiverSelect,
  actionMinute,
  onMinuteChange,
}) => {
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className={styles.selectionContainer}>
      <div className={styles.selectionRow}>
        <span className={styles.selectionLabel}>Minuta:</span>
        <div className={styles.minuteInput}>
          <input
            type="number"
            value={actionMinute}
            onChange={(e) => onMinuteChange(Number(e.target.value))}
            min="0"
            max="90"
            className={styles.timeInput}
          />
          <span className={styles.minuteLabel}>min</span>
        </div>
      </div>

      <div className={styles.selectionRow}>
        <span className={styles.selectionLabel}>Nadawca:</span>
        <span className={styles.selectedPlayer}>
          {selectedPlayer
            ? `${selectedPlayer.number} - ${selectedPlayer.name}`
            : "Nie wybrano"}
        </span>
      </div>

      <div className={styles.selectionRow}>
        <span className={styles.selectionLabel}>Odbiorca:</span>
        <select
          className={styles.receiverSelect}
          value={selectedReceiverId || ""}
          onChange={(e) => onReceiverSelect(e.target.value)}
        >
          <option value="">Wybierz odbiorcę</option>
          {players
            .filter((p) => p.id !== selectedPlayerId)
            .map((player) => (
              <option key={player.id} value={player.id}>
                {player.number} - {player.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default SelectionContainer;

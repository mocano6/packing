// src/components/SelectionContainer/SelectionContainer.tsx
import React from "react";
import styles from "./SelectionContainer.module.css";
import ActionTypeToggle from "../ActionTypeToggle/ActionTypeToggle";
import { Player } from "../../types";

interface SelectionContainerProps {
  players: Player[];
  selectedPlayerId: string | null;
  selectedReceiverId: string | null;
  onReceiverSelect: (id: string | null) => void;
  actionMinute: number;
  onMinuteChange: (minute: number) => void;
  actionType: "pass" | "dribble";
  onActionTypeChange: (type: "pass" | "dribble") => void;
}

const SelectionContainer: React.FC<SelectionContainerProps> = ({
  players,
  selectedPlayerId,
  selectedReceiverId,
  onReceiverSelect,
  actionMinute,
  onMinuteChange,
  actionType,
  onActionTypeChange,
}) => {
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className={styles.container}>
      <div className={styles.minuteContainer}>
        <label className={styles.label}>Minuta:</label>
        <input
          type="number"
          value={actionMinute}
          onChange={(e) => onMinuteChange(parseInt(e.target.value) || 0)}
          min="0"
          max="90"
          className={styles.input}
        />
      </div>

      <ActionTypeToggle
        actionType={actionType}
        onActionTypeChange={onActionTypeChange}
      />

      <div className={styles.playerSelection}>
        <label>Nadawca:</label>
        <div className={styles.selectedPlayer}>
          {selectedPlayer
            ? `${selectedPlayer.name} (${selectedPlayer.number})`
            : "Wybierz zawodnika"}
        </div>
      </div>

      {actionType === "pass" && (
        <div className={styles.playerSelection}>
          <label>Odbiorca:</label>
          <select
            value={selectedReceiverId || ""}
            onChange={(e) => onReceiverSelect(e.target.value || null)}
            className={styles.select}
          >
            <option value="">Wybierz zawodnika</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.number})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SelectionContainer;

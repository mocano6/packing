// components/SummarySection/SummarySection.tsx
import React from "react";
import { SummarySectionProps } from "../../types";
import PlayerStats from "../PlayerStats/PlayerStats";
import styles from "./SummarySection.module.css";

const SummarySection: React.FC<SummarySectionProps> = ({
  selectedPlayerId,
  players,
  actions,
}) => {
  const playerActions = selectedPlayerId
    ? actions.filter(
        (a) =>
          a.senderId === selectedPlayerId || a.receiverId === selectedPlayerId
      )
    : [];

  const selectedPlayer = selectedPlayerId
    ? players.find((p) => p.id === selectedPlayerId)
    : null;

  return (
    <div className={styles.summaryContainer}>
      {selectedPlayer ? (
        <PlayerStats player={selectedPlayer} actions={playerActions} />
      ) : (
        <p className={styles.selectPlayerPrompt}>
          Wybierz zawodnika, aby zobaczyć jego statystyki
        </p>
      )}
    </div>
  );
};

export default SummarySection;

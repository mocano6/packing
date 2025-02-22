// src/components/PlayersGrid/PlayersGrid.tsx

import React from "react";
import styles from "./PlayersGrid.module.css";
import { PlayersGridProps } from "./PlayersGrid.types";
import PlayerTile from "./PlayerTile";

const PlayersGrid: React.FC<PlayersGridProps> = ({
  players,
  selectedPlayerId,
  onPlayerSelect,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer,
}) => {
  return (
    <div className={styles.playersGrid}>
      {players.map((player) => (
        <PlayerTile
          key={player.id}
          player={player}
          isSelected={player.id === selectedPlayerId}
          onSelect={onPlayerSelect}
          onEdit={onEditPlayer}
          onDelete={onDeletePlayer}
        />
      ))}
      <div
        className={`${styles.playerTile} ${styles.addPlayerTile}`}
        onClick={onAddPlayer}
      >
        +
      </div>
    </div>
  );
};

export default PlayersGrid;

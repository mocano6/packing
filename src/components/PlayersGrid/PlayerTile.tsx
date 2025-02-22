// src/components/PlayersGrid/PlayerTile.tsx

import React from "react";
import styles from "./PlayersGrid.module.css";
import { PlayerTileProps } from "./PlayersGrid.types";

const PlayerTile: React.FC<PlayerTileProps> = ({
  player,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const handleClick = () => onSelect(player.id);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(player.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(player.id);
  };

  return (
    <div
      className={`${styles.playerTile} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <div className={styles.number}>{player.number}</div>
      <div className={styles.name}>{player.name}</div>
      <button className={styles.editBtn} onClick={handleEdit}>
        ✎
      </button>
      <button className={styles.deleteBtn} onClick={handleDelete}>
        ×
      </button>
    </div>
  );
};

export default PlayerTile;

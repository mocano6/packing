import React from "react";
import { PlayerTileProps } from "./PlayersGrid.types";
import styles from "./PlayersGrid.module.css";

const PlayerTile: React.FC<PlayerTileProps> = ({
  player,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const hasImage = !!player.imageUrl;

  return (
    <div
      className={`${styles.playerTile} ${isSelected ? styles.selected : ""} ${
        hasImage ? styles.withImage : ""
      }`}
      onClick={() => onSelect(player.id)}
    >
      {hasImage && (
        <>
          <img
            src={player.imageUrl}
            alt=""
            className={styles.playerTileImage}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className={styles.playerTileOverlay}></div>
        </>
      )}

      <div className={styles.playerContent}>
        {/* Numer w lewym górnym rogu */}
        <div className={styles.number}>{player.number}</div>

        <button
          className={styles.editBtn}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(player.id);
          }}
          title="Edytuj"
        >
          ✎
        </button>
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(player.id);
          }}
          title="Usuń"
        >
          ✕
        </button>

        {/* Kontener na dane zawodnika - teraz wyśrodkowany */}
        <div className={styles.playerInfo}>
          <div className={styles.name}>{player.name}</div>
          <div className={styles.details}>
            {player.position && (
              <span className={styles.position}>{player.position}</span>
            )}
            {player.birthYear && (
              <span className={styles.birthYear}>{player.birthYear}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerTile;

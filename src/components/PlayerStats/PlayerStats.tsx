import React, { useMemo } from "react";
import { Player, Action, PlayerStats as PlayerStatsType } from "../../types";
import styles from "./PlayerStats.module.css";

interface PlayerStatsProps {
  player: Player;
  actions: Action[];
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, actions }) => {
  const playerStats = useMemo(() => {
    const stats: PlayerStatsType = {
      totalActions: 0,
      totalPoints: 0,
      totalXT: 0,
      packingAsSender: 0,
      packingAsReceiver: 0,
      xtAsSender: 0,
      xtAsReceiver: 0,
      averagePoints: 0,
      averageXT: 0,
      connections: {},
    };

    actions.forEach((action) => {
      stats.totalActions++;
      stats.totalPoints += action.packingPoints;
      stats.totalXT += action.totalPoints;

      if (action.senderId === player.id) {
        stats.packingAsSender += action.packingPoints;
        stats.xtAsSender += action.totalPoints;
        const receiverId = action.receiverId;
        if (!stats.connections[receiverId]) {
          stats.connections[receiverId] = {
            playerName: action.receiverName,
            count: 0,
            totalPoints: 0,
            totalXT: 0,
          };
        }
        stats.connections[receiverId].count++;
        stats.connections[receiverId].totalPoints += action.packingPoints;
        stats.connections[receiverId].totalXT += action.totalPoints;
      }

      if (action.receiverId === player.id) {
        stats.packingAsReceiver += action.packingPoints;
        stats.xtAsReceiver += action.totalPoints;
      }
    });

    stats.averagePoints =
      stats.totalActions > 0 ? stats.totalPoints / stats.totalActions : 0;
    stats.averageXT =
      stats.totalActions > 0 ? stats.totalXT / stats.totalActions : 0;

    return stats;
  }, [player, actions]);

  return (
    <div className={styles.statsContainer}>
      <h3>
        {player.name} #{player.number}
      </h3>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <label>Suma punktów (Packing):</label>
          <span>{playerStats.totalPoints}</span>
        </div>
        <div className={styles.statItem}>
          <label>Suma xT:</label>
          <span>{playerStats.totalXT.toFixed(4)}</span>
        </div>
        <div className={styles.statItem}>
          <label>Średnio punktów (Packing):</label>
          <span>{playerStats.averagePoints.toFixed(1)}</span>
        </div>
        <div className={styles.statItem}>
          <label>Średnio xT:</label>
          <span>{playerStats.averageXT.toFixed(4)}</span>
        </div>
        <div className={styles.statItem}>
          <label>Packing jako nadawca:</label>
          <span>{playerStats.packingAsSender}</span>
        </div>
        <div className={styles.statItem}>
          <label>Packing jako odbiorca:</label>
          <span>{playerStats.packingAsReceiver}</span>
        </div>
        <div className={styles.statItem}>
          <label>xT jako nadawca:</label>
          <span>{playerStats.xtAsSender.toFixed(4)}</span>
        </div>
        <div className={styles.statItem}>
          <label>xT jako odbiorca:</label>
          <span>{playerStats.xtAsReceiver.toFixed(4)}</span>
        </div>
      </div>

      {playerStats.packingAsSender > 0 && (
        <div className={styles.connections}>
          <h4>Połączenia z innymi zawodnikami (do kogo podaje)</h4>
          {Object.entries(playerStats.connections)
            .sort(([, a], [, b]) => b.totalPoints - a.totalPoints)
            .map(([playerId, connection]) => (
              <div key={playerId} className={styles.connection}>
                <span>{connection.playerName}</span>
                <span>{connection.count} akcji</span>
                <span>{connection.totalPoints} pkt (Packing)</span>
                <span>{connection.totalXT.toFixed(4)} xT</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PlayerStats;

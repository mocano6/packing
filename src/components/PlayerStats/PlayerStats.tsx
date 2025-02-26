import React from "react";
import styles from "./PlayerStats.module.css";
import { Player, Action, PlayerStats as PlayerStatsType } from "../../types";

interface PlayerStatsProps {
  player: Player;
  actions: Action[];
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, actions }) => {
  const calculatePlayerStats = (
    player: Player,
    actions: Action[]
  ): PlayerStatsType => {
    const stats: PlayerStatsType = {
      name: player.name,
      number: player.number.toString(),
      totalPointsAsSender: 0,
      totalPointsAsReceiver: 0,
      actionsAsSender: 0,
      actionsAsReceiver: 0,
      avgPointsAsSender: 0,
      avgPointsAsReceiver: 0,
      connections: {},
    };

    actions.forEach((action) => {
      if (action.senderId === player.id) {
        stats.totalPointsAsSender += action.totalPoints;
        stats.actionsAsSender++;

        // Update connections for sender
        if (action.actionType === "pass") {
          const receiverId = action.receiverId;
          if (!stats.connections[receiverId]) {
            stats.connections[receiverId] = {
              count: 0,
              totalPoints: 0,
              playerName: action.receiverName,
            };
          }
          stats.connections[receiverId].count++;
          stats.connections[receiverId].totalPoints += action.totalPoints;
        }
      }

      if (action.receiverId === player.id) {
        stats.totalPointsAsReceiver += action.totalPoints;
        stats.actionsAsReceiver++;
      }
    });

    // Calculate averages
    stats.avgPointsAsSender =
      stats.actionsAsSender > 0
        ? stats.totalPointsAsSender / stats.actionsAsSender
        : 0;
    stats.avgPointsAsReceiver =
      stats.actionsAsReceiver > 0
        ? stats.totalPointsAsReceiver / stats.actionsAsReceiver
        : 0;

    return stats;
  };

  const playerStats = calculatePlayerStats(player, actions);

  return (
    <div className={styles.statsContainer}>
      <h3>
        {player.name} (#{player.number})
      </h3>
      <div className={styles.statsGrid}>
        <div className={styles.statSection}>
          <h4>Jako nadawca</h4>
          <div className={styles.statItem}>
            <label>Liczba akcji:</label>
            <span>{playerStats.actionsAsSender}</span>
          </div>
          <div className={styles.statItem}>
            <label>Suma punktów:</label>
            <span>{playerStats.totalPointsAsSender.toFixed(2)}</span>
          </div>
          <div className={styles.statItem}>
            <label>Średnio punktów:</label>
            <span>{playerStats.avgPointsAsSender.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statSection}>
          <h4>Jako odbiorca</h4>
          <div className={styles.statItem}>
            <label>Liczba akcji:</label>
            <span>{playerStats.actionsAsReceiver}</span>
          </div>
          <div className={styles.statItem}>
            <label>Suma punktów:</label>
            <span>{playerStats.totalPointsAsReceiver.toFixed(2)}</span>
          </div>
          <div className={styles.statItem}>
            <label>Średnio punktów:</label>
            <span>{playerStats.avgPointsAsReceiver.toFixed(2)}</span>
          </div>
        </div>

        {Object.keys(playerStats.connections).length > 0 && (
          <div className={styles.connections}>
            <h4>Połączenia z innymi zawodnikami</h4>
            {Object.entries(playerStats.connections)
              .sort(([, a], [, b]) => b.totalPoints - a.totalPoints)
              .map(([playerId, connection]) => (
                <div key={playerId} className={styles.connection}>
                  <span>{connection.playerName}</span>
                  <span>{connection.count} akcji</span>
                  <span>{connection.totalPoints.toFixed(2)} pkt</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;

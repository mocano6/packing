import React, { useEffect, useState } from "react";
import styles from "./PlayerStats.module.css";
import { Player, PlayerStats as Stats, Action } from "../../types";
import { PlayerStatsProps } from "../../types";

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, actions }) => {
  const [stats, setStats] = useState<Stats>({
    totalActions: 0,
    totalPoints: 0,
    totalXT: 0,
    packingAsSender: 0,
    packingAsReceiver: 0,
    xtAsSender: 0,
    xtAsReceiver: 0,
    averagePoints: 0,
    averageXT: 0,
    totalP3: 0,
    connections: {},
  });

  useEffect(() => {
    const stats: Stats = {
      totalActions: 0,
      totalPoints: 0,
      totalXT: 0,
      packingAsSender: 0,
      packingAsReceiver: 0,
      xtAsSender: 0,
      xtAsReceiver: 0,
      averagePoints: 0,
      averageXT: 0,
      totalP3: 0,
      connections: {},
    };

    actions.forEach((action) => {
      stats.totalActions++;
      stats.totalPoints += action.packingPoints ?? 0;
      stats.totalXT += action.totalPoints;

      // Zliczanie podań P3
      if (action.isP3) {
        stats.totalP3++;
      }

      if (action.senderId === player.id) {
        stats.packingAsSender += action.packingPoints ?? 0;
        stats.xtAsSender += action.totalPoints;
        const receiverId = action.receiverId;
        if (!stats.connections[receiverId]) {
          stats.connections[receiverId] = {
            playerName: `${action.receiverNumber}-${action.receiverName}`,
            count: 0,
            totalPoints: 0,
            totalXT: 0,
          };
        }
        stats.connections[receiverId].count++;
        stats.connections[receiverId].totalPoints += action.packingPoints ?? 0;
        stats.connections[receiverId].totalXT += action.totalPoints;
      }

      if (action.receiverId === player.id) {
        stats.packingAsReceiver += action.packingPoints ?? 0;
        stats.xtAsReceiver += action.totalPoints;
      }
    });

    if (stats.totalActions > 0) {
      stats.averagePoints = stats.totalPoints / stats.totalActions;
      stats.averageXT = stats.totalXT / stats.totalActions;
    }

    setStats(stats);
  }, [player, actions]);

  // Przekształcamy obiekt connections na tablicę
  const connectionsArray = Object.entries(stats.connections).map(
    ([playerId, connection]) => ({
      playerId,
      ...connection,
    })
  );

  // Sortujemy połączenia po liczbie akcji (malejąco)
  connectionsArray.sort((a, b) => b.count - a.count);

  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.playerName}>
        {player.number}-{player.name}
      </h2>

      <div className={styles.statsGrid}>
        {/* Podstawowe statystyki */}
        <div className={`${styles.statItem} ${styles.basicStat}`}>
          <div className={styles.statLabel}>Liczba akcji</div>
          <div className={styles.statValue}>{stats.totalActions}</div>
        </div>

        <div className={`${styles.statItem} ${styles.basicStat}`}>
          <div className={styles.statLabel}>Średni Packing</div>
          <div className={styles.statValue}>
            {stats.averagePoints.toFixed(2)}
          </div>
        </div>

        <div className={`${styles.statItem} ${styles.xtStat}`}>
          <div className={styles.statLabel}>Średni xT</div>
          <div className={styles.statValue}>{stats.averageXT.toFixed(4)}</div>
        </div>

        <div className={`${styles.statItem} ${styles.p3Stat}`}>
          <div className={styles.statLabel}>Liczba podań P3</div>
          <div className={styles.statValue}>{stats.totalP3}</div>
        </div>

        {/* Statystyki jako nadawca */}
        <div className={`${styles.statItem} ${styles.senderStat}`}>
          <div className={styles.statLabel}>Packing jako nadawca</div>
          <div className={styles.statValue}>{stats.packingAsSender}</div>
        </div>

        <div className={`${styles.statItem} ${styles.senderStat}`}>
          <div className={styles.statLabel}>xT jako nadawca</div>
          <div className={styles.statValue}>{stats.xtAsSender.toFixed(4)}</div>
        </div>

        {/* Statystyki jako odbiorca */}
        <div className={`${styles.statItem} ${styles.receiverStat}`}>
          <div className={styles.statLabel}>Packing jako odbiorca</div>
          <div className={styles.statValue}>{stats.packingAsReceiver}</div>
        </div>

        <div className={`${styles.statItem} ${styles.receiverStat}`}>
          <div className={styles.statLabel}>xT jako odbiorca</div>
          <div className={styles.statValue}>
            {stats.xtAsReceiver.toFixed(4)}
          </div>
        </div>
      </div>

      <h3 className={styles.connectionsTitle}>Najczęstsze połączenia</h3>
      {connectionsArray.length > 0 ? (
        <table className={styles.connectionsTable}>
          <thead>
            <tr>
              <th>Zawodnik</th>
              <th>Liczba</th>
              <th>Packing</th>
              <th>xT</th>
            </tr>
          </thead>
          <tbody>
            {connectionsArray.map((connection) => (
              <tr key={connection.playerId}>
                <td>{connection.playerName}</td>
                <td>{connection.count}</td>
                <td>{connection.totalPoints}</td>
                <td>{connection.totalXT.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noConnections}>Brak połączeń do wyświetlenia</p>
      )}
    </div>
  );
};

export default PlayerStats;

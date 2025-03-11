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
    totalShots: 0,
    totalGoals: 0,
    connections: {}, // Zachowujemy dla kompatybilności
    connectionsAsSender: {},
    connectionsAsReceiver: {},
  });

  // Stan dla sortowania
  const [senderSortConfig, setSenderSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "count",
    direction: "descending",
  });

  const [receiverSortConfig, setReceiverSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "count",
    direction: "descending",
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
      totalShots: 0,
      totalGoals: 0,
      connections: {}, // Zachowujemy dla kompatybilności
      connectionsAsSender: {},
      connectionsAsReceiver: {},
    };

    actions.forEach((action) => {
      stats.totalActions++;
      stats.totalPoints += action.packingPoints ?? 0;
      stats.totalXT += action.totalPoints;

      // Zliczanie podań P3
      if (action.isP3) {
        stats.totalP3++;
      }

      // Zliczanie strzałów
      if (action.senderId === player.id && action.isShot) {
        stats.totalShots++;
      }

      // Zliczanie bramek
      if (action.senderId === player.id && action.isGoal) {
        stats.totalGoals++;
      }

      // Połączenia jako podający (sender)
      if (action.senderId === player.id) {
        stats.packingAsSender += action.packingPoints ?? 0;
        stats.xtAsSender += action.totalPoints;

        const receiverId = action.receiverId;
        if (receiverId) {
          // Upewnij się, że receiverId istnieje
          // Dla kompatybilności z istniejącym interfejsem
          if (!stats.connections[receiverId]) {
            stats.connections[receiverId] = {
              playerName: `${action.receiverNumber || ""}-${
                action.receiverName || ""
              }`,
              count: 0,
              totalPoints: 0,
              totalXT: 0,
            };
          }
          stats.connections[receiverId].count++;
          stats.connections[receiverId].totalPoints +=
            action.packingPoints ?? 0;
          stats.connections[receiverId].totalXT += action.totalPoints;

          // Dla nowej struktury
          if (!stats.connectionsAsSender[receiverId]) {
            stats.connectionsAsSender[receiverId] = {
              playerName: `${action.receiverNumber || ""}-${
                action.receiverName || ""
              }`,
              count: 0,
              totalPoints: 0,
              totalXT: 0,
            };
          }
          stats.connectionsAsSender[receiverId].count++;
          stats.connectionsAsSender[receiverId].totalPoints +=
            action.packingPoints ?? 0;
          stats.connectionsAsSender[receiverId].totalXT += action.totalPoints;
        }
      }

      // Połączenia jako przyjmujący (receiver)
      if (action.receiverId === player.id) {
        stats.packingAsReceiver += action.packingPoints ?? 0;
        stats.xtAsReceiver += action.totalPoints;

        const senderId = action.senderId;
        if (senderId) {
          // Upewnij się, że senderId istnieje
          if (!stats.connectionsAsReceiver[senderId]) {
            stats.connectionsAsReceiver[senderId] = {
              playerName: `${action.senderNumber || ""}-${
                action.senderName || ""
              }`,
              count: 0,
              totalPoints: 0,
              totalXT: 0,
            };
          }
          stats.connectionsAsReceiver[senderId].count++;
          stats.connectionsAsReceiver[senderId].totalPoints +=
            action.packingPoints ?? 0;
          stats.connectionsAsReceiver[senderId].totalXT += action.totalPoints;
        }
      }
    });

    if (stats.totalActions > 0) {
      stats.averagePoints = stats.totalPoints / stats.totalActions;
      stats.averageXT = stats.totalXT / stats.totalActions;
    }

    setStats(stats);
  }, [player, actions]);

  // Funkcje sortujące
  const requestSort = (key: string, isSender: boolean) => {
    if (isSender) {
      setSenderSortConfig((prevConfig) => {
        if (prevConfig.key === key) {
          return {
            key,
            direction:
              prevConfig.direction === "ascending" ? "descending" : "ascending",
          };
        }
        return { key, direction: "descending" };
      });
    } else {
      setReceiverSortConfig((prevConfig) => {
        if (prevConfig.key === key) {
          return {
            key,
            direction:
              prevConfig.direction === "ascending" ? "descending" : "ascending",
          };
        }
        return { key, direction: "descending" };
      });
    }
  };

  // Przekształcamy obiekt połączeń na tablice
  const connectionsAsSenderArray = Object.entries(
    stats.connectionsAsSender
  ).map(([playerId, connection]) => ({
    playerId,
    ...connection,
  }));

  const connectionsAsReceiverArray = Object.entries(
    stats.connectionsAsReceiver
  ).map(([playerId, connection]) => ({
    playerId,
    ...connection,
  }));

  // Sortujemy połączenia zgodnie z konfiguracją sortowania
  const sortedSenderConnections = [...connectionsAsSenderArray].sort((a, b) => {
    if (senderSortConfig.key === "playerName") {
      return senderSortConfig.direction === "ascending"
        ? a.playerName.localeCompare(b.playerName)
        : b.playerName.localeCompare(a.playerName);
    }

    const aValue = a[senderSortConfig.key as keyof typeof a];
    const bValue = b[senderSortConfig.key as keyof typeof b];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return senderSortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });

  const sortedReceiverConnections = [...connectionsAsReceiverArray].sort(
    (a, b) => {
      if (receiverSortConfig.key === "playerName") {
        return receiverSortConfig.direction === "ascending"
          ? a.playerName.localeCompare(b.playerName)
          : b.playerName.localeCompare(a.playerName);
      }

      const aValue = a[receiverSortConfig.key as keyof typeof a];
      const bValue = b[receiverSortConfig.key as keyof typeof b];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return receiverSortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    }
  );

  // Funkcja dla wyświetlania ikony sortowania
  const getSortIcon = (
    key: string,
    config: { key: string; direction: "ascending" | "descending" }
  ) => {
    if (key !== config.key) return null;
    return config.direction === "ascending" ? "▲" : "▼";
  };

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

        {/* Nowy kafelek - strzały */}
        <div className={`${styles.statItem} ${styles.shotStat}`}>
          <div className={styles.statLabel}>Liczba strzałów</div>
          <div className={styles.statValue}>{stats.totalShots}</div>
        </div>

        {/* Nowy kafelek - bramki */}
        <div className={`${styles.statItem} ${styles.goalStat}`}>
          <div className={styles.statLabel}>Liczba bramek</div>
          <div className={styles.statValue}>{stats.totalGoals}</div>
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

      {/* Połączenia jako podający */}
      <h3 className={styles.connectionsTitle}>Połączenia, jako podający</h3>
      {sortedSenderConnections.length > 0 ? (
        <table className={styles.connectionsTable}>
          <thead>
            <tr>
              <th
                onClick={() => requestSort("playerName", true)}
                className={styles.sortableHeader}
              >
                Zawodnik {getSortIcon("playerName", senderSortConfig)}
              </th>
              <th
                onClick={() => requestSort("count", true)}
                className={styles.sortableHeader}
              >
                Liczba {getSortIcon("count", senderSortConfig)}
              </th>
              <th
                onClick={() => requestSort("totalPoints", true)}
                className={styles.sortableHeader}
              >
                Packing {getSortIcon("totalPoints", senderSortConfig)}
              </th>
              <th
                onClick={() => requestSort("totalXT", true)}
                className={styles.sortableHeader}
              >
                xT {getSortIcon("totalXT", senderSortConfig)}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSenderConnections.map((connection) => (
              <tr key={connection.playerId}>
                <td>{connection.playerName}</td>
                <td>{connection.count}</td>
                <td>{connection.totalPoints.toFixed(2)}</td>
                <td>{connection.totalXT.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noConnections}>Brak podań do innych zawodników</p>
      )}

      {/* Połączenia jako przyjmujący */}
      <h3 className={styles.connectionsTitle}>Połączenia, jako przyjmujący</h3>
      {sortedReceiverConnections.length > 0 ? (
        <table className={styles.connectionsTable}>
          <thead>
            <tr>
              <th
                onClick={() => requestSort("playerName", false)}
                className={styles.sortableHeader}
              >
                Zawodnik {getSortIcon("playerName", receiverSortConfig)}
              </th>
              <th
                onClick={() => requestSort("count", false)}
                className={styles.sortableHeader}
              >
                Liczba {getSortIcon("count", receiverSortConfig)}
              </th>
              <th
                onClick={() => requestSort("totalPoints", false)}
                className={styles.sortableHeader}
              >
                Packing {getSortIcon("totalPoints", receiverSortConfig)}
              </th>
              <th
                onClick={() => requestSort("totalXT", false)}
                className={styles.sortableHeader}
              >
                xT {getSortIcon("totalXT", receiverSortConfig)}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedReceiverConnections.map((connection) => (
              <tr key={connection.playerId}>
                <td>{connection.playerName}</td>
                <td>{connection.count}</td>
                <td>{connection.totalPoints.toFixed(2)}</td>
                <td>{connection.totalXT.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noConnections}>Brak podań od innych zawodników</p>
      )}
    </div>
  );
};

export default PlayerStats;

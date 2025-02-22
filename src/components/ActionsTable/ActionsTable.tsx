// src/components/ActionsTable/ActionsTable.tsx

import React, { useState, useMemo } from "react";
import styles from "./ActionsTable.module.css";
import { ActionsTableProps, SortConfig } from "./ActionsTable.types";
import { Action } from "../../types";

const ActionsTable: React.FC<ActionsTableProps> = ({
  actions,
  onDeleteAction,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "timestamp",
    direction: "desc",
  });

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedActions = useMemo(() => {
    const sorted = [...actions];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [actions, sortConfig]);

  const requestSort = (key: keyof Action) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Historia akcji</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort("timestamp")}>
                Czas
                {sortConfig.key === "timestamp" && (
                  <span className={styles.sortIndicator}>
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>Nadawca</th>
              <th>Odbiorca</th>
              <th>Strefa</th>
              <th>Punkty bazowe</th>
              <th>Mnożnik</th>
              <th onClick={() => requestSort("totalPoints")}>
                Punkty całkowite
                {sortConfig.key === "totalPoints" && (
                  <span className={styles.sortIndicator}>
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              {onDeleteAction && <th>Akcje</th>}
            </tr>
          </thead>
          <tbody>
            {sortedActions.map((action) => (
              <tr key={action.id}>
                <td>{formatDate(action.timestamp)}</td>
                <td>{`${action.senderNumber} - ${action.senderName}`}</td>
                <td>{`${action.receiverNumber} - ${action.receiverName}`}</td>
                <td>{action.zone}</td>
                <td>{action.basePoints.toFixed(1)}</td>
                <td>{action.multiplier.toFixed(3)}</td>
                <td>{action.totalPoints.toFixed(3)}</td>
                {onDeleteAction && (
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDeleteAction(action.id)}
                      title="Usuń akcję"
                    >
                      ×
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {actions.length === 0 && (
        <div className={styles.noData}>Brak zapisanych akcji</div>
      )}

      {actions.length > 0 && (
        <div className={styles.summary}>
          <div>
            Liczba akcji: <strong>{actions.length}</strong>
          </div>
          <div>
            Suma punktów:{" "}
            <strong>
              {actions
                .reduce((sum, action) => sum + action.totalPoints, 0)
                .toFixed(3)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsTable;

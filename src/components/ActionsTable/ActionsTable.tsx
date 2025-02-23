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
    key: "minute",
    direction: "asc",
  });

  const sortedActions = useMemo(() => {
    const sorted = [...actions];
    sorted.sort((a, b) => {
      if (sortConfig.key === "senderName") {
        const aValue = `${a.senderNumber} - ${a.senderName}`;
        const bValue = `${b.senderNumber} - ${b.senderName}`;
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (sortConfig.key === "receiverName") {
        const aValue = `${a.receiverNumber} - ${a.receiverName}`;
        const bValue = `${b.receiverNumber} - ${b.receiverName}`;
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

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

  const renderSortIndicator = (key: keyof Action) => {
    if (sortConfig.key === key) {
      return (
        <span className={styles.sortIndicator}>
          {sortConfig.direction === "asc" ? "↑" : "↓"}
        </span>
      );
    }
    return null;
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Historia akcji</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                onClick={() => requestSort("minute")}
                data-active-sort={sortConfig.key === "minute"}
              >
                Minuta {renderSortIndicator("minute")}
              </th>
              <th
                onClick={() => requestSort("senderName")}
                data-active-sort={sortConfig.key === "senderName"}
              >
                Nadawca {renderSortIndicator("senderName")}
              </th>
              <th
                onClick={() => requestSort("receiverName")}
                data-active-sort={sortConfig.key === "receiverName"}
              >
                Odbiorca {renderSortIndicator("receiverName")}
              </th>
              <th
                onClick={() => requestSort("zone")}
                data-active-sort={sortConfig.key === "zone"}
              >
                Strefa {renderSortIndicator("zone")}
              </th>
              <th
                onClick={() => requestSort("basePoints")}
                data-active-sort={sortConfig.key === "basePoints"}
              >
                Punkty bazowe {renderSortIndicator("basePoints")}
              </th>
              <th
                onClick={() => requestSort("multiplier")}
                data-active-sort={sortConfig.key === "multiplier"}
              >
                Mnożnik {renderSortIndicator("multiplier")}
              </th>
              <th
                onClick={() => requestSort("totalPoints")}
                data-active-sort={sortConfig.key === "totalPoints"}
              >
                Punkty całkowite {renderSortIndicator("totalPoints")}
              </th>
              {onDeleteAction && <th>Akcje</th>}
            </tr>
          </thead>
          <tbody>
            {sortedActions.map((action) => (
              <tr key={action.id}>
                <td>{action.minute}'</td>
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

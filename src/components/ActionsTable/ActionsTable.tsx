import React, { useState } from "react";
import styles from "./ActionsTable.module.css";
import { ActionsTableProps } from "./ActionsTable.types";

type SortKey =
  | "minute"
  | "sender"
  | "senderXT"
  | "receiver"
  | "receiverXT"
  | "type"
  | "xt"
  | "packing"
  | "p3"; // Dodany klucz sortowania dla P3

type SortDirection = "asc" | "desc";

const ActionsTable: React.FC<ActionsTableProps> = ({
  actions,
  onDeleteAction,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: "minute",
    direction: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((prevSort) => ({
      key,
      direction:
        prevSort.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedActions = () => {
    const sortedActions = [...actions];
    const { key, direction } = sortConfig;

    return sortedActions.sort((a, b) => {
      let comparison = 0;

      switch (key) {
        case "minute":
          comparison = a.minute - b.minute;
          break;
        case "sender":
          comparison = `${a.senderNumber}-${a.senderName}`.localeCompare(
            `${b.senderNumber}-${b.senderName}`
          );
          break;
        case "senderXT":
          comparison = a.senderClickValue - b.senderClickValue;
          break;
        case "receiver":
          comparison = `${a.receiverNumber}-${a.receiverName}`.localeCompare(
            `${b.receiverNumber}-${b.receiverName}`
          );
          break;
        case "receiverXT":
          comparison = a.receiverClickValue - b.receiverClickValue;
          break;
        case "type":
          comparison = a.actionType.localeCompare(b.actionType);
          break;
        case "xt":
          comparison = a.totalPoints - b.totalPoints;
          break;
        case "packing":
          const packingA = a.packingPoints || 0;
          const packingB = b.packingPoints || 0;
          comparison = packingA - packingB;
          break;
        case "p3": // Obsługa sortowania po kolumnie P3
          comparison = (a.isP3 ? 1 : 0) - (b.isP3 ? 1 : 0);
          break;
        default:
          break;
      }

      return direction === "asc" ? comparison : -comparison;
    });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };
  console.log(actions);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              onClick={() => handleSort("minute")}
              className={styles.sortable}
            >
              Minuta {getSortIcon("minute")}
            </th>
            <th
              onClick={() => handleSort("sender")}
              className={styles.sortable}
            >
              Podający {getSortIcon("sender")}
            </th>
            <th
              onClick={() => handleSort("senderXT")}
              className={styles.sortable}
            >
              xT Podanie {getSortIcon("senderXT")}
            </th>
            <th
              onClick={() => handleSort("receiver")}
              className={styles.sortable}
            >
              Odbierający {getSortIcon("receiver")}
            </th>
            <th
              onClick={() => handleSort("receiverXT")}
              className={styles.sortable}
            >
              xT Przyjęcie {getSortIcon("receiverXT")}
            </th>
            <th onClick={() => handleSort("type")} className={styles.sortable}>
              Typ {getSortIcon("type")}
            </th>
            <th onClick={() => handleSort("xt")} className={styles.sortable}>
              xT {getSortIcon("xt")}
            </th>
            <th
              onClick={() => handleSort("packing")}
              className={styles.sortable}
            >
              Packing {getSortIcon("packing")}
            </th>
            {/* Nowa kolumna P3 */}
            <th onClick={() => handleSort("p3")} className={styles.sortable}>
              P3 {getSortIcon("p3")}
            </th>
            <th>Usuń</th>
          </tr>
        </thead>
        <tbody>
          {getSortedActions().map((action) => (
            <tr key={action.id}>
              <td>{action.minute}'</td>
              <td>
                {action.senderNumber}-{action.senderName}
              </td>
              <td>{action.senderClickValue.toFixed(4)}</td>
              <td>
                {action.receiverNumber}-{action.receiverName}
              </td>
              <td>{action.receiverClickValue.toFixed(4)}</td>
              <td>{action.actionType === "pass" ? "Podanie" : "Drybling"}</td>
              <td>{action.totalPoints.toFixed(4)}</td>
              <td>
                {action.packingPoints ? Math.round(action.packingPoints) : "-"}
              </td>
              {/* Nowa komórka P3 */}
              <td>{action.isP3 ? "✅" : "-"}</td>
              <td className={styles.actionCell}>
                <div
                  onClick={() => onDeleteAction(action.id)}
                  className={styles.x}
                >
                  &times;
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActionsTable;

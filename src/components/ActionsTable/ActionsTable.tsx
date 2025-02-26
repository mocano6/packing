import React from "react";
import styles from "./ActionsTable.module.css";
import { ActionsTableProps } from "./ActionsTable.types";

const ActionsTable: React.FC<ActionsTableProps> = ({
  actions,
  onDeleteAction,
}) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Minuta</th>
            <th>Podający</th>
            <th>Numer</th>
            <th>xT Podanie</th>
            <th>Odbierający</th>
            <th>Numer</th>
            <th>xT Przyjęcie</th>
            <th>Typ</th>
            <th>xT</th>
            <th>Packing</th>
            <th>Usuń</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr key={action.id}>
              <td>{action.minute}'</td>
              <td>{action.senderName}</td>
              <td>{action.senderNumber}</td>
              <td>{action.senderClickValue.toFixed(4)}</td>
              <td>{action.receiverName}</td>
              <td>{action.receiverNumber}</td>
              <td>{action.receiverClickValue.toFixed(4)}</td>
              <td>{action.actionType === "pass" ? "Podanie" : "Drybling"}</td>
              <td>{action.totalPoints.toFixed(4)}</td>
              <td>
                {action.packingPoints ? Math.round(action.packingPoints) : "-"}
              </td>
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

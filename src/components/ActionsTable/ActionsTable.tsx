// src/components/ActionsTable/ActionsTable.tsx

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
            <th>xT</th>
            <th>Usuń</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr key={action.id}>
              <td>{action.minute}'</td>
              <td>{action.senderName}</td>
              <td>{action.senderNumber}</td>
              <td>{action.senderClickValue}</td>
              <td>{action.receiverName}</td>
              <td>{action.receiverNumber}</td>
              <td>{action.receiverClickValue}</td>
              <td>{action.totalPoints.toFixed(3)}</td>
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

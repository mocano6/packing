// src/components/ExportButton/ExportButton.tsx
import React from "react";
import { Player, Action } from "../../types";
import styles from "./ExportButton.module.css";

interface ExportButtonProps {
  players: Player[];
  actions: Action[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ players, actions }) => {
  const handleExportData = () => {
    const exportData = {
      players,
      actions,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `packing-rate-data-${
      new Date().toISOString().split("T")[0]
    }.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button className={styles.exportButton} onClick={handleExportData}>
      Eksportuj dane do JSON
    </button>
  );
};

export default ExportButton;

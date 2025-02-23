// src/components/Instructions/Instructions.tsx

import React, { useState } from "react";
import styles from "./Instructions.module.css";

const Instructions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.instructionsContainer}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Ukryj instrukcję" : "Pokaż instrukcję"}
        <span
          className={`${styles.arrow} ${isExpanded ? styles.up : styles.down}`}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className={styles.instructionsList}>
          <h3>Jak korzystać z aplikacji:</h3>
          <ol>
            <li>Wybierz minutę akcji (0-90)</li>
            <li>Kliknij na zawodnika rozpoczynającego akcję (nadawcę)</li>
            <li>Kliknij na zawodnika kończącego akcję (odbiorcę)</li>
            <li>Wybierz strefę boiska, w której zakończono akcję</li>
            <li>Zatwierdź akcję przyciskiem "Dodaj"</li>
          </ol>
          <p>
            <strong>Uwaga:</strong> Punkty są przyznawane automatycznie na
            podstawie:
          </p>
          <ul>
            <li>Odległości między zawodnikami</li>
            <li>Wybranej strefy boiska</li>
            <li>Pozycji zawodników na boisku</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Instructions;

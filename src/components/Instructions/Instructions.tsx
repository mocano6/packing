// src/components/Instructions/Instructions.tsx

import React, { useState } from "react";
import styles from "./Instructions.module.css";

const Instructions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const sections = {
    basic: {
      title: "Podstawowe informacje",
      content: (
        <>
          <ol>
            <li>Wybierz zawodnika rozpoczynającego akcję (nadawcę)</li>
            <li>Kliknij na boisko, aby zaznaczyć strefę początkową (X)</li>
            <li>Kliknij ponownie, aby zaznaczyć strefę końcową (O)</li>
            <li>Wybierz zawodnika kończącego akcję (odbiorcę)</li>
            <li>Wprowadź minutę meczu (0-90+)</li>
            <li>Użyj opcji P3, jeśli podanie trafia za linię oborony</li>
            <li>Kliknij "Zapisz akcję" aby dodać podanie do bazy</li>
          </ol>
        </>
      ),
    },
    scoring: {
      title: "Punktacja i analiza",
      content: (
        <>
          <p>
            <strong>
              Punkty Packing są przyznawane automatycznie na podstawie:
            </strong>
          </p>
          <ul>
            <li>Liczby ominętych zawodników</li>
            <li>Pozycji na boisku (strefy)</li>
            <li>Jakości wykonania podania</li>
          </ul>
          <p>
            <strong>Expected Threat (xT):</strong> Przyznawany dodatkowo jako
            mnożnik wartości podań w strefach o wyższym potencjale bramkowym.
          </p>
          <p>
            <strong>Podania P3:</strong> Podania za linię obrony.
          </p>
        </>
      ),
    },
    tips: {
      title: "Wskazówki",
      content: (
        <>
          <ul>
            <li>Dodaj wszystkich zawodników przed rozpoczęciem analizy</li>
            <li>
              Po zapisaniu akcji minuta pozostaje niezmieniona, co ułatwia
              wprowadzanie serii podań
            </li>
            <li>Regularnie eksportuj dane, aby uniknąć ich utraty</li>
            <li>Analizuj połączenia między zawodnikami w sekcji statystyk</li>
            <li>Konsekwentnie oznaczaj podania P3 dla spójnej analizy</li>
          </ul>
        </>
      ),
    },
  };

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
        <div className={styles.instructionsContent}>
          <div className={styles.sectionTabs}>
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                className={`${styles.sectionTab} ${
                  activeSection === key ? styles.activeTab : ""
                }`}
                onClick={() => setActiveSection(key)}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className={styles.instructionsList}>
            <h3>{sections[activeSection as keyof typeof sections].title}</h3>
            {sections[activeSection as keyof typeof sections].content}
          </div>

          <div className={styles.instructionFooter}>
            <div className={styles.tip}>
              <span className={styles.tipIcon}>💡</span>
              <p>
                Dokładna i konsekwentna analiza podań pozwoli na uzyskanie
                wartościowych danych o stylu gry drużyny i skuteczności
                zawodników.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;

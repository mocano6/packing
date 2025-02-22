// src/components/Manual/Manual.tsx

import React from "react";
import styles from "./Manual.module.css";
import { ManualProps } from "./Manual.types";

const Manual: React.FC<ManualProps> = ({
  className,
  title = "Instrukcja:",
  instructions = [
    'Dodaj zawodników klikając na kafelek "+"',
    "Wybierz zawodnika, który wykonuje podanie (nadawca)",
    "Wybierz zawodnika, który otrzymuje podanie (odbiorca)",
    "Wybierz strefę boiska, z której wykonywane jest podanie",
    "Dodaj punkty za elementy podania używając przycisków",
    "Zatwierdź akcję - punkty zostaną przeliczone z uwzględnieniem mnożnika xT",
  ],
}) => {
  return (
    <div className={`${styles.manual} ${className || ""}`}>
      <h2>{title}</h2>
      <ol>
        {instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </div>
  );
};

export default Manual;

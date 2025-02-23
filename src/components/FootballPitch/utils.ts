// src/components/FootballPitch/utils.ts

/**
 * Przelicza wartość xT na kolor reprezentujący zagrożenie
 * @param xTValue - wartość xT (zakres 0.322-0.612)
 * @returns string z kolorem w formacie rgba
 */
export const getXTColor = (xTValue: number): string => {
  // Normalizacja wartości do zakresu 0-1
  const normalizedValue = (xTValue - 0.322) / (0.612 - 0.322);

  // Kolory dla różnych przedziałów wartości xT
  if (normalizedValue < 0.2) {
    return `rgba(65, 171, 93, 0.6)`; // zielony dla niskich wartości
  } else if (normalizedValue < 0.4) {
    return `rgba(254, 224, 139, 0.6)`; // żółty dla średnio-niskich
  } else if (normalizedValue < 0.6) {
    return `rgba(252, 141, 89, 0.6)`; // pomarańczowy dla średnich
  } else if (normalizedValue < 0.8) {
    return `rgba(239, 59, 44, 0.6)`; // czerwony dla wysokich
  } else {
    return `rgba(203, 24, 29, 0.6)`; // ciemnoczerwony dla najwyższych
  }
};

/**
 * Zwraca opis strefy boiska na podstawie indeksu
 * @param zoneIndex - indeks strefy
 * @returns string z opisem strefy
 */
export const getZoneDescription = (zoneIndex: number): string => {
  const rowIndex = Math.floor(zoneIndex / 12);
  const colIndex = zoneIndex % 12;

  if (rowIndex < 2) {
    return "Strefa defensywna";
  } else if (rowIndex < 4) {
    return "Strefa środkowa defensywna";
  } else if (rowIndex < 6) {
    return "Strefa środkowa ofensywna";
  } else {
    return "Strefa ofensywna";
  }
};

/**
 * Formatuje wartość xT do wyświetlenia
 * @param value - wartość xT
 * @returns sformatowana wartość jako string
 */
export const formatXTValue = (value: number): string => {
  return value.toFixed(3);
};

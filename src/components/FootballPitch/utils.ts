// src/components/FootballPitch/utils.ts

export const getXTColor = (xTValue: number): string => {
  // Normalizacja do zakresu 0-1 używając faktycznych min/max z danych
  const normalizedValue = (xTValue - 0.00638303) / (0.25745362 - 0.00638303);

  if (normalizedValue < 0.2) {
    return `rgba(49, 130, 189, 0.7)`; // niebieski dla bardzo niskich wartości
  } else if (normalizedValue < 0.4) {
    return `rgba(158, 202, 225, 0.7)`; // jasnoniebieski dla niskich wartości
  } else if (normalizedValue < 0.6) {
    return `rgba(255, 255, 191, 0.7)`; // żółty dla średnich wartości
  } else if (normalizedValue < 0.8) {
    return `rgba(254, 178, 76, 0.7)`; // pomarańczowy dla wysokich wartości
  } else {
    return `rgba(240, 59, 32, 0.7)`; // czerwony dla najwyższych wartości
  }
};

export const calculateXTDifference = (
  firstValue: number,
  secondValue: number
): number => {
  return secondValue - firstValue;
};

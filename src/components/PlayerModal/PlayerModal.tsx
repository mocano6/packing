import React, { useState, useEffect } from "react";
import { Player } from "../../types";
import styles from "./PlayerModal.module.css";

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, "id">) => void;
  editingPlayer?: Player;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlayer,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    position: "",
    birthYear: "",
    imageUrl: "", // Nowe pole
  });

  const [errors, setErrors] = useState({
    name: "",
    number: "",
    position: "",
    birthYear: "",
    imageUrl: "", // Nowe pole
  });

  const positions = [
    { value: "GK", label: "Bramkarz (GK)" },
    { value: "CB", label: "Środkowy obrońca (CB)" },
    // { value: "RB", label: "Prawy obrońca (RB)" },
    // { value: "LB", label: "Lewy obrońca (LB)" },
    { value: "DM", label: "Defensywny pomocnik (DM)" },
    // { value: "CM", label: "Środkowy pomocnik (CM)" },
    { value: "AM", label: "Ofensywny pomocnik (AM)" },
    { value: "RS", label: "Prawy skrzydłowy (RW)" },
    { value: "LS", label: "Lewy skrzydłowy (LW)" },
    { value: "ST", label: "Napastnik (ST)" },
  ];

  useEffect(() => {
    if (editingPlayer) {
      setFormData({
        name: editingPlayer.name,
        number: editingPlayer.number.toString(),
        position: editingPlayer.position,
        birthYear: editingPlayer.birthYear?.toString() || "",
        imageUrl: editingPlayer.imageUrl || "", // Dodane pole
      });
    } else {
      setFormData({
        name: "",
        number: "",
        position: "",
        birthYear: "",
        imageUrl: "", // Dodane pole
      });
    }
  }, [editingPlayer]);

  // Pomocnicza funkcja do walidacji URL
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Puste URL jest OK (pole opcjonalne)
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      number: "",
      position: "",
      birthYear: "",
      imageUrl: "", // Dodane pole
    };

    if (!formData.name.trim()) {
      newErrors.name = "Imię jest wymagane";
    }

    if (!formData.number.trim()) {
      newErrors.number = "Numer jest wymagany";
    } else if (isNaN(Number(formData.number))) {
      newErrors.number = "Numer musi być liczbą";
    }

    if (!formData.position) {
      newErrors.position = "Pozycja jest wymagana";
    }

    if (formData.birthYear && isNaN(Number(formData.birthYear))) {
      newErrors.birthYear = "Rok urodzenia musi być liczbą";
    } else if (formData.birthYear) {
      const year = Number(formData.birthYear);
      const currentYear = new Date().getFullYear();
      if (year < 1950 || year > currentYear) {
        newErrors.birthYear = `Rok musi być między 1950 a ${currentYear}`;
      }
    }

    // Walidacja URL obrazu (opcjonalnie)
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Nieprawidłowy format URL";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        number: parseInt(formData.number),
        position: formData.position,
        birthYear: formData.birthYear
          ? parseInt(formData.birthYear)
          : undefined,
        imageUrl: formData.imageUrl.trim() || undefined, // Dodane pole
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {editingPlayer ? "Edytuj zawodnika" : "Dodaj zawodnika"}
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">
              Imię i nazwisko:
            </label>
            <input
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="number">
              Numer:
            </label>
            <input
              className={`${styles.input} ${errors.number ? styles.error : ""}`}
              type="text"
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
            />
            {errors.number && (
              <span className={styles.errorMessage}>{errors.number}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="position">
              Pozycja:
            </label>
            <select
              className={`${styles.input} ${
                errors.position ? styles.error : ""
              }`}
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            >
              <option value="">Wybierz pozycję</option>
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
            {errors.position && (
              <span className={styles.errorMessage}>{errors.position}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="birthYear">
              Rok urodzenia:
            </label>
            <input
              className={`${styles.input} ${
                errors.birthYear ? styles.error : ""
              }`}
              type="number"
              id="birthYear"
              placeholder="np. 2008"
              value={formData.birthYear}
              onChange={(e) =>
                setFormData({ ...formData, birthYear: e.target.value })
              }
            />
            {errors.birthYear && (
              <span className={styles.errorMessage}>{errors.birthYear}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="imageUrl">
              URL obrazu (opcjonalnie):
            </label>
            <input
              className={`${styles.input} ${
                errors.imageUrl ? styles.error : ""
              }`}
              type="text"
              id="imageUrl"
              placeholder="https://przykład.com/obraz.jpg"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
            {errors.imageUrl && (
              <span className={styles.errorMessage}>{errors.imageUrl}</span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.saveButton}`}
            >
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerModal;

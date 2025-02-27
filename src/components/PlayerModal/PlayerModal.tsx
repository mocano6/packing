// components/PlayerModal/PlayerModal.tsx
import React, { useState, useEffect } from "react";
import { Player, PlayerModalProps } from "../../types";
import styles from "./PlayerModal.module.css";

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
  });

  const [errors, setErrors] = useState({
    name: "",
    number: "",
    position: "",
  });

  useEffect(() => {
    if (editingPlayer) {
      setFormData({
        name: editingPlayer.name,
        number: editingPlayer.number.toString(),
        position: editingPlayer.position,
      });
    } else {
      setFormData({
        name: "",
        number: "",
        position: "",
      });
    }
  }, [editingPlayer]);

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      number: "",
      position: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Imię jest wymagane";
    }

    if (!formData.number.trim()) {
      newErrors.number = "Numer jest wymagany";
    } else if (isNaN(Number(formData.number))) {
      newErrors.number = "Numer musi być liczbą";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Pozycja jest wymagana";
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
        position: formData.position.trim(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{editingPlayer ? "Edytuj zawodnika" : "Dodaj zawodnika"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Imię i nazwisko:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="number">Numer:</label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
            />
            {errors.number && (
              <span className={styles.error}>{errors.number}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="position">Pozycja:</label>
            <input
              type="text"
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            {errors.position && (
              <span className={styles.error}>{errors.position}</span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Zapisz
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerModal;

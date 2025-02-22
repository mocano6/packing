// src/components/PlayerModal/PlayerModal.tsx

import React, { useState, useEffect } from "react";
import styles from "./PlayerModal.module.css";
import { PlayerModalProps, FormData } from "./PlayerModal.types";

const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlayer,
}) => {
  const [formData, setFormData] = useState<FormData>({
    number: "",
    name: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (editingPlayer) {
      setFormData({
        number: editingPlayer.number.toString(),
        name: editingPlayer.name,
      });
    } else {
      setFormData({
        number: "",
        name: "",
      });
    }
    setErrors({});
  }, [editingPlayer, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.number) {
      newErrors.number = "Numer jest wymagany";
    } else if (!/^\d+$/.test(formData.number)) {
      newErrors.number = "Numer musi być liczbą";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Nazwa jest wymagana";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        number: parseInt(formData.number),
        name: formData.name.trim(),
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {editingPlayer ? "Edytuj zawodnika" : "Dodaj zawodnika"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="number" className={styles.label}>
              Numer:
            </label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  number: e.target.value,
                }))
              }
              className={`${styles.input} ${errors.number ? styles.error : ""}`}
              placeholder="Np. 10"
              autoFocus
            />
            {errors.number && (
              <span className={styles.errorMessage}>{errors.number}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nazwa:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              placeholder="Imię i nazwisko"
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
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
              {editingPlayer ? "Zapisz zmiany" : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerModal;

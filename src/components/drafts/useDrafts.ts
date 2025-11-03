"use client";

import { useState, useEffect } from "react";
import { DraftManager, Draft } from "./DraftManager";

export const useDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  // Cargar drafts y actualizar cada 3 segundos (solo si cambiaron)
  useEffect(() => {
    const loadDrafts = () => {
      const allDrafts = DraftManager.getAllDrafts();

      // Solo actualizar si los drafts realmente cambiaron
      setDrafts((prevDrafts) => {
        const prevJson = JSON.stringify(prevDrafts);
        const newJson = JSON.stringify(allDrafts);

        if (prevJson !== newJson) {
          return allDrafts;
        }
        return prevDrafts;
      });
    };

    loadDrafts();

    // Actualizar cada 3 segundos para reflejar cambios (aumentado de 2 a 3)
    const interval = setInterval(loadDrafts, 3000);
    return () => clearInterval(interval);
  }, []);

  const deleteDraft = (draftId: string) => {
    DraftManager.deleteDraft(draftId);
    setDrafts(DraftManager.getAllDrafts());
  };

  return {
    drafts,
    deleteDraft,
  };
};

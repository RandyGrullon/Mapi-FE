"use client";

import { useState, useEffect } from "react";
import { DraftManager, Draft } from "./DraftManager";

export const useDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  // Cargar drafts y actualizar cada 2 segundos
  useEffect(() => {
    const loadDrafts = () => {
      const allDrafts = DraftManager.getAllDrafts();
      setDrafts(allDrafts);
    };

    loadDrafts();

    // Actualizar cada 2 segundos para reflejar cambios
    const interval = setInterval(loadDrafts, 2000);
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

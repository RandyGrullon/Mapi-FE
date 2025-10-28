"use client";

import { useState, useEffect } from "react";
import { useNavigation } from "../navigation/NavigationContext";
import { useWizard } from "../wizard/WizardProvider";
import { DraftManager, Draft } from "./DraftManager";

export const useDraftsPage = () => {
  const { navigateToWizard } = useNavigation();
  const { resetWizard } = useWizard();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setDrafts(DraftManager.getAllDrafts());
  }, []);

  const handleDeleteDraft = (draftId: string) => {
    setDraftToDelete(draftId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDraft = () => {
    if (draftToDelete) {
      DraftManager.deleteDraft(draftToDelete);
      setDrafts(DraftManager.getAllDrafts());
      setDraftToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const cancelDeleteDraft = () => {
    setDraftToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  };

  const handleLoadDraft = (draftId: string) => {
    // Guardar el draftId en localStorage para que el WizardProvider lo cargue
    localStorage.setItem("currentDraftId", draftId);
    // Limpiar cualquier draft actual antes de cargar el nuevo
    localStorage.removeItem("currentDraftId");
    localStorage.setItem("currentDraftId", draftId);
    // Navegar al wizard
    navigateToWizard();
  };

  const handleNewTrip = () => {
    resetWizard();
    navigateToWizard();
  };

  return {
    drafts,
    draftToDelete,
    isDeleteModalOpen,
    handleDeleteDraft,
    confirmDeleteDraft,
    cancelDeleteDraft,
    formatDate,
    handleLoadDraft,
    handleNewTrip,
  };
};

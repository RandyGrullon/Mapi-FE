/**
 * Draft Manager
 * Componente para gestionar la persistencia de borradores
 */

"use client";

import { useEffect } from "react";
import { useDraftStore } from "@/stores/draftStore";
import { useWizardStore } from "@/stores/wizardStore";

export const DraftManager = () => {
  const {
    isAutoSaveEnabled,
    enableAutoSave,
    disableAutoSave,
    saveDraft,
    currentDraftId,
  } = useDraftStore();
  const wizardState = useWizardStore();

  // Guardar draft inmediatamente cuando cambia el wizard
  useEffect(() => {
    // Solo guardar si hay servicios seleccionados y no está completado
    if (wizardState.selectedServices.length > 0 && !wizardState.completed) {
      // Guardar inmediatamente
      saveDraft();
    }
  }, [
    wizardState.selectedServices,
    wizardState.activeModules,
    wizardState.currentModuleIndex,
    wizardState.completed,
    saveDraft,
  ]);

  // Habilitar auto-save cuando el wizard está activo
  useEffect(() => {
    // Habilitar auto-save si hay servicios seleccionados y no está completado
    if (
      wizardState.selectedServices.length > 0 &&
      !wizardState.completed &&
      !isAutoSaveEnabled
    ) {
      enableAutoSave();
    }

    // Deshabilitar auto-save cuando el wizard se completa
    if (wizardState.completed && isAutoSaveEnabled) {
      disableAutoSave();
    }

    // Cleanup al desmontar
    return () => {
      if (isAutoSaveEnabled) {
        disableAutoSave();
      }
    };
  }, [
    wizardState.selectedServices.length,
    wizardState.completed,
    isAutoSaveEnabled,
    enableAutoSave,
    disableAutoSave,
  ]);

  // Este componente no renderiza nada visible
  return null;
};

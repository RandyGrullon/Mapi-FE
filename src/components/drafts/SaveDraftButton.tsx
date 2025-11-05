/**
 * Save Draft Button
 * Botón para guardar manualmente un borrador (útil para testing)
 */

"use client";

import { useDraftStore } from "@/stores/draftStore";
import { useWizardStore } from "@/stores/wizardStore";

interface SaveDraftButtonProps {
  onSaveSuccess?: (message: string) => void;
}

export const SaveDraftButton = ({
  onSaveSuccess,
}: SaveDraftButtonProps = {}) => {
  const { saveDraft, drafts } = useDraftStore();
  const { selectedServices, activeModules } = useWizardStore();

  const handleSave = () => {
    if (selectedServices.length === 0) {
      if (onSaveSuccess) {
        onSaveSuccess(
          "Por favor selecciona al menos un servicio antes de guardar"
        );
      }
      return;
    }

    const draftId = saveDraft();

    if (onSaveSuccess) {
      onSaveSuccess(
        `Borrador guardado exitosamente! Total: ${drafts.length + 1}`
      );
    }
  };

  return (
    <button
      onClick={handleSave}
      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm flex items-center gap-2"
      title="Guardar borrador manualmente"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        />
      </svg>
      Guardar Borrador
    </button>
  );
};

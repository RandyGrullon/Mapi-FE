/**
 * Draft Debug Panel
 * Panel de debugging para ver el estado de drafts y wizard
 */

"use client";

import { useState } from "react";
import { useDraftStore } from "@/stores/draftStore";
import { useWizardStore } from "@/stores/wizardStore";

export const DraftDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const draftStore = useDraftStore();
  const wizardStore = useWizardStore();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Abrir panel de debug"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-purple-600 rounded-lg shadow-2xl p-4 w-96 max-h-[600px] overflow-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Draft Debug Panel
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Draft Store State */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-purple-700">
          Draft Store
        </h4>
        <div className="bg-purple-50 p-3 rounded text-xs space-y-1">
          <p>
            <strong>Total Drafts:</strong> {draftStore.drafts.length}
          </p>
          <p>
            <strong>Current Draft ID:</strong>{" "}
            {draftStore.currentDraftId || "None"}
          </p>
          <p>
            <strong>Auto-Save Enabled:</strong>{" "}
            {draftStore.isAutoSaveEnabled ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>Last Saved:</strong>{" "}
            {draftStore.lastSavedAt
              ? new Date(draftStore.lastSavedAt).toLocaleTimeString()
              : "Never"}
          </p>
        </div>
      </div>

      {/* Wizard Store State */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-blue-700">
          Wizard Store
        </h4>
        <div className="bg-blue-50 p-3 rounded text-xs space-y-1">
          <p>
            <strong>Selected Services:</strong>{" "}
            {wizardStore.selectedServices.join(", ") || "None"}
          </p>
          <p>
            <strong>Active Modules:</strong> {wizardStore.activeModules.length}
          </p>
          <p>
            <strong>Current Module Index:</strong>{" "}
            {wizardStore.currentModuleIndex}
          </p>
          <p>
            <strong>Completed:</strong>{" "}
            {wizardStore.completed ? "✅ Yes" : "❌ No"}
          </p>
        </div>

        {/* Progress Detail */}
        {wizardStore.activeModules.length > 0 && (
          <div className="bg-green-50 p-3 rounded text-xs mt-2 space-y-2">
            <p className="font-semibold text-green-800">Progress por Módulo:</p>
            {wizardStore.activeModules.map((module: any, index: number) => {
              const isCurrentModule = index === wizardStore.currentModuleIndex;
              const isCompleted = module.completed;
              const isPast = index < wizardStore.currentModuleIndex;

              let icon = "⏳";
              if (isCompleted || wizardStore.completed) icon = "✅";
              else if (isPast) icon = "✅";
              else if (isCurrentModule) icon = "🔄";

              return (
                <div
                  key={module.type}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    <span>{icon}</span>
                    <span className="font-medium">{module.type}</span>
                  </span>
                  <span
                    className={isCurrentModule ? "font-bold text-blue-600" : ""}
                  >
                    {module.currentStep}/{module.totalSteps}
                  </span>
                </div>
              );
            })}
            <div className="pt-2 border-t border-green-200 mt-2">
              <div className="flex items-center justify-between font-bold">
                <span>Progreso Total:</span>
                <span className="text-green-700">
                  {wizardStore.completed
                    ? "100%"
                    : Math.round(
                        (wizardStore.activeModules.reduce(
                          (acc: number, m: any, i: number) => {
                            if (m.completed || wizardStore.completed)
                              return acc + m.totalSteps;
                            if (i < wizardStore.currentModuleIndex)
                              return acc + m.totalSteps;
                            if (i === wizardStore.currentModuleIndex)
                              return acc + m.currentStep;
                            return acc;
                          },
                          0
                        ) /
                          wizardStore.activeModules.reduce(
                            (acc: number, m: any) => acc + m.totalSteps,
                            0
                          )) *
                          100
                      ) + "%"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drafts List */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-amber-700">
          Saved Drafts ({draftStore.drafts.length})
        </h4>
        <div className="bg-amber-50 p-3 rounded text-xs max-h-[200px] overflow-y-auto">
          {draftStore.drafts.length === 0 ? (
            <p className="text-gray-500 italic">No drafts saved yet</p>
          ) : (
            <ul className="space-y-2">
              {draftStore.drafts.map((draft) => (
                <li key={draft.id} className="border-b border-amber-200 pb-2">
                  <p className="font-semibold">{draft.name}</p>
                  <p className="text-[10px] text-gray-600">
                    Progress: {draft.progress}% | Services:{" "}
                    {draft.selectedServices.length}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Updated: {new Date(draft.updatedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => {
            console.log("=== DRAFT STORE STATE ===");
            console.log(draftStore);
            console.log("=== WIZARD STORE STATE ===");
            console.log(wizardStore);
            console.log("=== LOCALSTORAGE ===");
            const stored = localStorage.getItem("mapi_drafts");
            console.log("Raw:", stored);
            if (stored) {
              console.log("Parsed:", JSON.parse(stored));
            }
          }}
          className="w-full bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700"
        >
          📋 Log to Console
        </button>

        <button
          onClick={() => setShowConfirmClear(true)}
          className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700"
        >
          🗑️ Clear All Drafts
        </button>
      </div>

      {/* Modal de confirmación */}
      {showConfirmClear && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          onClick={() => setShowConfirmClear(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3">Confirmar Eliminación</h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar todos los drafts de
              localStorage? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("mapi_drafts");
                  setShowConfirmClear(false);
                  window.location.reload();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useState } from "react";
import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ModularWizard } from "@/components/wizard/ModularWizard";
import { useWizardStore } from "@/stores/wizardStore";
import { DraftManager } from "@/components/drafts/DraftManager";
import { SaveDraftButton } from "@/components/drafts/SaveDraftButton";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ProgressBadge } from "@/components/wizard/ProgressBadge";

const PlanPageLayout = () => {
  const { resetWizard, completed, selectedServices } = useWizardStore();
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DraftManager />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">
                  ✈️
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg md:text-2xl font-bold">
                    Planificador de Viajes
                  </h1>
                  {selectedServices.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {selectedServices.length}{" "}
                      {selectedServices.length === 1 ? "servicio" : "servicios"}{" "}
                      seleccionado{selectedServices.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                {/* Progress Badge */}
                <ProgressBadge />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {selectedServices.length > 0 && (
                <>
                  <SaveDraftButton
                    onSaveSuccess={(message) => showToast(message, "success")}
                  />
                  <button
                    onClick={() => {
                      resetWizard();
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                    title="Nuevo viaje"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <ModularWizard />
      </div>

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default function PlanPage() {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <PlanPageLayout />
      </SidebarProvider>
    </NavigationProvider>
  );
}

"use client";

import { NavigationProvider } from "@/components/NavigationContext";
import { WizardProvider } from "@/components/WizardProvider";
import { SidebarProvider } from "@/components/SidebarContext";
import { Sidebar } from "@/components/Sidebar";
import { WizardSteps } from "@/components/WizardSteps";
import { WizardContent } from "@/components/WizardContent";
import { useWizard } from "@/components/WizardProvider";
import { useNavigation } from "@/components/NavigationContext";

const PlanPageLayout = () => {
  const { travelInfo, resetWizard } = useWizard();
  const { navigateToHome, navigateToWizard } = useNavigation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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
              <div>
                <h1 className="text-lg md:text-2xl font-bold">
                  Planificador de Viajes
                </h1>
                {travelInfo.destination && (
                  <p className="text-xs text-gray-500">
                    {travelInfo.destination}
                    {Number(travelInfo.travelers) > 0
                      ? ` • ${travelInfo.travelers} ${
                          Number(travelInfo.travelers) === 1
                            ? "viajero"
                            : "viajeros"
                        }`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => {
                  resetWizard();
                  navigateToWizard();
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

              <button className="px-3 py-1.5 md:px-4 md:py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-all duration-200 text-sm flex items-center gap-1.5">
                <span>🔍</span>
                <span>Explorar</span>
              </button>
            </div>
          </div>

          <WizardSteps />
        </header>

        <WizardContent />
      </div>
    </div>
  );
};

export default function PlanPage() {
  return (
    <NavigationProvider>
      <WizardProvider>
        <SidebarProvider>
          <PlanPageLayout />
        </SidebarProvider>
      </WizardProvider>
    </NavigationProvider>
  );
}

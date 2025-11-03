/**
 * Página de Wizard Modular
 * Integra el nuevo sistema de wizard completamente modular
 */

"use client";

import { ModularWizard } from "@/components/wizard/ModularWizard";
import { useWizardStore } from "@/stores/wizardStore";

export default function ModularWizardPage() {
  const { resetWizard } = useWizardStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Planificador de Viajes
              </h1>
              <p className="text-sm text-gray-500">Sistema modular dinámico</p>
            </div>
          </div>

          <button
            onClick={resetWizard}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Reiniciar
          </button>
        </div>
      </header>

      {/* Wizard Content */}
      <main className="max-w-7xl mx-auto">
        <ModularWizard />
      </main>
    </div>
  );
}

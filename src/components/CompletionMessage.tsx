"use client";

import { TravelInfo } from "./WizardProvider";

interface CompletionMessageProps {
  travelInfo: TravelInfo;
}

export const CompletionMessage = ({ travelInfo }: CompletionMessageProps) => {
  return (
    <div className="pl-14 space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-blue-900">
              ¡Tu plan de viaje está listo! 🎉
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Hemos procesado toda tu información
            </p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          He analizado todas tus preferencias y he encontrado las mejores
          opciones para tu viaje de{" "}
          <span className="font-semibold">{travelInfo.origin}</span> a{" "}
          <span className="font-semibold">{travelInfo.destination}</span>.
        </p>
        <p className="text-gray-600 text-sm">
          Revisa todos los detalles a continuación. Cada sección incluye
          múltiples opciones para que puedas elegir la que mejor se adapte a tus
          necesidades y presupuesto.
        </p>
      </div>
    </div>
  );
};

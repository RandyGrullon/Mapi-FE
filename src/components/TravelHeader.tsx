"use client";

import { TravelInfo } from "./WizardProvider";
import { TabType } from "./useTravelSelections";

interface TravelHeaderProps {
  travelInfo: TravelInfo;
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
  onNavigateBack: () => void;
}

export const TravelHeader = ({
  travelInfo,
  selectedTab,
  onTabChange,
  onNavigateBack,
}: TravelHeaderProps) => {
  const tabs = [
    { id: "packages" as TabType, label: "Paquetes", icon: "📦" },
    { id: "flights" as TabType, label: "Vuelos", icon: "✈️" },
    { id: "hotels" as TabType, label: "Hoteles", icon: "🏨" },
    { id: "activities" as TabType, label: "Actividades", icon: "🎯" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-3 md:mb-4 transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">Volver al formulario</span>
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 truncate">
              Opciones de Viaje a {travelInfo.destination}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {travelInfo.travelers}{" "}
                {travelInfo.travelers === "1" ? "viajero" : "viajeros"}
              </span>
              <span className="flex items-center gap-1.5">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {travelInfo.duration} días
              </span>
              <span className="flex items-center gap-1.5">
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                {travelInfo.dates}
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200 flex-shrink-0">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium whitespace-nowrap">
              Cancelación flexible
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex gap-4 md:gap-6 border-b border-gray-200 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-2 py-3 md:py-3.5 font-medium text-sm transition-all relative whitespace-nowrap flex-shrink-0 ${
                selectedTab === tab.id
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              {selectedTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

"use client";

import { ActivitiesModuleData } from "@/types/wizard";

interface ActivitiesSummaryProps {
  data: ActivitiesModuleData;
}

export const ActivitiesSummary = ({ data }: ActivitiesSummaryProps) => {
  const availableInterests = [
    { id: "adventure", label: "Aventura", icon: "🏔️" },
    { id: "culture", label: "Cultura", icon: "🏛️" },
    { id: "food", label: "Gastronomía", icon: "🍽️" },
    { id: "nature", label: "Naturaleza", icon: "🌳" },
    { id: "nightlife", label: "Vida nocturna", icon: "🎉" },
    { id: "shopping", label: "Compras", icon: "🛍️" },
    { id: "sports", label: "Deportes", icon: "⚽" },
    { id: "relaxation", label: "Relajación", icon: "🧘" },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 font-medium mb-3">
        Actividades por ciudad
      </div>

      {data.citiesActivities && data.citiesActivities.length > 0 ? (
        <div className="space-y-4">
          {data.citiesActivities
            .filter((city) => city.interests.length > 0)
            .map((cityActivity, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-bold text-gray-900 mb-3">
                  📍 {cityActivity.city}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cityActivity.interests.map((interestId) => {
                    const interest = availableInterests.find(
                      (i) => i.id === interestId || i.label === interestId
                    );
                    return (
                      <span
                        key={interestId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700"
                      >
                        <span>{interest?.icon || "🎯"}</span>
                        <span>{interest?.label || interestId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
          No se han seleccionado actividades
        </div>
      )}
    </div>
  );
};

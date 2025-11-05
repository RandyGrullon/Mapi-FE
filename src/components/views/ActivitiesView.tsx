"use client";

import { Activity } from "../data/travel-data";

interface ActivitiesViewProps {
  activities: Activity[];
  selected: string[];
  onToggle: (id: string) => void;
}

export const ActivitiesView = ({
  activities,
  selected,
  onToggle,
}: ActivitiesViewProps) => {
  return (
    <div>
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            🎯 Selecciona las actividades que desees (opcional)
          </span>{" "}
          para personalizar tu itinerario de viaje
        </p>
        {selected.length > 0 && (
          <p className="text-xs text-gray-600 mt-1.5 font-medium">
            {selected.length} actividad{selected.length !== 1 ? "es" : ""}{" "}
            seleccionada{selected.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {activities.map((activity) => {
          const isSelected = selected.includes(activity.id);
          const canSelect = true; // Permitir seleccionar todas

          return (
            <div
              key={activity.id}
              onClick={() => canSelect && onToggle(activity.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                isSelected
                  ? "border-gray-900 shadow-md ring-2 ring-gray-100"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {activity.name}
                    </h4>
                    <p className="text-xs text-gray-500">{activity.category}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  {activity.rating}/5
                </span>
                <span>•</span>
                <span>{activity.duration}</span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Incluye:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {activity.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${activity.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

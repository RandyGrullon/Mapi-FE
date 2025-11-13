"use client";

import { useState } from "react";
import { ActivitiesModuleData } from "@/types/wizard";

interface EditActivitiesFormProps {
  data: ActivitiesModuleData;
  onSave: (data: Partial<ActivitiesModuleData>) => void;
  onCancel: () => void;
}

export const EditActivitiesForm = ({
  data,
  onSave,
  onCancel,
}: EditActivitiesFormProps) => {
  const [citiesActivities, setCitiesActivities] = useState(
    data.citiesActivities || []
  );

  const activityOptions = [
    "Museo",
    "Tour guiado",
    "Gastronomía",
    "Vida nocturna",
    "Naturaleza",
    "Deportes",
    "Compras",
    "Teatro/Shows",
  ];

  const toggleInterest = (cityIndex: number, interest: string) => {
    setCitiesActivities((prev) => {
      const newCities = [...prev];
      const cityActivities = { ...newCities[cityIndex] };

      if (cityActivities.interests.includes(interest)) {
        cityActivities.interests = cityActivities.interests.filter(
          (i) => i !== interest
        );
      } else {
        cityActivities.interests = [...cityActivities.interests, interest];
      }

      newCities[cityIndex] = cityActivities;
      return newCities;
    });
  };

  const handleSave = () => {
    onSave({ citiesActivities });
  };

  const canSave = citiesActivities.some((city) => city.interests.length > 0);

  return (
    <div className="space-y-6">
      {citiesActivities.map((cityActivity, cityIndex) => (
        <div
          key={cityIndex}
          className="border-b border-gray-200 pb-6 last:border-0"
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            {cityActivity.city}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activityOptions.map((activity) => {
              const isSelected = cityActivity.interests.includes(activity);
              return (
                <label
                  key={activity}
                  className={`
                    flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleInterest(cityIndex, activity)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{activity}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              canSave
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

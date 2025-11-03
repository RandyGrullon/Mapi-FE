/**
 * Módulo de Actividades por Ciudad
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ServiceType,
  ActivitiesModuleData,
  ModuleComponentProps,
  CityActivities,
  FlightModuleData,
} from "@/types/wizard";
import { useWizardStore } from "@/stores/wizardStore";

export const ActivitiesModule = ({
  data,
  onUpdate,
  onComplete,
  currentStep,
  isLastModule,
}: ModuleComponentProps<ActivitiesModuleData>) => {
  const { completeModule, previousModule, activeModules } = useWizardStore();

  // Obtener ciudades del módulo de vuelos
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [citiesActivities, setCitiesActivities] = useState<CityActivities[]>(
    data.citiesActivities || []
  );
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  useEffect(() => {
    // Extraer ciudades del módulo de vuelos
    const flightModule = activeModules.find(
      (m) => m.type === ServiceType.FLIGHTS
    );
    if (flightModule) {
      const flightData = flightModule.data as FlightModuleData;
      const destinationCities = new Set<string>();
      const originCity = flightData.segments[0]?.from;

      // Solo agregar las ciudades de DESTINO (to), no las de origen (from)
      flightData.segments.forEach((segment) => {
        if (segment.to) {
          // No agregar la ciudad de origen como destino de actividades
          if (segment.to !== originCity) {
            destinationCities.add(segment.to);
          }
        }
      });

      // Si es ida y vuelta o multi-ciudad y la última ciudad es la ciudad de origen,
      // no la incluyas como destino de actividades
      const lastSegment = flightData.segments[flightData.segments.length - 1];
      if (lastSegment?.to === originCity) {
        destinationCities.delete(originCity);
      }

      const citiesArray = Array.from(destinationCities);
      setAvailableCities(citiesArray);

      // Inicializar citiesActivities si está vacío o si las ciudades no coinciden
      if (citiesArray.length > 0) {
        // Verificar si ya existen ciudades en citiesActivities
        const existingCities = data.citiesActivities || [];

        if (existingCities.length === 0) {
          // Inicializar desde cero
          const initialActivities = citiesArray.map((city) => ({
            city,
            interests: [],
          }));
          setCitiesActivities(initialActivities);
        } else {
          // Mantener los datos existentes pero asegurar que todas las ciudades estén presentes
          const updatedActivities = citiesArray.map((city) => {
            const existing = existingCities.find((ca) => ca.city === city);
            return existing || { city, interests: [] };
          });
          setCitiesActivities(updatedActivities);
        }
      }
    }
  }, [activeModules, data.citiesActivities]);

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

  const toggleInterest = (cityIndex: number, interestId: string) => {
    setCitiesActivities((prev) => {
      const newCities = [...prev];
      const cityActivities = { ...newCities[cityIndex] };

      if (cityActivities.interests.includes(interestId)) {
        cityActivities.interests = cityActivities.interests.filter(
          (id) => id !== interestId
        );
      } else {
        cityActivities.interests = [...cityActivities.interests, interestId];
      }

      newCities[cityIndex] = cityActivities;

      // Actualizar el store inmediatamente después de cambiar el estado
      setTimeout(() => {
        onUpdate({ citiesActivities: newCities });
      }, 0);

      return newCities;
    });
  };

  const handleComplete = () => {
    onUpdate({ citiesActivities });
    completeModule(ServiceType.ACTIVITIES);
  };

  // Verificar que al menos una ciudad tenga intereses seleccionados
  const canContinue = citiesActivities.some(
    (city) => city.interests.length > 0
  );

  // Memoizar currentCity para evitar problemas de renderizado
  const currentCity = useMemo(() => {
    return (
      citiesActivities[selectedCityIndex] || {
        city: "",
        interests: [],
      }
    );
  }, [citiesActivities, selectedCityIndex]);

  if (availableCities.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <p className="text-yellow-800">
            No se encontraron ciudades del módulo de vuelos. Por favor, completa
            primero el módulo de vuelos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Actividades por ciudad
        </h2>
        <p className="text-gray-600">
          Selecciona actividades para cada ciudad de tu itinerario
        </p>
      </div>

      {/* City Selector */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {citiesActivities.map((cityActivity, index) => {
            const hasActivities = cityActivity.interests.length > 0;
            return (
              <button
                key={index}
                onClick={() => setSelectedCityIndex(index)}
                className={`
                  relative px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all
                  ${
                    selectedCityIndex === index
                      ? "bg-black text-white"
                      : "bg-white border-2 border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {cityActivity.city}
                {hasActivities && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {citiesActivities.filter((c) => c.interests.length > 0).length} de{" "}
          {citiesActivities.length} ciudades configuradas
        </p>
      </div>

      {/* Current City Activities */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {currentCity.city}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentCity.interests.length} actividad
                {currentCity.interests.length !== 1 ? "es" : ""} seleccionada
                {currentCity.interests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Interests Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableInterests.map((interest) => {
              const isSelected = currentCity.interests.includes(interest.id);

              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(selectedCityIndex, interest.id)}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{interest.icon}</div>
                  <div className="font-medium text-sm">{interest.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary of all cities */}
        {citiesActivities.filter((c) => c.interests.length > 0).length > 0 && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Resumen de actividades
            </h4>
            <div className="space-y-2">
              {citiesActivities
                .filter((c) => c.interests.length > 0)
                .map((cityActivity, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="font-semibold text-gray-900 min-w-[120px]">
                      {cityActivity.city}:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cityActivity.interests.map((interestId) => {
                        const interest = availableInterests.find(
                          (i) => i.id === interestId
                        );
                        return (
                          <span
                            key={interestId}
                            className="text-xs px-2 py-1 bg-white rounded border border-gray-200"
                          >
                            {interest?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={previousModule}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={handleComplete}
          disabled={!canContinue}
          className={`
            flex-1 px-6 py-3 rounded-xl font-semibold transition-all
            ${
              canContinue
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isLastModule ? "Finalizar" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { useWizardStore } from "@/stores/wizardStore";
import {
  ServiceType,
  FlightModuleData,
  ActivitiesModuleData,
} from "@/types/wizard";

export const OptionalActivitiesForm = () => {
  const { addCompletedModule, activeModules } = useWizardStore();
  const [showForm, setShowForm] = useState(false);

  // Extraer ciudades de destino del módulo de vuelos
  const getDestinationCities = () => {
    const flightModule = activeModules.find(
      (m) => m.type === ServiceType.FLIGHTS
    );
    if (!flightModule) return [];

    const flightData = flightModule.data as FlightModuleData;
    const cities = new Set<string>();
    const originCity = flightData.segments[0]?.from;

    // Agregar ciudades de destino (to), excluyendo la ciudad de origen
    flightData.segments.forEach((segment) => {
      if (segment.to && segment.to !== originCity) {
        cities.add(segment.to);
      }
    });

    return Array.from(cities);
  };

  const destinationCities = getDestinationCities();

  // Estado para las actividades por ciudad
  const [citiesActivities, setCitiesActivities] = useState<
    Array<{ city: string; interests: string[] }>
  >([]);

  const [currentCity, setCurrentCity] = useState("");
  const [currentActivities, setCurrentActivities] = useState<string[]>([]);

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

  const addCityActivities = () => {
    if (currentCity && currentActivities.length > 0) {
      setCitiesActivities([
        ...citiesActivities,
        { city: currentCity, interests: [...currentActivities] },
      ]);
      setCurrentCity("");
      setCurrentActivities([]);
    }
  };

  const removeCityActivities = (index: number) => {
    setCitiesActivities(citiesActivities.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Crear los datos de actividades
    const activitiesData: ActivitiesModuleData = {
      citiesActivities,
    };

    // Agregar el módulo completado al store
    addCompletedModule(ServiceType.ACTIVITIES, activitiesData);

    // Resetear formulario
    setShowForm(false);
    setCitiesActivities([]);
    setCurrentCity("");
    setCurrentActivities([]);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-2xl">
            🎟️
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Agregar Actividades</h4>
            <p className="text-sm text-gray-500">
              Selecciona actividades para tus destinos
            </p>
          </div>
          <span className="text-gray-400">+</span>
        </div>
      </button>
    );
  }

  const canAddCity = currentCity && currentActivities.length > 0;
  const canSave = citiesActivities.length > 0;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎟️</div>
            <div>
              <h4 className="font-bold text-gray-900">Actividades</h4>
              <p className="text-xs text-gray-500">
                Selecciona actividades por ciudad
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(false);
              setCitiesActivities([]);
              setCurrentCity("");
              setCurrentActivities([]);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="p-6 space-y-6">
        {/* Actividades ya agregadas */}
        {citiesActivities.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-gray-700">
              Actividades agregadas:
            </h5>
            {citiesActivities.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    📍 {item.city}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-block px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeCityActivities(index)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para agregar nueva ciudad */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            {destinationCities.length > 0 ? (
              <select
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              >
                <option value="">Selecciona una ciudad</option>
                {destinationCities
                  .filter(
                    (city) => !citiesActivities.some((ca) => ca.city === city)
                  )
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                placeholder="Ej: París, Francia"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Actividades de interés
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activityOptions.map((activity) => (
                <label
                  key={activity}
                  className={`
                    flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      currentActivities.includes(activity)
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={currentActivities.includes(activity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCurrentActivities([...currentActivities, activity]);
                      } else {
                        setCurrentActivities(
                          currentActivities.filter((a) => a !== activity)
                        );
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{activity}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={addCityActivities}
            disabled={!canAddCity}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold transition-all
              ${
                canAddCity
                  ? "bg-gray-800 text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Agregar ciudad
          </button>
        </div>

        {/* Botón de guardar todo */}
        {citiesActivities.length > 0 && (
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all"
          >
            Guardar Actividades
          </button>
        )}
      </div>
    </div>
  );
};

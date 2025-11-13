"use client";

import { useState } from "react";
import { useWizardStore } from "@/stores/wizardStore";
import { ServiceType, FlightModuleData, CarModuleData } from "@/types/wizard";

export const OptionalCarForm = () => {
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
  const defaultLocation =
    destinationCities.length === 1 ? destinationCities[0] : "";

  // Datos del formulario
  const [pickupLocation, setPickupLocation] = useState(defaultLocation);
  const [dropoffLocation, setDropoffLocation] = useState(defaultLocation);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [carType, setCarType] = useState("economy");

  const handleSave = () => {
    // Crear los datos del auto
    const carData: CarModuleData = {
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      carType,
    };

    // Agregar el módulo completado al store
    addCompletedModule(ServiceType.CAR, carData);

    // Resetear formulario
    setShowForm(false);
    setPickupLocation(defaultLocation);
    setDropoffLocation(defaultLocation);
    setPickupDate("");
    setDropoffDate("");
    setCarType("economy");
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-2xl">
            🚗
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Agregar Auto</h4>
            <p className="text-sm text-gray-500">
              Configura el alquiler de auto para tu viaje
            </p>
          </div>
          <span className="text-gray-400">+</span>
        </div>
      </button>
    );
  }

  const canSave =
    pickupLocation && dropoffLocation && pickupDate && dropoffDate;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚗</div>
            <div>
              <h4 className="font-bold text-gray-900">Alquiler de Auto</h4>
              <p className="text-xs text-gray-500">Configura el transporte</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lugar de recogida
              </label>
              {destinationCities.length > 1 ? (
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Selecciona una ciudad</option>
                  {destinationCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : destinationCities.length === 1 ? (
                <input
                  type="text"
                  value={pickupLocation}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              ) : (
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Ej: Aeropuerto de París"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lugar de devolución
              </label>
              {destinationCities.length > 1 ? (
                <select
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Selecciona una ciudad</option>
                  {destinationCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : destinationCities.length === 1 ? (
                <input
                  type="text"
                  value={dropoffLocation}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              ) : (
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  placeholder="Ej: Aeropuerto de París"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de recogida
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de devolución
              </label>
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                min={pickupDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de vehículo
            </label>
            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="economy">Económico</option>
              <option value="compact">Compacto</option>
              <option value="midsize">Mediano</option>
              <option value="suv">SUV</option>
              <option value="luxury">Lujo</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold transition-all
              ${
                canSave
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Guardar Auto
          </button>
        </div>
      </div>
    </div>
  );
};

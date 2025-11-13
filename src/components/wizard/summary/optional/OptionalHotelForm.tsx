"use client";

import { useState } from "react";
import { useWizardStore } from "@/stores/wizardStore";
import { ServiceType, FlightModuleData, HotelModuleData } from "@/types/wizard";

export const OptionalHotelForm = () => {
  const { addCompletedModule, activeModules } = useWizardStore();
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);

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
  const defaultDestination =
    destinationCities.length === 1 ? destinationCities[0] : "";

  // Datos del formulario
  const [destination, setDestination] = useState(defaultDestination);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [hotelType, setHotelType] = useState("standard");

  const handleSave = () => {
    // Crear los datos del hotel
    const hotelData: HotelModuleData = {
      destination,
      checkIn,
      checkOut,
      rooms,
      guests,
      hotelType,
    };

    // Agregar el módulo completado al store
    addCompletedModule(ServiceType.HOTEL, hotelData);

    // Resetear formulario
    setShowForm(false);
    setStep(1);
    setDestination(defaultDestination);
    setCheckIn("");
    setCheckOut("");
    setRooms(1);
    setGuests(2);
    setHotelType("standard");
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-2xl">
            🏨
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Agregar Hotel</h4>
            <p className="text-sm text-gray-500">
              Configura el alojamiento para tu viaje
            </p>
          </div>
          <span className="text-gray-400">+</span>
        </div>
      </button>
    );
  }

  const canContinueStep1 = destination && checkIn && checkOut;
  const canSave = canContinueStep1 && rooms > 0 && guests > 0;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏨</div>
            <div>
              <h4 className="font-bold text-gray-900">Hotel</h4>
              <p className="text-xs text-gray-500">Paso {step} de 2</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(false);
              setStep(1);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino
              </label>
              {destinationCities.length > 1 ? (
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
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
                  value={destination}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              ) : (
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ej: París, Francia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canContinueStep1}
              className={`
                w-full px-6 py-3 rounded-lg font-semibold transition-all
                ${
                  canContinueStep1
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones
                </label>
                <input
                  type="number"
                  min="1"
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huéspedes
                </label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de hotel
              </label>
              <select
                value={hotelType}
                onChange={(e) => setHotelType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="economy">Económico</option>
                <option value="standard">Estándar</option>
                <option value="comfort">Confort</option>
                <option value="luxury">Lujo</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Atrás
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
                Guardar Hotel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Módulo de Hotel
 * Maneja la búsqueda y selección de alojamiento
 */

"use client";

import { useState } from "react";
import {
  ServiceType,
  HotelModuleData,
  ModuleComponentProps,
} from "@/types/wizard";
import { useWizardStore } from "@/stores/wizardStore";

export const HotelModule = ({
  data,
  onUpdate,
  onComplete,
  onBack,
  currentStep,
  isLastModule,
}: ModuleComponentProps<HotelModuleData>) => {
  // ========== PASO 1: DESTINO Y FECHAS ==========
  if (currentStep === 0) {
    return <HotelLocationStep data={data} onUpdate={onUpdate} />;
  }

  // ========== PASO 2: HABITACIONES Y HUÉSPEDES ==========
  if (currentStep === 1) {
    return (
      <HotelDetailsStep
        data={data}
        onUpdate={onUpdate}
        onComplete={onComplete}
        isLastModule={isLastModule}
      />
    );
  }

  return null;
};

// ========== PASO 1: DESTINO Y FECHAS ==========
const HotelLocationStep = ({
  data,
  onUpdate,
}: {
  data: HotelModuleData;
  onUpdate: (data: Partial<HotelModuleData>) => void;
}) => {
  const { nextModule, previousModule } = useWizardStore();
  const [destination, setDestination] = useState(data.destination || "");
  const [checkIn, setCheckIn] = useState(data.checkIn || "");
  const [checkOut, setCheckOut] = useState(data.checkOut || "");

  const handleContinue = () => {
    onUpdate({ destination, checkIn, checkOut });
    nextModule();
  };

  const canContinue = destination && checkIn && checkOut;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Dónde te hospedarás?
        </h2>
        <p className="text-gray-600">Ingresa el destino y las fechas</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
        {/* Destino */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destino
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ej: París, Francia"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          onClick={handleContinue}
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
          Continuar
        </button>
      </div>
    </div>
  );
};

// ========== PASO 2: HABITACIONES Y HUÉSPEDES ==========
const HotelDetailsStep = ({
  data,
  onUpdate,
  onComplete,
  isLastModule,
}: {
  data: HotelModuleData;
  onUpdate: (data: Partial<HotelModuleData>) => void;
  onComplete: () => void;
  isLastModule: boolean;
}) => {
  const { completeModule, nextModule, previousModule } = useWizardStore();
  const [rooms, setRooms] = useState(data.rooms || 1);
  const [guests, setGuests] = useState(data.guests || 1);
  const [hotelType, setHotelType] = useState(data.hotelType || "any");

  const hotelTypes = [
    { value: "any", label: "Cualquier tipo" },
    { value: "hotel", label: "Hotel" },
    { value: "resort", label: "Resort" },
    { value: "apartment", label: "Apartamento" },
    { value: "hostel", label: "Hostel" },
  ];

  const handleComplete = () => {
    onUpdate({ rooms, guests, hotelType });
    completeModule(ServiceType.HOTEL);

    if (!isLastModule) {
      nextModule();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Detalles del alojamiento
        </h2>
        <p className="text-gray-600">Habitaciones y huéspedes</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
        {/* Habitaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de habitaciones
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setRooms(Math.max(1, rooms - 1))}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold w-12 text-center">{rooms}</span>
            <button
              onClick={() => setRooms(rooms + 1)}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Huéspedes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de huéspedes
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold w-12 text-center">
              {guests}
            </span>
            <button
              onClick={() => setGuests(guests + 1)}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Tipo de alojamiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de alojamiento
          </label>
          <div className="grid grid-cols-2 gap-3">
            {hotelTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setHotelType(type.value)}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${
                    hotelType === type.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
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
          className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          {isLastModule ? "Finalizar" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

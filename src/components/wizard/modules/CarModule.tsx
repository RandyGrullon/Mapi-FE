/**
 * Módulo de Renta de Auto
 */

"use client";

import { useState } from "react";
import {
  ServiceType,
  CarModuleData,
  ModuleComponentProps,
} from "@/types/wizard";
import { useWizardStore } from "@/stores/wizardStore";

export const CarModule = ({
  data,
  onUpdate,
  onComplete,
  currentStep,
  isLastModule,
}: ModuleComponentProps<CarModuleData>) => {
  const { completeModule, previousModule } = useWizardStore();
  const [pickupLocation, setPickupLocation] = useState(
    data.pickupLocation || ""
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    data.dropoffLocation || ""
  );
  const [pickupDate, setPickupDate] = useState(data.pickupDate || "");
  const [dropoffDate, setDropoffDate] = useState(data.dropoffDate || "");
  const [carType, setCarType] = useState(data.carType || "economy");

  const carTypes = [
    { value: "economy", label: "Económico", icon: "🚗" },
    { value: "compact", label: "Compacto", icon: "🚙" },
    { value: "suv", label: "SUV", icon: "🚐" },
    { value: "luxury", label: "Lujo", icon: "🚘" },
  ];

  const handleComplete = () => {
    onUpdate({
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      carType,
    });
    completeModule(ServiceType.CAR);
  };

  const canContinue =
    pickupLocation && dropoffLocation && pickupDate && dropoffDate;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Renta de auto</h2>
        <p className="text-gray-600">Configura tu renta de vehículo</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
        {/* Ubicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recoger en
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Ej: Aeropuerto JFK"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devolver en
            </label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="Ej: Aeropuerto JFK"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Tipo de vehículo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de vehículo
          </label>
          <div className="grid grid-cols-2 gap-3">
            {carTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setCarType(type.value)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    carType === type.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-medium">{type.label}</div>
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

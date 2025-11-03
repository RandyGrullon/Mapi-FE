/**
 * Componente de Selección de Servicios
 * Primer paso del wizard donde el usuario elige qué módulos activar
 */

"use client";

import { useState } from "react";
import { ServiceType } from "@/types/wizard";
import { useWizardStore } from "@/stores/wizardStore";

interface ServiceOption {
  type: ServiceType;
  label: string;
  icon: string;
  description: string;
}

const AVAILABLE_SERVICES: ServiceOption[] = [
  {
    type: ServiceType.FLIGHTS,
    label: "Vuelos",
    icon: "✈️",
    description: "Buscar y reservar vuelos",
  },
  {
    type: ServiceType.HOTEL,
    label: "Hotel",
    icon: "🏨",
    description: "Encontrar alojamiento",
  },
  {
    type: ServiceType.CAR,
    label: "Auto",
    icon: "🚗",
    description: "Rentar un vehículo",
  },
  {
    type: ServiceType.ACTIVITIES,
    label: "Actividades",
    icon: "🎟️",
    description: "Experiencias y tours",
  },
];

export const ServiceSelectionStep = () => {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const { selectServices } = useWizardStore();

  const toggleService = (serviceType: ServiceType) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceType)) {
        return prev.filter((s) => s !== serviceType);
      } else {
        return [...prev, serviceType];
      }
    });
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      selectServices(selectedServices);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          ¿Qué servicios deseas agregar?
        </h2>
        <p className="text-gray-600">
          Selecciona uno o más servicios para tu viaje
        </p>
      </div>

      {/* Service Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {AVAILABLE_SERVICES.map((service) => {
          const isSelected = selectedServices.includes(service.type);

          return (
            <button
              key={service.type}
              onClick={() => toggleService(service.type)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200
                ${
                  isSelected
                    ? "border-black bg-black text-white shadow-lg scale-105"
                    : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-md"
                }
              `}
            >
              {/* Checkbox Indicator */}
              <div
                className={`
                absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${
                  isSelected
                    ? "border-white bg-white"
                    : "border-gray-300 bg-white"
                }
              `}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Service Content */}
              <div className="text-left">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold mb-1">{service.label}</h3>
                <p
                  className={`text-sm ${
                    isSelected ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  {service.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
            ${
              selectedServices.length > 0
                ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Continuar con {selectedServices.length}{" "}
          {selectedServices.length === 1 ? "servicio" : "servicios"}
        </button>
      </div>

      {/* Helper Text */}
      {selectedServices.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Selecciona al menos un servicio para continuar
        </p>
      )}
    </div>
  );
};

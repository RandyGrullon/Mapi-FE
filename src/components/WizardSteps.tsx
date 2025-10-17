"use client";

import { useState } from "react";
import { useWizard, WizardStep } from "./WizardProvider";

// Iconos SVG para cada paso
const StepIcons = {
  route: (
    // Icono de ruta (origen + destino combinados)
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM12 2L2 7l10 5 10-5-10-5z" />
    </svg>
  ),
  plane: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  ),
  landing: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49c.21.37.62.58 1.05.58.16 0 .32-.03.48-.09l13.03-3.46c.8-.21 1.28-1.04 1.06-1.84z" />
    </svg>
  ),
  people: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  hotel: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
    </svg>
  ),
  activities: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
    </svg>
  ),
  money: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  ),
};

export const WizardSteps = () => {
  const { steps, currentStepIndex } = useWizard();

  // Don't show steps if there are no completed steps
  const hasCompletedSteps = steps.some((step) => step.completed);
  if (!hasCompletedSteps && steps.length <= 1) return null;

  // Calcular el porcentaje de progreso
  const progress =
    steps.length > 1 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  // Determinar el color del gradiente basado en el progreso y el paso actual
  const gradientClass =
    currentStepIndex === 6 // Presupuesto
      ? "from-emerald-300 to-emerald-500"
      : "from-gray-400 to-gray-600";

  // Obtener el título del paso actual si existe
  const currentStep = steps[currentStepIndex];
  const currentStepTitle = currentStep?.title || "";

  // Determinar el icono según el paso actual (8 pasos totales)
  const getStepIcon = () => {
    switch (currentStepIndex) {
      case 0: // Origen + Destino (dual input)
        return StepIcons.plane;
      case 1: // Fechas
        return StepIcons.calendar;
      case 2: // Viajeros
        return StepIcons.people;
      case 3: // Vuelo
        return StepIcons.plane;
      case 4: // Hospedaje
        return StepIcons.hotel;
      case 5: // Actividades
        return StepIcons.activities;
      case 6: // Presupuesto
        return StepIcons.money;
      case 7: // Completo
        return StepIcons.check;
      default:
        return StepIcons.plane;
    }
  };

  return (
    <div className="w-full py-3 mt-1">
      {/* Contenedor con padding para asegurar que los elementos no se corten */}
      <div className="px-4">
        {/* Indicador discreto del paso actual */}
        <div className="flex justify-between items-center mb-3 px-0.5">
          <span className="text-xs text-gray-500 font-medium">
            Paso {currentStepIndex + 1}/{steps.length}
          </span>
          {currentStepTitle && (
            <span className="text-xs text-blue-600 font-semibold">
              {currentStepTitle}
            </span>
          )}
        </div>

        {/* Barra de progreso principal con icono animado */}
        <div className="relative h-3 sm:h-4 bg-gray-200 rounded-full overflow-visible mb-12">
          {/* Barra de progreso animada */}
          <div
            className={`absolute h-full bg-gradient-to-r ${gradientClass} transition-all duration-700 ease-out rounded-full`}
            style={{ width: `${progress}%` }}
          >
            {/* Efecto de brillo */}
            <div
              className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              style={{ animation: "shimmer 2s infinite" }}
            />

            {/* Icono animado que se mueve con el progreso */}
            {progress > 0 && (
              <div
                className="absolute -top-3 sm:-top-4 transform -translate-x-1/2 transition-all duration-700 ease-out z-10"
                style={{ left: "100%" }}
              >
                {/* Contenedor del icono con animación */}
                <div
                  className={`
                    bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md border border-white/20
                    ${
                      currentStepIndex === 6
                        ? "text-emerald-600"
                        : "text-gray-600"
                    }
                    ${
                      currentStepIndex === 3
                        ? "animate-plane-fly" // Vuelo (paso 3)
                        : currentStepIndex === 2
                        ? "animate-bounce-slow" // Viajeros (paso 2)
                        : currentStepIndex === 7
                        ? "animate-pulse-success" // Completado (paso 7)
                        : currentStepIndex === 0
                        ? "animate-route-pulse" // Ruta dual (paso 0)
                        : "animate-icon-bob"
                    }
                  `}
                >
                  {getStepIcon()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje motivacional */}
        {progress >= 50 && progress < 100 && (
          <p className="text-xs text-center text-gray-500 mt-2 animate-fade-in">
            ¡Vas por buen camino! 🚀
          </p>
        )}
        {progress >= 100 && (
          <p className="text-xs text-center text-green-600 mt-2 animate-fade-in font-medium">
            ¡Excelente! Tu plan está listo 🎉
          </p>
        )}
      </div>

      {/* Estilos para las animaciones */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes plane-fly {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-5deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes icon-bob {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse-success {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        @keyframes route-pulse {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.1) rotate(2deg);
          }
          75% {
            transform: scale(1.1) rotate(-2deg);
          }
        }

        :global(.animate-plane-fly) {
          animation: plane-fly 2s ease-in-out infinite;
        }

        :global(.animate-bounce-slow) {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }

        :global(.animate-icon-bob) {
          animation: icon-bob 2s ease-in-out infinite;
        }

        :global(.animate-pulse-success) {
          animation: pulse-success 1s ease-in-out infinite;
        }

        :global(.animate-route-pulse) {
          animation: route-pulse 2.5s ease-in-out infinite;
        }

        :global(.animate-fade-in) {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// El componente WizardStepItem se ha eliminado ya que solo usamos la barra de progreso

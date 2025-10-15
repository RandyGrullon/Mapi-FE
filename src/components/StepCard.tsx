"use client";

import { WizardStep } from "./WizardProvider";

interface StepCardProps {
  step: WizardStep;
  index: number;
  currentStepIndex: number;
  isVisible: boolean;
  children?: React.ReactNode;
}

export const StepCard = ({
  step,
  index,
  currentStepIndex,
  isVisible,
  children,
}: StepCardProps) => {
  if (!isVisible) return null;

  const isCurrentStep = index === currentStepIndex;
  const isCompletedStep = step.completed && !isCurrentStep;

  return (
    <div
      className={`
        transition-all duration-500 bg-white rounded-2xl p-6 border-2
        ${step.locked ? "border-gray-100 opacity-50" : "border-gray-200"}
        ${
          index > currentStepIndex && !step.locked
            ? "opacity-75"
            : "opacity-100"
        }
        ${
          isCurrentStep
            ? "animate-fade-in border-blue-300 shadow-xl shadow-blue-100/50 ring-2 ring-blue-100"
            : step.completed
            ? "shadow-md hover:shadow-lg"
            : "shadow-sm"
        }
        ${
          step.conditional && index !== currentStepIndex && !step.completed
            ? "hidden"
            : ""
        }
        hover:shadow-lg transition-shadow duration-300
      `}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md
            ${
              step.completed
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                : isCurrentStep && step.id === "step-9"
                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white animate-pulse"
                : isCurrentStep
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white animate-pulse"
                : step.locked
                ? "bg-gray-100 text-gray-400"
                : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
            }
          `}
        >
          {step.completed ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : step.id === "step-9" && isCurrentStep ? (
            <span className="text-xl">🎉</span>
          ) : (
            <span className="font-bold text-base">{index + 1}</span>
          )}
        </div>
        <div className="flex-1">
          <h3
            className={`font-bold text-lg leading-tight ${
              isCurrentStep ? "text-blue-900" : "text-gray-800"
            }`}
          >
            {step.title}
          </h3>
          {isCurrentStep && !step.completed && step.id !== "step-9" && (
            <p className="text-sm text-blue-600 mt-1 font-medium">
              ✨ Estamos esperando tu respuesta
            </p>
          )}
          {isCurrentStep && !step.completed && step.id === "step-9" && (
            <p className="text-sm text-green-600 mt-1 font-medium">
              🎉 Procesando tu información...
            </p>
          )}
        </div>
      </div>

      {/* Mostrar respuesta solo si está completado Y no es el paso actual */}
      {isCompletedStep && step.response && (
        <div className="pl-14">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
            <p className="text-gray-700 leading-relaxed">{step.response}</p>
          </div>
        </div>
      )}

      {/* Contenido del paso (formularios, mensajes, etc.) */}
      {children}
    </div>
  );
};

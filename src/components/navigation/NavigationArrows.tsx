"use client";

import { WizardStep } from "../wizard/WizardProvider";

interface NavigationArrowsProps {
  currentStepIndex: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const NavigationArrows = ({
  currentStepIndex,
  totalSteps,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
}: NavigationArrowsProps) => {
  return (
    <div className="flex justify-between items-center mt-6 px-4">
      <button
        onClick={onPrevious}
        disabled={!canGoBack}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-sm font-medium">Anterior</span>
      </button>

      <div className="text-sm text-gray-500">
        Paso {currentStepIndex + 1} de {totalSteps}
      </div>

      <button
        onClick={onNext}
        disabled={!canGoForward}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="text-sm font-medium">Siguiente</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

/**
 * Progress Badge
 * Muestra el progreso del wizard en un badge visual
 */

"use client";

import { useWizardStore } from "@/stores/wizardStore";

export const ProgressBadge = () => {
  const { activeModules, currentModuleIndex, completed } = useWizardStore();

  // Calcular progreso
  const calculateProgress = (): number => {
    if (completed) return 100;
    if (activeModules.length === 0) return 0;

    let totalSteps = 0;
    let completedSteps = 0;

    activeModules.forEach((module, index) => {
      totalSteps += module.totalSteps;

      if (module.completed || completed) {
        completedSteps += module.totalSteps;
      } else if (index < currentModuleIndex) {
        completedSteps += module.totalSteps;
      } else if (index === currentModuleIndex) {
        completedSteps += module.currentStep;
      }
    });

    const progress = Math.round((completedSteps / totalSteps) * 100);
    return completed ? 100 : Math.min(progress, 99);
  };

  const progress = calculateProgress();

  // No mostrar si no hay módulos
  if (activeModules.length === 0) return null;

  // Color del badge según progreso
  const getBadgeColor = () => {
    if (completed || progress === 100)
      return "bg-green-100 text-green-700 border-green-300";
    if (progress >= 75) return "bg-blue-100 text-blue-700 border-blue-300";
    if (progress >= 50)
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (progress >= 25)
      return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getBadgeColor()} transition-colors`}
    >
      {/* Progress circle mini */}
      <div className="relative w-6 h-6">
        <svg className="w-6 h-6 transform -rotate-90">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="opacity-20"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 10}`}
            strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xs font-bold leading-none">
          {completed ? "Completado" : `${progress}%`}
        </span>
        <span className="text-[10px] opacity-75 leading-none mt-0.5">
          {activeModules.filter((m) => m.completed).length}/
          {activeModules.length} módulos
        </span>
      </div>
    </div>
  );
};

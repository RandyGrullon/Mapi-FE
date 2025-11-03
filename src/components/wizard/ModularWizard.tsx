/**
 * Wizard Container Principal Modular
 * Orquesta todos los módulos dinámicamente
 */

"use client";

import {
  ServiceType,
  ModuleData,
  FlightModuleData,
  HotelModuleData,
  CarModuleData,
  ActivitiesModuleData,
} from "@/types/wizard";
import { useWizardStore } from "@/stores/wizardStore";
import { ServiceSelectionStep } from "./modules/ServiceSelectionStep";
import { FlightModule } from "./modules/FlightModule";
import { HotelModule } from "./modules/HotelModule";
import { CarModule } from "./modules/CarModule";
import { ActivitiesModule } from "./modules/ActivitiesModule";
import { SummaryView } from "./SummaryView";
import { DraftAutoSaver } from "./DraftAutoSaver";

export const ModularWizard = () => {
  const {
    currentModuleIndex,
    activeModules,
    completed,
    updateModuleData,
    completeModule,
    previousModule,
    getCurrentModule,
  } = useWizardStore();

  // Si no hay servicios seleccionados, mostrar selección inicial
  if (currentModuleIndex === -1) {
    return (
      <>
        <DraftAutoSaver />
        <div className="flex-1 flex items-center justify-center p-6">
          <ServiceSelectionStep />
        </div>
      </>
    );
  }

  // Si está completado, mostrar resumen
  if (completed) {
    return (
      <>
        <DraftAutoSaver />
        <div className="flex-1 overflow-y-auto p-6">
          <SummaryView />
        </div>
      </>
    );
  }

  // Obtener módulo actual
  const currentModule = getCurrentModule();

  if (!currentModule) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">No hay módulos activos</p>
      </div>
    );
  }

  // Determinar si es el último módulo
  const isLastModule = currentModuleIndex === activeModules.length - 1;

  // Handlers comunes para todos los módulos
  const handleUpdate = (data: Partial<ModuleData>) => {
    updateModuleData(currentModule.type, data);
  };

  const handleComplete = () => {
    completeModule(currentModule.type);
  };

  const handleBack = () => {
    previousModule();
  };

  // Renderizar el módulo correspondiente
  const renderModule = () => {
    switch (currentModule.type) {
      case ServiceType.FLIGHTS:
        return (
          <FlightModule
            data={currentModule.data as FlightModuleData}
            onUpdate={handleUpdate}
            onComplete={handleComplete}
            onBack={handleBack}
            currentStep={currentModule.currentStep}
            isLastModule={isLastModule}
          />
        );

      case ServiceType.HOTEL:
        return (
          <HotelModule
            data={currentModule.data as HotelModuleData}
            onUpdate={handleUpdate}
            onComplete={handleComplete}
            onBack={handleBack}
            currentStep={currentModule.currentStep}
            isLastModule={isLastModule}
          />
        );

      case ServiceType.CAR:
        return (
          <CarModule
            data={currentModule.data as CarModuleData}
            onUpdate={handleUpdate}
            onComplete={handleComplete}
            onBack={handleBack}
            currentStep={currentModule.currentStep}
            isLastModule={isLastModule}
          />
        );

      case ServiceType.ACTIVITIES:
        return (
          <ActivitiesModule
            data={currentModule.data as ActivitiesModuleData}
            onUpdate={handleUpdate}
            onComplete={handleComplete}
            onBack={handleBack}
            currentStep={currentModule.currentStep}
            isLastModule={isLastModule}
          />
        );

      default:
        return (
          <div className="text-center text-gray-500">
            Módulo no implementado
          </div>
        );
    }
  };

  return (
    <>
      <DraftAutoSaver />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Progress Indicator */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Módulo {currentModuleIndex + 1} de {activeModules.length}
              </span>
              <span className="text-sm text-gray-500">
                Paso {currentModule.currentStep + 1} de{" "}
                {currentModule.totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (currentModuleIndex * 100 +
                      (currentModule.currentStep / currentModule.totalSteps) *
                        100) /
                    activeModules.length
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
          {renderModule()}
        </div>
      </div>
    </>
  );
};

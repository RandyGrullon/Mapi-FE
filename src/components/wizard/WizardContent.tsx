"use client";

import { useSidebar } from "../sidebar/SidebarContext";
import { WelcomeScreen } from "../ui/WelcomeScreen";
import { TripSummary } from "../trips/TripSummary";
import { StepCard } from "./StepCard";
import { StepForm } from "./StepForm";
import { DualInputStep } from "./DualInputStep";
import { DateRangeStep } from "./DateRangeStep";
import { NavigationArrows } from "../navigation/NavigationArrows";
import { SearchButton } from "../forms/SearchButton";
import { useStepNavigation } from "./useStepNavigation";
import { useWizard } from "./WizardProvider";
import { useNavigation } from "../navigation/NavigationContext";

export const WizardContent = () => {
  const { isCollapsed } = useSidebar();
  const {
    steps,
    currentStepIndex,
    currentStep,
    allStepsCompleted,
    isLoading,
    processingStage,
    inputRef,
    contentRef,
    selectedOption,
    setSelectedOption,
    selectedOptions,
    setSelectedOptions,
    userInput,
    setUserInput,
    travelInfo,
    handleSubmit,
    handleDualSubmit,
    handleDateRangeSubmit,
    handleNavigatePrevious,
    handleNavigateNext,
  } = useStepNavigation();

  // Show welcome screen only if there are no steps
  if (steps.length === 0) {
    return <WelcomeScreen />;
  }

  // If there's exactly one step and it's the initial question but not completed, show that step
  // This prevents duplicate rendering of the question

  // Filtrar para mostrar solo el paso actual y el siguiente
  const visibleSteps = steps.filter((step, index) => {
    // Mostrar el paso actual (incluso si está completado, para editar)
    if (index === currentStepIndex) return true;
    // Mostrar el siguiente paso (si existe)
    if (index === currentStepIndex + 1) return true;
    // No mostrar otros pasos
    return false;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={contentRef}
        className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
          isCollapsed ? "md:ml-4" : ""
        } flex flex-col justify-start items-center max-w-4xl mx-auto w-full`}
      >
        <div className="space-y-6 w-full pb-8">
          {/* Mostrar resumen solo cuando TODOS los pasos estén completados */}
          {allStepsCompleted ? (
            <>
              <TripSummary />
              <SearchButton travelInfo={travelInfo} onSearch={() => {}} />
            </>
          ) : (
            <>
              {visibleSteps.map((step, visibleIndex) => {
                // Encontrar el índice real del paso en el array completo
                const index = steps.findIndex((s) => s.id === step.id);
                const isCurrentStep = index === currentStepIndex;

                return (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={index}
                    currentStepIndex={currentStepIndex}
                    isVisible={true}
                  >
                    {/* Mensaje especial para el último paso */}

                    {/* Mostrar dual input para el primer paso (origen y destino) */}
                    {isCurrentStep &&
                      !step.locked &&
                      step.inputType === "dual" && (
                        <DualInputStep
                          onSubmit={handleDualSubmit}
                          isLoading={isLoading}
                          processingStage={processingStage}
                          initialOrigin={travelInfo.origin}
                          initialDestination={travelInfo.destination}
                        />
                      )}

                    {/* Mostrar date range para el segundo paso (fechas) */}
                    {isCurrentStep && !step.locked && step.id === "step-2" && (
                      <DateRangeStep
                        onSubmit={handleDateRangeSubmit}
                        isLoading={isLoading}
                        processingStage={processingStage}
                        initialStartDate={travelInfo.startDate}
                        initialEndDate={travelInfo.endDate}
                      />
                    )}

                    {/* Mostrar formulario si es el paso actual y no es step-8 ni dual ni date range */}
                    {isCurrentStep &&
                      !step.locked &&
                      step.id !== "step-8" &&
                      step.inputType !== "dual" &&
                      step.id !== "step-2" && (
                        <StepForm
                          step={step}
                          userInput={userInput}
                          setUserInput={setUserInput}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                          selectedOptions={selectedOptions}
                          setSelectedOptions={setSelectedOptions}
                          isLoading={isLoading}
                          processingStage={processingStage}
                          onSubmit={handleSubmit}
                          inputRef={inputRef}
                        />
                      )}
                  </StepCard>
                );
              })}

              {/* Flechas de navegación para modificar respuestas */}
              {currentStepIndex > 0 && (
                <NavigationArrows
                  currentStepIndex={currentStepIndex}
                  totalSteps={steps.length}
                  canGoBack={currentStepIndex > 0}
                  canGoForward={
                    currentStepIndex < steps.length - 1 &&
                    steps[currentStepIndex].completed
                  }
                  onPrevious={handleNavigatePrevious}
                  onNext={handleNavigateNext}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

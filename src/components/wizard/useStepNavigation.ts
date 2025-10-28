"use client";

import { useState, useRef, useEffect } from "react";
import { useWizard, TravelInfo } from "./WizardProvider";

export const useStepNavigation = () => {
  const {
    steps,
    currentStepIndex,
    completeCurrentStep,
    completeCurrentStepWithMultipleFields,
    goToStep,
    userInput,
    setUserInput,
    travelInfo,
  } = useWizard();

  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<
    "thinking" | "processing" | "done" | null
  >(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const currentStep = steps[currentStepIndex];
  const allStepsCompleted = steps.every((step) => step.completed);

  // Focus input when step changes and load previous response if editing
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }

    const currentStep = steps[currentStepIndex];
    if (currentStep && currentStep.completed) {
      const fieldMap: Record<string, keyof typeof travelInfo> = {
        "step-1": "origin", // Ahora manejará origin y destination
        "step-2": "startDate",
        "step-3": "travelers",
        "step-4": "flightPreference",
        "step-5": "accommodationType",
        "step-6": "activities",
        "step-7": "budget",
      };

      const fieldKey = fieldMap[currentStep.id];
      if (fieldKey && travelInfo[fieldKey]) {
        const value = travelInfo[fieldKey];
        if (Array.isArray(value)) {
          setSelectedOptions(value);
          setUserInput(value.join(", "));
        } else {
          setUserInput(String(value));
          setSelectedOption(String(value));
        }
      }
    } else {
      setUserInput("");
      setSelectedOption("");
      setSelectedOptions([]);
    }
  }, [currentStepIndex, steps, travelInfo, setUserInput]);

  // Auto-complete el último paso (step-8) cuando llegamos a él
  useEffect(() => {
    if (
      currentStep &&
      currentStep.id === "step-8" &&
      !currentStep.completed &&
      !isLoading
    ) {
      const timer = setTimeout(() => {
        const response = `🎊 ¡Perfecto! Hemos recopilado toda la información necesaria para planificar tu viaje ideal de ${travelInfo.origin} a ${travelInfo.destination}.`;
        completeCurrentStep(response);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isLoading, travelInfo, completeCurrentStep]);

  // Función especial para manejar el dual input (origen y destino)
  const handleDualSubmit = (origin: string, destination: string) => {
    setIsLoading(true);
    setProcessingStage("processing");

    setTimeout(() => {
      const response = `¡Perfecto! Viajarás de ${origin} a ${destination}. ✈️🌍`;

      // Completar el paso con ambos campos usando la función multi-campo
      completeCurrentStepWithMultipleFields(response, [
        { field: "origin", value: origin },
        { field: "destination", value: destination },
      ]);

      setIsLoading(false);
      setProcessingStage("done");
      setProcessingStage(null);
    }, 800);
  };

  // Función especial para manejar el rango de fechas
  const handleDateRangeSubmit = (startDate: string, endDate: string) => {
    setIsLoading(true);
    setProcessingStage("processing");

    setTimeout(() => {
      const response = `¡Excelente! Tu viaje será del ${new Date(startDate).toLocaleDateString('es-ES')} al ${new Date(endDate).toLocaleDateString('es-ES')}. 📅✈️`;

      // Completar el paso con ambos campos usando la función multi-campo
      completeCurrentStepWithMultipleFields(response, [
        { field: "startDate", value: startDate },
        { field: "endDate", value: endDate },
      ]);

      setIsLoading(false);
      setProcessingStage("done");
      setProcessingStage(null);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setProcessingStage("processing");

    setTimeout(() => {
      let fieldUpdate: { field: string; value: any } = {
        field: "",
        value: userInput,
      };
      let response = "";

      switch (currentStep.title) {
        case "¿Cuáles son tus fechas de viaje?":
          fieldUpdate = { field: "travelDates", value: userInput };
          response = `Perfecto, he anotado tus fechas: ${userInput}. 📅`;
          break;

        case "¿Cuántas personas viajarán en total?":
          const numTravelers = parseInt(userInput) || 1;
          fieldUpdate = { field: "travelers", value: numTravelers };
          response = `Entendido, ${userInput} personas. 👥`;
          break;

        case "¿Qué tipo de vuelo prefieres?":
          fieldUpdate = { field: "flightPreference", value: userInput };
          response = `Perfecto, he anotado tu preferencia de vuelo. ✈️`;
          break;

        case "¿Qué tipo de hospedaje prefieres?":
          fieldUpdate = { field: "accommodationType", value: userInput };
          response = `Excelente elección de hospedaje. 🏨`;
          break;

        case "¿Qué tipo de actividades te interesan más?":
          fieldUpdate = {
            field: "activities",
            value: userInput.split(",").map((item) => item.trim()),
          };
          response = `¡Perfecto! Ya casi terminamos. 🎯`;
          break;

        case "¿Cuál es tu presupuesto aproximado para este viaje?":
          fieldUpdate = { field: "budget", value: userInput };
          response = `¡Excelente! Ya tengo toda la información necesaria. 🎉`;
          break;

        default:
          response = `Gracias por la información: "${userInput}".`;
      }

      completeCurrentStep(response, fieldUpdate);

      setUserInput("");
      setIsLoading(false);
      setProcessingStage("done");
      setProcessingStage(null);
    }, 800);
  };

  const handleNavigatePrevious = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
      setUserInput("");
      setSelectedOption("");
      setSelectedOptions([]);
    }
  };

  const handleNavigateNext = () => {
    if (
      currentStepIndex < steps.length - 1 &&
      steps[currentStepIndex].completed
    ) {
      goToStep(currentStepIndex + 1);
      setUserInput("");
      setSelectedOption("");
      setSelectedOptions([]);
    }
  };

  return {
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
  };
};

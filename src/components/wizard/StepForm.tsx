"use client";

import { WizardStep } from "./WizardProvider";
import { ProgressBar } from "../ui/ProgressIndicator";
import { SelectOptions } from "../forms/SelectOptions";
import { MultiSelectOptions } from "../forms/MultiSelectOptions";

interface StepFormProps {
  step: WizardStep;
  userInput: string;
  setUserInput: (value: string) => void;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  selectedOptions: string[];
  setSelectedOptions: (values: string[]) => void;
  isLoading: boolean;
  processingStage: "thinking" | "processing" | "done" | null;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const StepForm = ({
  step,
  userInput,
  setUserInput,
  selectedOption,
  setSelectedOption,
  selectedOptions,
  setSelectedOptions,
  isLoading,
  processingStage,
  onSubmit,
  inputRef,
}: StepFormProps) => {
  const handleSelectOption = (option: string) => {
    setUserInput(option);
    setSelectedOption(option);
  };

  const handleToggleMultiSelect = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    setSelectedOptions(newSelected);
    setUserInput(newSelected.join(", "));
  };

  const handleRemoveMultiSelect = (option: string) => {
    const newSelected = selectedOptions.filter((o) => o !== option);
    setSelectedOptions(newSelected);
    setUserInput(newSelected.join(", "));
  };

  return (
    <div className="pl-14 space-y-4">
      {/* Indicador de modo edición */}
      {step.completed && (
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200 mb-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="font-medium">
            Modo edición - Modifica tu respuesta anterior
          </span>
        </div>
      )}

      {/* Mostrar ejemplo si existe */}
      {step.example && (
        <p className="text-sm text-gray-500 italic">{step.example}</p>
      )}

      {/* Mostrar opciones según el tipo de input */}
      {step.inputType === "select" && step.options && (
        <SelectOptions
          options={step.options}
          selectedValue={userInput}
          onSelect={handleSelectOption}
          isLoading={isLoading}
        />
      )}

      {step.inputType === "multiselect" && step.options && (
        <MultiSelectOptions
          options={step.options}
          selectedValues={selectedOptions}
          onToggle={handleToggleMultiSelect}
          onRemove={handleRemoveMultiSelect}
          isLoading={isLoading}
        />
      )}

      {/* Input manual */}
      <form onSubmit={onSubmit}>
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow hover:border-gray-300 transition-all duration-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/5">
          <input
            ref={inputRef}
            type={
              step.inputType === "number"
                ? "number"
                : step.inputType === "date"
                ? "date"
                : "text"
            }
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              step.inputType === "select"
                ? "O escribe tu propia respuesta..."
                : step.inputType === "multiselect"
                ? "O escribe opciones separadas por coma..."
                : "Escribe tu respuesta..."
            }
            className="flex-1 px-4 py-3 bg-transparent outline-none text-black placeholder-gray-400 text-sm md:text-base"
            disabled={isLoading}
          />
          <div className="pr-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={!userInput.trim() || isLoading}
              className="p-2 rounded-lg bg-black text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <ProgressBar
          isActive={processingStage === "processing"}
          duration={800}
        />
      </form>
    </div>
  );
};

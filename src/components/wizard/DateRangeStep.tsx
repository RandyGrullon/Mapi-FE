"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "../ui/ProgressIndicator";
import { DatePicker } from "../ui/DatePicker";

interface DateRangeStepProps {
  onSubmit: (startDate: string, endDate: string) => void;
  isLoading: boolean;
  processingStage: "thinking" | "processing" | "done" | null;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const DateRangeStep = ({
  onSubmit,
  isLoading,
  processingStage,
  initialStartDate = "",
  initialEndDate = "",
}: DateRangeStepProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialStartDate ? new Date(initialStartDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialEndDate ? new Date(initialEndDate) : undefined
  );

  // Actualizar los estados cuando cambien los valores iniciales
  useEffect(() => {
    setStartDate(initialStartDate ? new Date(initialStartDate) : undefined);
    setEndDate(initialEndDate ? new Date(initialEndDate) : undefined);
  }, [initialStartDate, initialEndDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && !isLoading) {
      onSubmit(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
    }
  };

  const canSubmit = startDate && endDate && !isLoading;

  return (
    <div className="pl-14 space-y-4">
      <p className="text-sm text-gray-500 italic">
        Selecciona las fechas de tu viaje
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Card Fecha de Inicio */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800">Fecha de Salida</h4>
            </div>
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
              placeholder="Selecciona fecha de salida"
              className="w-full"
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </div>

          {/* Card Fecha de Regreso */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-200 text-green-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800">Fecha de Regreso</h4>
            </div>
            <DatePicker
              date={endDate}
              onDateChange={setEndDate}
              placeholder="Selecciona fecha de regreso"
              className="w-full"
              disabled={(date) =>
                startDate
                  ? date < startDate
                  : date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95 flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Continuar</span>
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
              </>
            )}
          </button>
        </div>

        <ProgressBar
          isActive={processingStage === "processing"}
          duration={800}
        />
      </form>
    </div>
  );
};

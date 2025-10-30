"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "../ui/ProgressIndicator";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: initialStartDate ? new Date(initialStartDate) : undefined,
    to: initialEndDate ? new Date(initialEndDate) : undefined,
  });

  // Actualizar los estados cuando cambien los valores iniciales
  useEffect(() => {
    setDateRange({
      from: initialStartDate ? new Date(initialStartDate) : undefined,
      to: initialEndDate ? new Date(initialEndDate) : undefined,
    });
  }, [initialStartDate, initialEndDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateRange.from && dateRange.to && !isLoading) {
      onSubmit(
        dateRange.from.toISOString().split("T")[0],
        dateRange.to.toISOString().split("T")[0]
      );
    }
  };

  const canSubmit = dateRange.from && dateRange.to && !isLoading;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 italic">
        Selecciona las fechas de tu viaje
      </p>

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800">
              Selecciona el rango de fechas
            </h4>
          </div>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) =>
              setDateRange(range || { from: undefined, to: undefined })
            }
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            locale={es}
            numberOfMonths={2}
          />
          {dateRange.from && dateRange.to && (
            <p className="mt-2 text-sm text-gray-600">
              Desde {format(dateRange.from, "PPP", { locale: es })} hasta{" "}
              {format(dateRange.to, "PPP", { locale: es })}
            </p>
          )}
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

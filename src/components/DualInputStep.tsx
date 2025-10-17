"use client";

import { useState, useRef, useEffect } from "react";
import { ProgressBar } from "./ProgressIndicator";

interface DualInputStepProps {
  onSubmit: (origin: string, destination: string) => void;
  isLoading: boolean;
  processingStage: "thinking" | "processing" | "done" | null;
  initialOrigin?: string;
  initialDestination?: string;
}

export const DualInputStep = ({
  onSubmit,
  isLoading,
  processingStage,
  initialOrigin = "",
  initialDestination = "",
}: DualInputStepProps) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const originRef = useRef<HTMLInputElement | null>(null);

  // Actualizar los estados cuando cambien los valores iniciales
  useEffect(() => {
    setOrigin(initialOrigin);
    setDestination(initialDestination);
  }, [initialOrigin, initialDestination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim() && destination.trim() && !isLoading) {
      onSubmit(origin, destination);
    }
  };

  const canSubmit = origin.trim() && destination.trim() && !isLoading;

  return (
    <div className="pl-14 space-y-4">
      <p className="text-sm text-gray-500 italic">
        Cuéntanos desde dónde partes y hacia dónde quieres viajar
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Card Origen */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800">Ciudad de Origen</h4>
            </div>
            <input
              ref={originRef}
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Ej: Santo Domingo, Nueva York..."
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg outline-none text-black placeholder-gray-400 text-sm focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Card Destino */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800">Destino Deseado</h4>
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ej: París, Tokio, Cancún..."
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg outline-none text-black placeholder-gray-400 text-sm focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-black/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando...</span>
              </>
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

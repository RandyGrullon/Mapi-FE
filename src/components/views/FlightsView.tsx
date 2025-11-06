"use client";

import { Flight } from "@/types/travel";

interface FlightsViewProps {
  flights: Flight[];
  selected: string | null;
  onToggle: (id: string) => void;
}

export const FlightsView = ({
  flights,
  selected,
  onToggle,
}: FlightsViewProps) => {
  // Mostrar mensaje si no hay vuelos
  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No hay vuelos disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            No encontramos vuelos para tu búsqueda. Por favor, verifica tus
            fechas y destinos o intenta más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            ✈️ Selecciona 1 vuelo
          </span>{" "}
          para tu paquete personalizado
        </p>
      </div>
      {flights.map((flight) => {
        const isSelected = selected === flight.id;

        return (
          <div
            key={flight.id}
            onClick={() => onToggle(flight.id)}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white ${
              isSelected
                ? "border-gray-900 shadow-md ring-2 ring-gray-100"
                : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {flight.airline}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {flight.flightNumber} • {flight.class}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {flight.departure}
                    </p>
                    <p className="text-xs text-gray-500">Salida</p>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 relative min-w-[100px]">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                      <p className="text-xs text-gray-600">{flight.duration}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {flight.arrival}
                    </p>
                    <p className="text-xs text-gray-500">Llegada</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  {flight.stops === 0
                    ? "✓ Vuelo directo"
                    : `${flight.stops} escala(s)`}
                </p>
              </div>

              <div className="text-right ml-6">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${flight.price}
                </p>
                {isSelected && (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Seleccionado
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

"use client";

import { Flight } from "@/types/travel";

interface FlightsViewProps {
  flights: Flight[];
  selected: string | null;
  onToggle: (id: string) => void;
  flightType?: "one-way" | "round-trip" | "multi-city";
  flightSegments?: Array<{ from: string; to: string; date?: string }>;
  selectedFlights?: string[]; // Array de IDs seleccionados (uno por segmento)
  onSelectForSegment?: (segmentIndex: number, flightId: string) => void;
}

export const FlightsView = ({
  flights,
  selected,
  onToggle,
  flightType = "round-trip",
  flightSegments = [],
  selectedFlights = [],
  onSelectForSegment,
}: FlightsViewProps) => {
  // Agrupar vuelos por segmento si tienen segmentIndex
  const flightsBySegment: { [key: number]: Flight[] } = {};

  flights.forEach((flight: any) => {
    const segmentIndex = flight.segmentIndex ?? 0;
    if (!flightsBySegment[segmentIndex]) {
      flightsBySegment[segmentIndex] = [];
    }
    flightsBySegment[segmentIndex].push(flight);
  });

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

  // Determinar cuántos segmentos necesitamos según el tipo de vuelo
  const numberOfSegments =
    flightType === "one-way"
      ? 1
      : flightType === "round-trip"
      ? 2
      : flightSegments.length || 1;

  // Si es solo ida, usar la lógica antigua (un solo vuelo)
  if (flightType === "one-way") {
    return (
      <div className="space-y-4">
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">
              ✈️ Selecciona 1 vuelo de ida
            </span>{" "}
            para tu paquete personalizado
          </p>
        </div>
        {flights.map((flight) => {
          const isSelected = selected === flight.id;

          return (
            <FlightCard
              key={flight.id}
              flight={flight}
              isSelected={isSelected}
              onToggle={() => onToggle(flight.id)}
            />
          );
        })}
      </div>
    );
  }

  // Para ida y vuelta o multi-ciudad, mostrar secciones por segmento
  return (
    <div className="space-y-8">
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            ✈️ Selecciona {numberOfSegments} vuelo
            {numberOfSegments > 1 ? "s" : ""}
          </span>{" "}
          {flightType === "round-trip" && "(ida y vuelta)"}
          {flightType === "multi-city" && "(varias ciudades)"}
        </p>
      </div>

      {Array.from({ length: numberOfSegments }).map((_, segmentIndex) => {
        const segment = flightSegments[segmentIndex];
        const segmentLabel =
          flightType === "round-trip"
            ? segmentIndex === 0
              ? "Vuelo de Ida"
              : "Vuelo de Regreso"
            : `Vuelo ${segmentIndex + 1}`;

        const segmentRoute = segment ? `${segment.from} → ${segment.to}` : "";

        // Obtener vuelos específicos para este segmento
        const segmentFlights = flightsBySegment[segmentIndex] || flights;
        console.log("====================================");
        console.log(segmentFlights);
        console.log("====================================");

        return (
          <div key={`segment-${segmentIndex}`} className="space-y-4">
            {/* Header del segmento */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                {segmentIndex + 1}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {segmentLabel}
                </h3>
                {segmentRoute && (
                  <p className="text-sm text-gray-600">{segmentRoute}</p>
                )}
              </div>
            </div>

            {/* Opciones de vuelo para este segmento */}
            <div className="space-y-4 pl-12">
              {segmentFlights.length > 0 ? (
                segmentFlights.map((flight) => {
                  const isSelected = onSelectForSegment
                    ? selectedFlights[segmentIndex] === flight.id
                    : selected === flight.id;

                  return (
                    <FlightCard
                      key={`${segmentIndex}-${flight.id}`}
                      flight={flight}
                      isSelected={isSelected}
                      onToggle={() => {
                        if (onSelectForSegment) {
                          onSelectForSegment(segmentIndex, flight.id);
                        } else {
                          onToggle(flight.id);
                        }
                      }}
                    />
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay vuelos disponibles para este segmento</p>
                  <p className="text-sm">Ruta: {segmentRoute}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Componente auxiliar para la tarjeta de vuelo
interface FlightCardProps {
  flight: Flight;
  isSelected: boolean;
  onToggle: () => void;
}

const FlightCard = ({ flight, isSelected, onToggle }: FlightCardProps) => {
  // Usar origin/destination si están disponibles, si no usar departure/arrival
  const originCity = flight.origin || flight.departure;
  const destinationCity = flight.destination || flight.arrival;

  return (
    <div
      onClick={onToggle}
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

          {/* Ruta: Origen → Destino */}
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Origen</p>
                <p className="text-base font-bold text-gray-900">
                  {originCity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-indigo-300 min-w-[40px]"></div>
                <svg
                  className="w-5 h-5 text-indigo-600"
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
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-300 to-blue-300 min-w-[40px]"></div>
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-500 mb-1">Destino</p>
                <p className="text-base font-bold text-gray-900">
                  {destinationCity}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-xl font-bold text-gray-900">
                {flight.departureTime || "--:--"}
              </p>
              <p className="text-xs text-gray-500">Salida</p>
              {flight.departureDate && (
                <p className="text-xs text-gray-400 mt-1">
                  {flight.departureDate}
                </p>
              )}
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300 relative min-w-[100px]">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                <p className="text-xs text-gray-600">{flight.duration}</p>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {flight.arrivalTime || "--:--"}
              </p>
              <p className="text-xs text-gray-500">Llegada</p>
              {flight.arrivalDate && (
                <p className="text-xs text-gray-400 mt-1">
                  {flight.arrivalDate}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            {flight.stops === 0
              ? "✓ Vuelo directo"
              : `${flight.stops} escala(s)`}
          </p>
        </div>
      </div>

      {/* Sección inferior: Precio, botón y estado */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">${flight.price}</p>
          <p className="text-xs text-gray-500 mt-1">Precio por persona</p>
        </div>

        <div className="flex items-center gap-3">
          {flight.bookingUrl && (
            <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Ver vuelo aquí
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}

          {isSelected && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
};

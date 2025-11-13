"use client";

import { FlightModuleData, FlightType } from "@/types/wizard";

interface FlightSummaryProps {
  data: FlightModuleData;
}

export const FlightSummary = ({ data }: FlightSummaryProps) => {
  const getFlightTypeLabel = (type: FlightType | null) => {
    switch (type) {
      case FlightType.ONE_WAY:
        return "Solo ida";
      case FlightType.ROUND_TRIP:
        return "Ida y vuelta";
      case FlightType.MULTI_CITY:
        return "Varias ciudades";
      default:
        return "No especificado";
    }
  };

  const getCabinClassLabel = (cabinClass: string) => {
    const labels: { [key: string]: string } = {
      economy: "Económica",
      "premium-economy": "Económica Premium",
      business: "Business",
      first: "Primera Clase",
    };
    return labels[cabinClass] || cabinClass;
  };

  return (
    <div className="space-y-5">
      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Tipo de vuelo
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {getFlightTypeLabel(data.flightType)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">Viajeros</div>
          <div className="text-sm font-semibold text-gray-900">
            {data.travelers} persona{data.travelers > 1 ? "s" : ""}
          </div>
        </div>
        {data.cabinClass && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">Clase</div>
            <div className="text-sm font-semibold text-gray-900">
              {getCabinClassLabel(data.cabinClass)}
            </div>
          </div>
        )}
      </div>

      {/* Routes */}
      {data.segments && data.segments.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 font-medium mb-3">
            Itinerario
          </div>
          <div className="space-y-3">
            {data.segments.map((segment, idx) => (
              <div
                key={segment.id}
                className="flex flex-col bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Origen</div>
                      <div className="text-base font-bold text-gray-900">
                        {segment.from}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
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
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Destino</div>
                      <div className="text-base font-bold text-gray-900">
                        {segment.to}
                      </div>
                    </div>
                  </div>
                </div>
                {segment.date && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">Fecha</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(segment.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

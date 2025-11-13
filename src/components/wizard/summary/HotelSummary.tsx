"use client";

import { HotelModuleData } from "@/types/wizard";

interface HotelSummaryProps {
  data: HotelModuleData;
}

export const HotelSummary = ({ data }: HotelSummaryProps) => {
  const getHotelTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      economy: "Económico",
      standard: "Estándar",
      comfort: "Confort",
      luxury: "Lujo",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-5">
      {/* Destination */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-xs text-gray-500 font-medium mb-2">Destino</div>
        <div className="text-base font-bold text-gray-900">
          {data.destination}
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">Check-in</div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.checkIn + "T00:00:00").toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Check-out
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.checkOut + "T00:00:00").toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Habitaciones
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {data.rooms} hab.
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Huéspedes
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {data.guests} persona{data.guests > 1 ? "s" : ""}
          </div>
        </div>
        {data.hotelType && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Categoría
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {getHotelTypeLabel(data.hotelType)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

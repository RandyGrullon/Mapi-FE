"use client";

import { CarModuleData } from "@/types/wizard";

interface CarSummaryProps {
  data: CarModuleData;
}

export const CarSummary = ({ data }: CarSummaryProps) => {
  const getCarTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      economy: "Económico",
      compact: "Compacto",
      midsize: "Mediano",
      suv: "SUV",
      luxury: "Lujo",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-5">
      {/* Locations */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-2">Recogida</div>
          <div className="text-sm font-semibold text-gray-900">
            {data.pickupLocation}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-2">
            Devolución
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {data.dropoffLocation}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Fecha recogida
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.pickupDate + "T00:00:00").toLocaleDateString(
              "en-US",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Fecha devolución
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.dropoffDate + "T00:00:00").toLocaleDateString(
              "en-US",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
          </div>
        </div>
      </div>

      {/* Car Type */}
      {data.carType && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Tipo de vehículo
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {getCarTypeLabel(data.carType)}
          </div>
        </div>
      )}
    </div>
  );
};

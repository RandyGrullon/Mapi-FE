"use client";

import { CarRental } from "@/types/travel";

interface CarsViewProps {
  cars: CarRental[];
  selected: string | null;
  onToggle: (id: string) => void;
  days: number;
}

export const CarsView = ({ cars, selected, onToggle, days }: CarsViewProps) => {
  // Mostrar mensaje si no hay autos
  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-indigo-50 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No hay autos de alquiler disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            No encontramos autos para alquilar en tu destino. Este servicio es
            opcional para tu viaje.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            🚗 Selecciona 1 auto (opcional)
          </span>{" "}
          para tu viaje de {days} día(s)
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => {
          const isSelected = selected === car.id;

          return (
            <div
              key={car.id}
              onClick={() => onToggle(car.id)}
              className={`rounded-xl border-2 transition-all cursor-pointer bg-white overflow-hidden ${
                isSelected
                  ? "border-indigo-600 shadow-md ring-2 ring-indigo-100"
                  : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
                <span className="text-6xl opacity-30">🚗</span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">
                      {car.carModel}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{car.company}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-gray-600">{car.rating}/5</span>
                      <span className="text-gray-400">
                        • {car.seats} asientos
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
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
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Características destacadas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded capitalize">
                      {car.transmission === "automatic"
                        ? "Automático"
                        : "Manual"}
                    </span>
                    {car.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Por {days} días</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${car.totalPrice}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${car.pricePerDay}/día
                      </p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "Seleccionado" : "Seleccionar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

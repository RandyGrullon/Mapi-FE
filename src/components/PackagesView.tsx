"use client";

import { TravelPackage } from "./travel-data";

interface PackagesViewProps {
  packages: TravelPackage[];
  onSelect: (pkg: TravelPackage) => void;
}

export const PackagesView = ({ packages, onSelect }: PackagesViewProps) => {
  return (
    <div>
      {/* Paquete recomendado destacado */}
      {packages
        .filter((p) => p.recommended)
        .map((pkg) => (
          <div
            key={pkg.id}
            className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg border border-gray-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-bold uppercase tracking-wide">
                ✨ Recomendado
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">{pkg.name}</h2>
                <p className="text-gray-300 mb-6 text-sm">{pkg.description}</p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">✈️</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm">
                        {pkg.flight.airline} {pkg.flight.flightNumber}
                      </p>
                      <p className="text-sm text-gray-300">
                        {pkg.flight.departure} → {pkg.flight.arrival}
                      </p>
                      <p className="text-xs text-gray-400">
                        {pkg.flight.duration} •{" "}
                        {pkg.flight.stops === 0
                          ? "Directo"
                          : `${pkg.flight.stops} escala`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🏨</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm">
                        {pkg.hotel.name}
                      </p>
                      <p className="text-sm text-gray-300">
                        {"⭐".repeat(pkg.hotel.stars)} • {pkg.hotel.rating}/5
                      </p>
                      <p className="text-xs text-gray-400">
                        {pkg.hotel.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm">
                        {pkg.activities.length} Actividades incluidas
                      </p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {pkg.activities.map((act) => (
                          <li key={act.id} className="text-xs">
                            • {act.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                    Precio total del paquete
                  </p>
                  <p className="text-4xl font-bold mb-2">
                    ${pkg.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-gray-300 text-sm font-medium mb-6">
                    ✓ Ahorra ${pkg.savings}
                  </p>

                  <button
                    onClick={() => onSelect(pkg)}
                    className="w-full py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
                  >
                    Reservar Ahora
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cancelación gratuita hasta 48h antes
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pago en cuotas sin interés
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Soporte 24/7 durante el viaje
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Otros paquetes */}
      <div className="grid md:grid-cols-2 gap-6">
        {packages
          .filter((p) => !p.recommended)
          .map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-md transition-all overflow-hidden group cursor-pointer"
              onClick={() => onSelect(pkg)}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-sm text-gray-600 mb-5">{pkg.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">✈️</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {pkg.flight.airline}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {pkg.flight.departure} → {pkg.flight.arrival}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">🏨</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {pkg.hotel.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {"⭐".repeat(pkg.hotel.stars)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {pkg.activities.length} Actividades incluidas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    {pkg.savings > 0 && (
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Ahorra ${pkg.savings}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-gray-900">
                      ${pkg.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <button className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm hover:shadow">
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

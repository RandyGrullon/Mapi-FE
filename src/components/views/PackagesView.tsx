"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { CardButton } from "../buttons";
import { ActionButton } from "../buttons";
import { TravelPackage } from "@/types/travel";

interface PackagesViewProps {
  packages: TravelPackage[];
  onSelect?: (pkg: TravelPackage) => void;
}

export const PackagesView = ({ packages, onSelect }: PackagesViewProps) => {
  const router = useRouter();

  const handleViewDetails = (pkg: TravelPackage) => {
    // Guardar el paquete en localStorage para acceder desde la página de detalles
    localStorage.setItem(`package-${pkg.id}`, JSON.stringify(pkg));
    // Redirigir a la página de detalles
    router.push(`/packages/${pkg.id}`);
  };

  const handleSelect = (pkg: TravelPackage) => {
    if (onSelect) {
      onSelect(pkg);
    }
  };

  // Mostrar mensaje si no hay paquetes
  if (packages.length === 0) {
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No hay paquetes disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            No encontramos paquetes de viaje para tu búsqueda. Intenta crear un
            paquete personalizado seleccionando vuelos, hoteles y actividades.
          </p>
        </div>
      </div>
    );
  }

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

                  {pkg.carRental && (
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🚗</span>
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-sm">
                          {pkg.carRental.carModel}
                        </p>
                        <p className="text-sm text-gray-300">
                          {pkg.carRental.company} • ⭐ {pkg.carRental.rating}/5
                        </p>
                        <p className="text-xs text-gray-400">
                          {pkg.carRental.totalDays} días •{" "}
                          {pkg.carRental.transmission === "automatic"
                            ? "Automático"
                            : "Manual"}
                        </p>
                      </div>
                    </div>
                  )}

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

                  <div className="space-y-2">
                    <button
                      onClick={() => handleViewDetails(pkg)}
                      className="w-full py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all text-sm"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleSelect(pkg)}
                      className="w-full py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
                    >
                      Reservar Ahora
                    </button>
                  </div>
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
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-md transition-all overflow-hidden group"
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

                  {pkg.carRental && (
                    <div className="flex items-center gap-3 text-sm p-3 bg-indigo-50 rounded-lg">
                      <span className="text-lg">🚗</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {pkg.carRental.carModel}
                        </p>
                        <p className="text-xs text-gray-500">
                          {pkg.carRental.company} • {pkg.carRental.totalDays}{" "}
                          días
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {pkg.activities.length} Actividades incluidas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
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
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(pkg)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleSelect(pkg)}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm hover:shadow"
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

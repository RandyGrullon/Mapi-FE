"use client";

import { CompletedTrip } from "./CompletedTripsManager";

interface BudgetTabProps {
  trip: CompletedTrip;
}

export const BudgetTab = ({ trip }: BudgetTabProps) => {
  const budget = trip.budget;
  const items = [
    { label: "Vuelos", amount: budget.flights, icon: "✈️" },
    { label: "Hotel", amount: budget.hotel, icon: "🏨" },
    { label: "Actividades", amount: budget.activities, icon: "🎯" },
    { label: "Extras", amount: budget.extras, icon: "🎁" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Total Budget Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Presupuesto Total
          </h3>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            ${budget.total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            ${(budget.total / trip.travelers).toFixed(2)} por persona
          </p>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Desglose de Gastos
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {items.map((item, index) => {
            const percentage = ((item.amount / budget.total) * 100).toFixed(1);
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">🏨</span>
            <span className="font-medium text-gray-900">Costo por Noche</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(budget.total / trip.hotel.nights).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Basado en {trip.hotel.nights} noches
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">📅</span>
            <span className="font-medium text-gray-900">Costo por Día</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(budget.total / (trip.hotel.nights + 1)).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Promedio diario del viaje
          </p>
        </div>
      </div>

      {/* Budget Insights */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          Información del Presupuesto
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Categoría principal</p>
            <p className="font-medium text-gray-900">
              {
                items.reduce((max, item) =>
                  item.amount > max.amount ? item : max
                ).label
              }
            </p>
          </div>
          <div>
            <p className="text-gray-600">Viajeros</p>
            <p className="font-medium text-gray-900">{trip.travelers}</p>
          </div>
          <div>
            <p className="text-gray-600">Duración</p>
            <p className="font-medium text-gray-900">
              {trip.hotel.nights + 1} días
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

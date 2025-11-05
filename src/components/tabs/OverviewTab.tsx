"use client";

import { CompletedTrip } from "../trips/CompletedTripsManager";
import { CardButton } from "../buttons";

interface OverviewTabProps {
  trip: CompletedTrip;
  openGoogleMaps: (location: string) => void;
  setActiveTab: (
    tab: "overview" | "flights" | "hotel" | "car" | "activities" | "budget"
  ) => void;
}

export const OverviewTab = ({
  trip,
  openGoogleMaps,
  setActiveTab,
}: OverviewTabProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Trip Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardButton
          onClick={() => setActiveTab("flights")}
          icon="✈️"
          title="Vuelos"
          subtitle="Información de vuelos"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Vuelo de ida</span>
            <span className="font-medium text-gray-900">
              {trip.flights.outbound.airline}{" "}
              {trip.flights.outbound.flightNumber}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Horario</span>
            <span className="text-sm text-gray-900">
              {trip.flights.outbound.departureTime} -{" "}
              {trip.flights.outbound.arrivalTime}
            </span>
          </div>
        </CardButton>

        <CardButton
          onClick={() => setActiveTab("hotel")}
          icon="🏨"
          title="Hotel"
          subtitle="Alojamiento"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Hotel</span>
            <span className="font-medium text-gray-900">
              {trip.hotel.hotelName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Duración</span>
            <span className="text-sm text-gray-900">
              {trip.hotel.nights} noches
            </span>
          </div>
        </CardButton>

        {trip.carRental && (
          <CardButton
            onClick={() => setActiveTab("car")}
            icon="🚗"
            title="Renta de Auto"
            subtitle="Vehículo reservado"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vehículo</span>
              <span className="font-medium text-gray-900">
                {trip.carRental.carType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Duración</span>
              <span className="text-sm text-gray-900">
                {trip.carRental.totalDays} días
              </span>
            </div>
          </CardButton>
        )}

        <CardButton
          onClick={() => setActiveTab("activities")}
          icon="🎯"
          title="Actividades"
          subtitle="Experiencias planificadas"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total actividades</span>
            <span className="font-medium text-gray-900">
              {trip.activities.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Categorías</span>
            <span className="text-sm text-gray-900">
              {trip.activities.length > 0
                ? trip.activities
                    .slice(0, 2)
                    .map((a) => a.category)
                    .join(", ") + (trip.activities.length > 2 ? "..." : "")
                : "Ninguna"}
            </span>
          </div>
        </CardButton>

        <CardButton
          onClick={() => setActiveTab("budget")}
          icon="💰"
          title="Presupuesto"
          subtitle="Resumen de costos"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total estimado</span>
            <span className="font-medium text-gray-900">
              ${trip.budget.total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Por persona</span>
            <span className="text-sm text-gray-900">
              ${(trip.budget.total / trip.travelers).toFixed(2)}
            </span>
          </div>
        </CardButton>
      </div>

      {/* Quick Budget Summary */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Resumen de Costos
          </h3>
        </div>

        <div className="p-6">
          <div className={`grid grid-cols-2 ${trip.carRental ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-6`}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">✈️</span>
                <span className="text-sm font-medium text-gray-900">
                  Vuelos
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                ${trip.budget.flights.toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🏨</span>
                <span className="text-sm font-medium text-gray-900">Hotel</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                ${trip.budget.hotel.toLocaleString()}
              </p>
            </div>

            {trip.carRental && trip.budget.carRental > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">🚗</span>
                  <span className="text-sm font-medium text-gray-900">
                    Auto
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  ${trip.budget.carRental.toLocaleString()}
                </p>
              </div>
            )}

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🎯</span>
                <span className="text-sm font-medium text-gray-900">
                  Actividades
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                ${trip.budget.activities.toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">💰</span>
                <span className="text-sm font-medium text-gray-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${trip.budget.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { CompletedTrip } from "./CompletedTripsManager";

interface TripDetailViewProps {
  trip: CompletedTrip;
  onClose: () => void;
}

export const TripDetailView = ({ trip, onClose }: TripDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "flights" | "hotel" | "activities" | "itinerary" | "budget"
  >("overview");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: CompletedTrip["status"]) => {
    const badges = {
      progress: { text: "📋 En Progreso", color: "bg-blue-100 text-blue-800" },
      ongoing: { text: "En curso", color: "bg-green-100 text-green-800" },
      completed: { text: "Completado", color: "bg-gray-100 text-gray-800" },
      cancelled: { text: "Cancelado", color: "bg-red-100 text-red-800" },
    };
    const badge = badges[status] || badges.progress; // Default to progress if status is invalid
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        {badge.text}
      </span>
    );
  };

  const tabs = [
    { id: "overview", label: "Resumen", icon: "📋" },
    { id: "flights", label: "Vuelos", icon: "✈️" },
    { id: "hotel", label: "Hotel", icon: "🏨" },
    { id: "activities", label: "Actividades", icon: "🎯" },
    { id: "itinerary", label: "Itinerario", icon: "📅" },
    { id: "budget", label: "Presupuesto", icon: "💰" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="pr-12">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{trip.name}</h2>
              {getStatusBadge(trip.status)}
            </div>
            <p className="text-blue-100 text-sm">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              {trip.travelers} {trip.travelers === 1 ? "viajero" : "viajeros"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && <OverviewTab trip={trip} />}
          {activeTab === "flights" && <FlightsTab trip={trip} />}
          {activeTab === "hotel" && <HotelTab trip={trip} />}
          {activeTab === "activities" && <ActivitiesTab trip={trip} />}
          {activeTab === "itinerary" && <ItineraryTab trip={trip} />}
          {activeTab === "budget" && <BudgetTab trip={trip} />}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Tab: Resumen
const OverviewTab = ({ trip }: { trip: CompletedTrip }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon="🛫"
          title="Vuelo de Ida"
          content={`${trip.flights.outbound.airline} ${trip.flights.outbound.flightNumber}`}
          subtitle={`${trip.flights.outbound.departureTime} - ${trip.flights.outbound.arrivalTime}`}
        />
        <InfoCard
          icon="🛬"
          title="Vuelo de Regreso"
          content={
            trip.flights.return
              ? `${trip.flights.return.airline} ${trip.flights.return.flightNumber}`
              : "No incluido"
          }
          subtitle={
            trip.flights.return
              ? `${trip.flights.return.departureTime} - ${trip.flights.return.arrivalTime}`
              : ""
          }
        />
        <InfoCard
          icon="🏨"
          title="Alojamiento"
          content={trip.hotel.hotelName}
          subtitle={`${trip.hotel.nights} noches • ${trip.hotel.roomType}`}
        />
        <InfoCard
          icon="🎯"
          title="Actividades"
          content={`${trip.activities.length} actividades`}
          subtitle={trip.activities.map((a) => a.category).join(", ")}
        />
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>💰</span>
          <span>Resumen de Costos</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Vuelos</p>
            <p className="text-xl font-bold text-blue-600">
              ${trip.budget.flights}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hotel</p>
            <p className="text-xl font-bold text-blue-600">
              ${trip.budget.hotel}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Actividades</p>
            <p className="text-xl font-bold text-blue-600">
              ${trip.budget.activities}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-indigo-600">
              ${trip.budget.total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab: Vuelos
const FlightsTab = ({ trip }: { trip: CompletedTrip }) => {
  const FlightCard = ({ flight, type }: { flight: any; type: string }) => (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">
              {type === "outbound" ? "🛫" : "🛬"}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-lg">
              {type === "outbound" ? "Vuelo de Ida" : "Vuelo de Regreso"}
            </h4>
            <p className="text-sm text-gray-600">
              {flight.airline} {flight.flightNumber}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {flight.flightClass}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Origen</p>
            <p className="font-bold text-lg">{flight.origin}</p>
            <p className="text-sm text-gray-600">
              {flight.departureDate} • {flight.departureTime}
            </p>
          </div>
          <div className="flex-1 mx-4 border-t-2 border-dashed border-gray-300 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <span className="text-xs text-gray-500">{flight.duration}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Destino</p>
            <p className="font-bold text-lg">{flight.destination}</p>
            <p className="text-sm text-gray-600">
              {flight.arrivalDate} • {flight.arrivalTime}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Equipaje</p>
            <p className="text-sm font-medium">{flight.baggage}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Confirmación</p>
            <p className="text-sm font-bold text-blue-600">
              {flight.confirmationCode}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Precio</span>
          <span className="text-2xl font-bold text-blue-600">
            ${flight.price}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <FlightCard flight={trip.flights.outbound} type="outbound" />
      {trip.flights.return && (
        <FlightCard flight={trip.flights.return} type="return" />
      )}
    </div>
  );
};

// Tab: Hotel
const HotelTab = ({ trip }: { trip: CompletedTrip }) => {
  const hotel = trip.hotel;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">{hotel.hotelName}</h3>
            <p className="text-green-700 font-medium">{hotel.category}</p>
            <p className="text-sm text-gray-600 mt-1">{hotel.address}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Confirmación</p>
            <p className="text-lg font-bold text-green-600">
              {hotel.confirmationCode}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Check-in</p>
            <p className="font-bold">{hotel.checkIn}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Check-out</p>
            <p className="font-bold">{hotel.checkOut}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Noches</p>
            <p className="font-bold">{hotel.nights}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Huéspedes</p>
            <p className="font-bold">{hotel.guests}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold mb-2">Tipo de Habitación</h4>
          <p className="text-gray-700">{hotel.roomType}</p>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold mb-3">Servicios Incluidos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {hotel.amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-lg p-4">
          <div>
            <p className="text-sm text-gray-600">Precio por noche</p>
            <p className="text-xl font-bold text-green-600">
              ${hotel.pricePerNight}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Precio total</p>
            <p className="text-2xl font-bold text-green-600">
              ${hotel.totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab: Actividades
const ActivitiesTab = ({ trip }: { trip: CompletedTrip }) => {
  if (trip.activities.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl">🎯</span>
        <p className="text-gray-600 mt-4">No hay actividades reservadas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trip.activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-5 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-lg mb-1">{activity.name}</h4>
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                {activity.category}
              </span>
            </div>
            <span className="text-xl font-bold text-purple-600">
              ${activity.price}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-3">{activity.description}</p>

          <div className="space-y-2 text-sm mb-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {activity.date} • {activity.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Duración: {activity.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{activity.location}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Incluye:</p>
            <div className="flex flex-wrap gap-1">
              {activity.included.map((item, index) => (
                <span
                  key={index}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-600">Código de confirmación</p>
            <p className="text-sm font-bold text-purple-600">
              {activity.confirmationCode}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Tab: Itinerario
const ItineraryTab = ({ trip }: { trip: CompletedTrip }) => {
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {trip.itinerary.map((day, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-5"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {day.day}
            </div>
            <div>
              <h4 className="font-bold text-lg">{day.title}</h4>
              <p className="text-sm text-gray-600">
                {formatShortDate(day.date)}
              </p>
            </div>
          </div>

          {day.activities.length > 0 && (
            <div className="bg-white rounded-lg p-4 mb-3">
              <h5 className="font-bold text-sm mb-2">Actividades del día</h5>
              <div className="space-y-2">
                {day.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg"
                  >
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.name}</p>
                      <p className="text-xs text-gray-600">
                        {activity.time} • {activity.duration}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      ${activity.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
            <div className="bg-white rounded-lg p-4 mb-3">
              <h5 className="font-bold text-sm mb-2">Comidas</h5>
              <div className="space-y-1 text-sm">
                {day.meals.breakfast && (
                  <p className="flex items-center gap-2">
                    <span>🍳</span>
                    <span>{day.meals.breakfast}</span>
                  </p>
                )}
                {day.meals.lunch && (
                  <p className="flex items-center gap-2">
                    <span>🍽️</span>
                    <span>{day.meals.lunch}</span>
                  </p>
                )}
                {day.meals.dinner && (
                  <p className="flex items-center gap-2">
                    <span>🍷</span>
                    <span>{day.meals.dinner}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {day.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Nota:</span> {day.notes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Tab: Presupuesto
const BudgetTab = ({ trip }: { trip: CompletedTrip }) => {
  const budget = trip.budget;
  const items = [
    { label: "Vuelos", amount: budget.flights, icon: "✈️", color: "blue" },
    { label: "Hotel", amount: budget.hotel, icon: "🏨", color: "green" },
    {
      label: "Actividades",
      amount: budget.activities,
      icon: "🎯",
      color: "purple",
    },
    { label: "Extras", amount: budget.extras, icon: "🎁", color: "orange" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Desglose de Gastos
        </h3>

        <div className="space-y-4 mb-6">
          {items.map((item, index) => {
            const percentage = ((item.amount / budget.total) * 100).toFixed(1);
            return (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${item.amount}</p>
                    <p className="text-xs text-gray-600">{percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${item.color}-600 h-2 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 text-center">
          <p className="text-sm font-medium mb-1">Total del Viaje</p>
          <p className="text-4xl font-bold">${budget.total}</p>
          <p className="text-sm text-green-100 mt-2">
            ${(budget.total / trip.travelers).toFixed(2)} por persona
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium mb-1">
            Costo por noche
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ${(budget.total / trip.hotel.nights).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium mb-1">
            Costo por día
          </p>
          <p className="text-2xl font-bold text-purple-600">
            ${(budget.total / (trip.hotel.nights + 1)).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para cards de información
const InfoCard = ({
  icon,
  title,
  content,
  subtitle,
}: {
  icon: string;
  title: string;
  content: string;
  subtitle?: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-xs text-gray-600 mb-1">{title}</p>
        <p className="font-bold text-sm">{content}</p>
        {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

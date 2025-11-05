/**
 * Public Trip View
 * Vista pública de un viaje para usuarios que reciben el link
 */

"use client";

import { useState, useEffect } from "react";
import {
  CompletedTrip,
  CompletedTripsManager,
} from "@/components/trips/CompletedTripsManager";
import { JoinRequestModal } from "@/components/notifications/JoinRequestModal";
import { Toast, ToastType } from "@/components/ui/Toast";

interface PublicTripViewProps {
  shareToken: string;
}

export const PublicTripView = ({ shareToken }: PublicTripViewProps) => {
  const [trip, setTrip] = useState<CompletedTrip | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  useEffect(() => {
    // Buscar el viaje por shareToken
    const trips = CompletedTripsManager.getAllTrips();
    const foundTrip = trips.find(
      (t) => t.shareToken === shareToken || t.id === shareToken
    );
    setTrip(foundTrip || null);
  }, [shareToken]);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl font-semibold text-gray-700">
            Viaje no encontrado
          </p>
          <p className="text-gray-500 mt-2">
            El link puede haber expirado o ser inválido
          </p>
        </div>
      </div>
    );
  }

  const participants = trip.participants || [];
  const spotsAvailable = trip.travelers - participants.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">✈️</span>
              <div>
                <h1 className="text-3xl font-bold">{trip.name}</h1>
                <p className="text-blue-100 mt-1">
                  {trip.origin} → {trip.destination}
                </p>
              </div>
            </div>

            {spotsAvailable > 0 && (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Solicitar unirse al viaje
              </button>
            )}
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Viajeros</p>
              <p className="text-lg font-semibold text-gray-900">
                {participants.length} de {trip.travelers}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Espacios</p>
              <p className="text-lg font-semibold text-gray-900">
                {spotsAvailable} disponible{spotsAvailable !== 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Presupuesto</p>
              <p className="text-lg font-semibold text-gray-900">
                ${trip.budget.total.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="text-lg font-semibold text-gray-900">
                {trip.travelType === "solo" ? "Solo" : "Grupal"}
              </p>
            </div>
          </div>
        </div>

        {/* Detalles del viaje */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Vuelos */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>✈️</span> Vuelos
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Ida</p>
                <p className="text-gray-900">
                  {trip.flights.outbound.airline}{" "}
                  {trip.flights.outbound.flightNumber}
                </p>
                <p className="text-sm text-gray-500">
                  {trip.flights.outbound.departureTime} -{" "}
                  {trip.flights.outbound.arrivalTime}
                </p>
              </div>
              {trip.flights.return && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Regreso</p>
                  <p className="text-gray-900">
                    {trip.flights.return.airline}{" "}
                    {trip.flights.return.flightNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {trip.flights.return.departureTime} -{" "}
                    {trip.flights.return.arrivalTime}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hotel */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏨</span> Alojamiento
            </h3>
            <div>
              <p className="text-gray-900 font-medium">
                {trip.hotel.hotelName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {trip.hotel.roomType}
              </p>
              <p className="text-sm text-gray-500">
                {trip.hotel.nights} noches
              </p>
              <p className="text-gray-600 mt-2">{trip.hotel.address}</p>
            </div>
          </div>
        </div>

        {/* Participantes */}
        {participants.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Participantes Confirmados
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {participant.name}
                    </p>
                    {participant.role === "owner" && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Organizador
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={isJoinModalOpen}
        trip={trip}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={() => {
          showToast(
            "¡Solicitud enviada! El organizador recibirá tu petición.",
            "success"
          );
        }}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

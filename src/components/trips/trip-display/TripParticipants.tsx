/**
 * Trip Participants Component
 * Muestra y gestiona los participantes de un viaje
 */

"use client";

import { useState } from "react";
import { CompletedTrip, TripParticipant } from "@/types/trip";

interface TripParticipantsProps {
  trip: CompletedTrip;
  onInviteClick: () => void;
  onRemoveParticipant?: (participantId: string) => void;
}

export const TripParticipants = ({
  trip,
  onInviteClick,
  onRemoveParticipant,
}: TripParticipantsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const participants = trip.participants || [];
  const totalTravelers = trip.travelers || 1;
  const spotsAvailable = totalTravelers - participants.length;
  const isOwner = participants.some((p) => p.role === "owner");

  // Generar placeholder para espacios vacíos
  const emptySlots = Array.from({ length: spotsAvailable }, (_, i) => i);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">Viajeros</h3>
            <p className="text-sm text-gray-500">
              {participants.length} de {totalTravelers} confirmados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {spotsAvailable > 0 && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {spotsAvailable} {spotsAvailable === 1 ? "espacio" : "espacios"}{" "}
              disponible
              {spotsAvailable > 1 ? "s" : ""}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Lista de participantes */}
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full ${getAvatarColor(
                      index
                    )} flex items-center justify-center text-white font-semibold text-sm`}
                  >
                    {getInitials(participant.name)}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {participant.name}
                      </p>
                      {participant.role === "owner" && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Organizador
                        </span>
                      )}
                    </div>
                    {participant.email && (
                      <p className="text-sm text-gray-500">
                        {participant.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                {participant.role !== "owner" && onRemoveParticipant && (
                  <button
                    onClick={() => onRemoveParticipant(participant.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar participante"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {/* Espacios vacíos */}
            {emptySlots.map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 italic">
                  Espacio disponible
                </p>
              </div>
            ))}
          </div>

          {/* Botón de invitar */}
          {spotsAvailable > 0 && (
            <button
              onClick={onInviteClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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
              Invitar viajeros
            </button>
          )}

          {/* Información adicional */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>
                Los viajeros invitados podrán ver todos los detalles del viaje
                incluyendo reservas, itinerario y presupuesto.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

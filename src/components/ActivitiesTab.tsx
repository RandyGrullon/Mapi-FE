"use client";

import { CompletedTrip } from "./CompletedTripsManager";
import { ActionButton } from "./buttons";

interface ActivitiesTabProps {
  trip: CompletedTrip;
  status: CompletedTrip["status"];
  openGoogleMaps: (location: string) => void;
  isClient: boolean;
}

export const ActivitiesTab = ({
  trip,
  status,
  openGoogleMaps,
  isClient,
}: ActivitiesTabProps) => {
  const isInteractive = status === "progress" || status === "ongoing";
  const isCancelled = status === "cancelled";

  if (trip.activities.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <span className="text-6xl">🎯</span>
        <p className="text-gray-600 mt-4">No hay actividades reservadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isCancelled && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-bold text-red-900">Viaje Cancelado</p>
            <p className="text-sm text-red-700">
              Estas actividades han sido canceladas.
            </p>
          </div>
        </div>
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        {trip.activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all animate-fade-in flex flex-col h-full"
          >
            {/* Header con nombre y precio */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg mb-1 text-gray-900 truncate">
                  {activity.name}
                </h4>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
                  {activity.category}
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900 ml-2 flex-shrink-0">
                ${activity.price}
              </span>
            </div>

            {/* Descripción con altura limitada */}
            <div className="mb-4 flex-grow">
              <p className="text-sm text-gray-700 line-clamp-3">
                {activity.description}
              </p>
            </div>

            {/* Información de fecha, hora, duración y ubicación */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-purple-600 flex-shrink-0"
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
                <span className="truncate">
                  {activity.date} • {activity.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-purple-600 flex-shrink-0"
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
                <span className="truncate">Duración: {activity.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-purple-600 flex-shrink-0"
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
                <span className="truncate">{activity.location}</span>
              </div>
            </div>

            {/* Sección de elementos incluidos */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-2">Incluye:</p>
              <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                {activity.included.slice(0, 4).map((item, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200 truncate max-w-24"
                  >
                    {item}
                  </span>
                ))}
                {activity.included.length > 4 && (
                  <span className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200">
                    +{activity.included.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Código de confirmación */}
            <div className="bg-gray-50 rounded-lg p-2 mb-4">
              <p className="text-xs text-gray-500">Código de confirmación</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {activity.confirmationCode}
              </p>
            </div>

            {/* Botones - siempre al final */}
            <div className="space-y-2 mt-auto">
              <ActionButton
                onClick={() =>
                  openGoogleMaps(`${activity.name}, ${activity.location}`)
                }
                variant="primary"
                size="sm"
                className="w-full justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Ver ubicación en Google Maps
              </ActionButton>

              {isClient && isInteractive && activity.bookingUrl && (
                <a
                  href={activity.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <ActionButton
                    onClick={() => {}}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Reservar Actividad
                  </ActionButton>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

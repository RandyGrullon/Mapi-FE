"use client";

import { CompletedTrip } from "./CompletedTripsManager";

interface TripItemProps {
  trip: CompletedTrip;
  isSelected: boolean;
  onClick: () => void;
  onEditName: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onShare: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onDelete: (trip: CompletedTrip, e: React.MouseEvent) => void;
  isCollapsed: boolean;
}

export const TripItem = ({
  trip,
  isSelected,
  onClick,
  onEditName,
  onShare,
  onDelete,
  isCollapsed,
}: TripItemProps) => {
  const startDate = new Date(trip.startDate);

  if (isCollapsed) {
    return (
      <button
        onClick={onClick}
        className={`w-full p-2 rounded-lg transition-all duration-200 group relative border-2 ${
          isSelected
            ? "border-blue-500 bg-blue-100 shadow-md"
            : "border-gray-200 bg-white hover:bg-gray-50"
        } hover:shadow-md`}
        title={`${trip.destination} - ${
          trip.status === "progress"
            ? "En progreso"
            : trip.status === "ongoing"
            ? "En curso"
            : trip.status === "completed"
            ? "Completado"
            : "Cancelado"
        }`}
      >
        <div className="flex justify-center">
          <div
            className={`w-6 h-6 rounded-full ${
              isSelected ? "bg-blue-500" : "bg-gray-400"
            }`}
          ></div>
        </div>

        {/* Tooltip expandido al hacer hover */}
        <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl min-w-[180px]">
          <p className="font-bold text-sm">{trip.destination}</p>
          <p className="text-gray-300 text-[10px] mt-1">
            {trip.origin} → {trip.destination}
          </p>
          <p className="text-gray-300 text-[10px] mt-1">
            {startDate.toLocaleDateString("es-ES", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-gray-400 text-[10px]">
            {trip.hotel.nights} noches • ${trip.budget.total}
          </p>
          <p className="text-blue-300 text-[10px] mt-1 font-medium">
            Estado:{" "}
            {trip.status === "progress"
              ? "En progreso"
              : trip.status === "ongoing"
              ? "En curso"
              : trip.status === "completed"
              ? "Completado"
              : "Cancelado"}
          </p>
          {/* Flecha del tooltip */}
          <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`w-full p-3 rounded-lg transition-all duration-200 text-left group relative border-2 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-100 shadow-md ring-2 ring-blue-200"
          : "border-gray-200 bg-white hover:bg-gray-50"
      } hover:shadow-md`}
      title={trip.name}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-4 h-4 rounded-full ${
            isSelected ? "bg-blue-500" : "bg-gray-400"
          } flex-shrink-0 mt-0.5`}
        ></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {trip.destination}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {trip.origin} → {trip.destination}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {startDate.toLocaleDateString("es-ES", {
              month: "short",
              day: "numeric",
            })}
            {" • "}
            {trip.hotel.nights} noches
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200">
              ${trip.budget.total}
            </span>
          </div>
        </div>
        {/* Action buttons - visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditName(trip, e);
            }}
            className="p-1.5 rounded-md hover:bg-white/80 transition-colors"
            title="Editar nombre"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(trip, e);
            }}
            className="p-1.5 rounded-md hover:bg-white/80 transition-colors"
            title="Compartir viaje"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip, e);
            }}
            className="p-1.5 rounded-md hover:bg-white/80 transition-colors"
            title="Eliminar viaje"
          >
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

"use client";

import { CompletedTrip } from "@/types/trip";

interface TripActionButtonsProps {
  trip: CompletedTrip;
  onEditName: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onShare: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onDelete: (trip: CompletedTrip, e: React.MouseEvent) => void;
}

export const TripActionButtons = ({
  trip,
  onEditName,
  onShare,
  onDelete,
}: TripActionButtonsProps) => {
  return (
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
  );
};

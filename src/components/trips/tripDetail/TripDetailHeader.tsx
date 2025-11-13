import { CompletedTrip } from "@/types/trip";
import { formatDate } from "./tripDetailUtils";
import { StatusBadge } from "../shared/StatusBadge";

interface TripDetailHeaderProps {
  trip: CompletedTrip;
  onClose: () => void;
}

export const TripDetailHeader = ({ trip, onClose }: TripDetailHeaderProps) => {
  return (
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
          <StatusBadge status={trip.status} />
        </div>
        <p className="text-blue-100 text-sm">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        <p className="text-blue-100 text-sm mt-1">
          {trip.travelers} {trip.travelers === 1 ? "viajero" : "viajeros"}
        </p>
      </div>
    </div>
  );
};

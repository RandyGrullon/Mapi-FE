"use client";

import { CompletedTrip } from "@/types/trip";
import {
  formatTripDateShort,
  getTripStatusText,
} from "../../data/trip-item-utils";

interface TripContentProps {
  trip: CompletedTrip;
}

export const TripContent = ({ trip }: TripContentProps) => {
  const startDate = new Date(trip.startDate);

  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-gray-900 truncate">
        {trip.destination}
      </p>
      <p className="text-xs text-gray-600 truncate">
        {trip.origin} → {trip.destination}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {formatTripDateShort(startDate)}
        {" • "}
        {trip.hotel.nights} noches
      </p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200">
          ${trip.budget.total}
        </span>
      </div>
    </div>
  );
};

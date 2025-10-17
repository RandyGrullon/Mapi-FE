"use client";

import { CompletedTrip } from "./CompletedTripsManager";
import {
  formatTripDate,
  getTripStatusText,
  getTripStatusColor,
} from "./trip-item-utils";

interface TripTooltipProps {
  trip: CompletedTrip;
}

export const TripTooltip = ({ trip }: TripTooltipProps) => {
  const startDate = new Date(trip.startDate);

  return (
    <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl min-w-[180px]">
      <p className="font-bold text-sm">{trip.destination}</p>
      <p className="text-gray-300 text-[10px] mt-1">
        {trip.origin} → {trip.destination}
      </p>
      <p className="text-gray-300 text-[10px] mt-1">
        {formatTripDate(startDate)}
      </p>
      <p className="text-gray-400 text-[10px]">
        {trip.hotel.nights} noches • ${trip.budget.total}
      </p>
      <p
        className={`text-[10px] mt-1 font-medium ${getTripStatusColor(
          trip.status
        )}`}
      >
        Estado: {getTripStatusText(trip.status)}
      </p>
      {/* Flecha del tooltip */}
      <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
    </div>
  );
};

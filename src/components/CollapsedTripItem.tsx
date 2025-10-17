"use client";

import { CompletedTrip } from "./CompletedTripsManager";
import { TripStatusIndicator } from "./TripStatusIndicator";
import { TripTooltip } from "./TripTooltip";
import { getTripStatusText } from "./trip-item-utils";

interface CollapsedTripItemProps {
  trip: CompletedTrip;
  isSelected: boolean;
  onClick: () => void;
}

export const CollapsedTripItem = ({
  trip,
  isSelected,
  onClick,
}: CollapsedTripItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-2 rounded-lg transition-all duration-200 group relative border-2 ${
        isSelected
          ? "border-blue-500 bg-blue-100 shadow-md"
          : "border-gray-200 bg-white hover:bg-gray-50"
      } hover:shadow-md`}
      title={`${trip.destination} - ${getTripStatusText(trip.status)}`}
    >
      <div className="flex justify-center">
        <TripStatusIndicator isSelected={isSelected} size="md" />
      </div>

      <TripTooltip trip={trip} />
    </button>
  );
};

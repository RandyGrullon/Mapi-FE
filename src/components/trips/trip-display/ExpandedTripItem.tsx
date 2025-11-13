"use client";

import { CompletedTrip } from "@/types/trip";
import { TripStatusIndicator } from "../shared/TripStatusIndicator";
import { TripContent } from "./TripContent";
import { TripActionButtons } from "./TripActionButtons";

interface ExpandedTripItemProps {
  trip: CompletedTrip;
  isSelected: boolean;
  onClick: () => void;
  onEditName: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onShare: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onDelete: (trip: CompletedTrip, e: React.MouseEvent) => void;
}

export const ExpandedTripItem = ({
  trip,
  isSelected,
  onClick,
  onEditName,
  onShare,
  onDelete,
}: ExpandedTripItemProps) => {
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
        <TripStatusIndicator isSelected={isSelected} size="sm" />
        <TripContent trip={trip} />
        <TripActionButtons
          trip={trip}
          onEditName={onEditName}
          onShare={onShare}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

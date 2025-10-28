"use client";

import { CompletedTrip } from "./CompletedTripsManager";
import { CollapsedTripItem } from "./CollapsedTripItem";
import { ExpandedTripItem } from "./ExpandedTripItem";

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
  if (isCollapsed) {
    return (
      <CollapsedTripItem
        trip={trip}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }

  return (
    <ExpandedTripItem
      trip={trip}
      isSelected={isSelected}
      onClick={onClick}
      onEditName={onEditName}
      onShare={onShare}
      onDelete={onDelete}
    />
  );
};

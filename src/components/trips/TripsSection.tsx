"use client";

import { useState } from "react";
import { CompletedTrip } from "./CompletedTripsManager";
import { TripItem } from "./TripItem";

interface TripsSectionProps {
  trips: CompletedTrip[];
  selectedTripId: string | null;
  onNavigateToTripDetail: (trip: CompletedTrip) => void;
  onEditTripName: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onShareTrip: (trip: CompletedTrip, e: React.MouseEvent) => void;
  onDeleteTrip: (trip: CompletedTrip, e: React.MouseEvent) => void;
  isCollapsed: boolean;
}

export const TripsSection = ({
  trips,
  selectedTripId,
  onNavigateToTripDetail,
  onEditTripName,
  onShareTrip,
  onDeleteTrip,
  isCollapsed,
}: TripsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (trips.length === 0) return null;

  if (isCollapsed) {
    return (
      <div className="flex-1 overflow-y-auto space-y-2">
        {trips.slice(0, 4).map((trip) => (
          <TripItem
            key={trip.id}
            trip={trip}
            isSelected={selectedTripId === trip.id}
            onClick={() => onNavigateToTripDetail(trip)}
            onEditName={onEditTripName}
            onShare={onShareTrip}
            onDelete={onDeleteTrip}
            isCollapsed={isCollapsed}
          />
        ))}
        {trips.length > 4 && (
          <div className="text-center py-1">
            <span
              className="text-xs text-gray-500 font-medium"
              title={`${trips.length - 4} viajes más`}
            >
              +{trips.length - 4}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-500 mb-3 hover:text-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Mis Viajes ({trips.length})</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
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
      </button>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto space-y-2">
          {trips.map((trip) => (
            <TripItem
              key={trip.id}
              trip={trip}
              isSelected={selectedTripId === trip.id}
              onClick={() => onNavigateToTripDetail(trip)}
              onEditName={onEditTripName}
              onShare={onShareTrip}
              onDelete={onDeleteTrip}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

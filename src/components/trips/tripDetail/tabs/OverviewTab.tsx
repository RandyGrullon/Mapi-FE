"use client";

import { CompletedTrip } from "@/types/trip";
import { TripParticipants } from "@/components/trips/trip-display/TripParticipants";
import { OverviewCards, BudgetSummary } from "./overview";

interface OverviewTabProps {
  trip: CompletedTrip;
  openGoogleMaps: (location: string) => void;
  setActiveTab: (
    tab: "overview" | "flights" | "hotel" | "car" | "activities" | "budget"
  ) => void;
  onInviteParticipants?: () => void;
  onRemoveParticipant?: (participantId: string) => void;
}

export const OverviewTab = ({
  trip,
  openGoogleMaps,
  setActiveTab,
  onInviteParticipants,
  onRemoveParticipant,
}: OverviewTabProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Trip Participants Section - Solo mostrar si hay más de 1 viajero */}
      {trip.travelers > 1 && (
        <TripParticipants
          trip={trip}
          onInviteClick={() => onInviteParticipants?.()}
          onRemoveParticipant={onRemoveParticipant}
        />
      )}

      {/* Trip Overview Cards */}
      <OverviewCards trip={trip} setActiveTab={setActiveTab} />

      {/* Quick Budget Summary */}
      <BudgetSummary budget={trip.budget} hasCarRental={!!trip.carRental} />
    </div>
  );
};

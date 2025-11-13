"use client";

import { CompletedTrip } from "@/types/trip";
import { FlightCard } from "./flights";

interface FlightsTabProps {
  trip: CompletedTrip;
  status: CompletedTrip["status"];
  isClient: boolean;
}

export const FlightsTab = ({ trip, status, isClient }: FlightsTabProps) => {
  const isInteractive = status === "progress" || status === "ongoing";

  return (
    <div className="space-y-6">
      <FlightCard
        flight={trip.flights.outbound}
        type="outbound"
        isInteractive={isInteractive}
        isClient={isClient}
      />
      {trip.flights.return && (
        <FlightCard
          flight={trip.flights.return}
          type="return"
          isInteractive={isInteractive}
          isClient={isClient}
        />
      )}
    </div>
  );
};

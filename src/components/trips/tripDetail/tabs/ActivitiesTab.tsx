"use client";

import { CompletedTrip } from "@/types/trip";
import { ActivityCard, EmptyState, CancelledBanner } from "./activities";

interface ActivitiesTabProps {
  trip: CompletedTrip;
  status: CompletedTrip["status"];
  openGoogleMaps: (location: string) => void;
  isClient: boolean;
}

export const ActivitiesTab = ({
  trip,
  status,
  openGoogleMaps,
  isClient,
}: ActivitiesTabProps) => {
  const isInteractive = status === "progress" || status === "ongoing";
  const isCancelled = status === "cancelled";

  if (trip.activities.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {isCancelled && <CancelledBanner />}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        {trip.activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            isInteractive={isInteractive}
            isClient={isClient}
            onOpenMap={openGoogleMaps}
          />
        ))}
      </div>
    </div>
  );
};

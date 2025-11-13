import { CompletedTrip } from "@/types/trip";
import { DayItineraryCard } from "./DayItineraryCard";

interface ItineraryTabProps {
  trip: CompletedTrip;
}

export const ItineraryTab = ({ trip }: ItineraryTabProps) => {
  return (
    <div className="space-y-4">
      {trip.itinerary.map((day, index) => (
        <DayItineraryCard key={index} day={day} index={index} />
      ))}
    </div>
  );
};

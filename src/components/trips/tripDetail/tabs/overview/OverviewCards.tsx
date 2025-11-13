import { FlightCard } from "./FlightCard";
import { HotelCard } from "./HotelCard";
import { CarRentalCard } from "./CarRentalCard";
import { ActivitiesCard } from "./ActivitiesCard";
import { BudgetCard } from "./BudgetCard";

type TabType =
  | "overview"
  | "flights"
  | "hotel"
  | "car"
  | "activities"
  | "budget";

interface TripData {
  flights: {
    outbound: {
      airline: string;
      flightNumber: string;
      departureTime: string;
      arrivalTime: string;
    };
  };
  hotel: {
    hotelName: string;
    nights: number;
  };
  carRental?: {
    carType: string;
    totalDays: number;
  };
  activities: Array<{ category: string }>;
  budget: {
    total: number;
  };
  travelers: number;
}

interface OverviewCardsProps {
  trip: TripData;
  setActiveTab: (tab: TabType) => void;
}

export const OverviewCards = ({ trip, setActiveTab }: OverviewCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FlightCard
      airline={trip.flights.outbound.airline}
      flightNumber={trip.flights.outbound.flightNumber}
      departureTime={trip.flights.outbound.departureTime}
      arrivalTime={trip.flights.outbound.arrivalTime}
      onNavigate={() => setActiveTab("flights")}
    />

    <HotelCard
      hotelName={trip.hotel.hotelName}
      nights={trip.hotel.nights}
      onNavigate={() => setActiveTab("hotel")}
    />

    {trip.carRental && (
      <CarRentalCard
        carType={trip.carRental.carType}
        totalDays={trip.carRental.totalDays}
        onNavigate={() => setActiveTab("car")}
      />
    )}

    <ActivitiesCard
      activities={trip.activities}
      onNavigate={() => setActiveTab("activities")}
    />

    <BudgetCard
      total={trip.budget.total}
      travelers={trip.travelers}
      onNavigate={() => setActiveTab("budget")}
    />
  </div>
);

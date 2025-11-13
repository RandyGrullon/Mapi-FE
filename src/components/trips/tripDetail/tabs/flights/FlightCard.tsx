import { FlightHeader } from "./FlightHeader";
import { FlightRoute } from "./FlightRoute";
import { FlightDetails } from "./FlightDetails";
import { FlightPrice } from "./FlightPrice";
import { FlightBookingButton } from "./FlightBookingButton";

export interface Flight {
  airline: string;
  flightNumber: string;
  flightClass: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  baggage: string;
  confirmationCode: string;
  price: number;
  bookingUrl?: string;
}

interface FlightCardProps {
  flight: Flight;
  type: "outbound" | "return";
  isInteractive: boolean;
  isClient: boolean;
}

export const FlightCard = ({
  flight,
  type,
  isInteractive,
  isClient,
}: FlightCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all animate-fade-in">
    <FlightHeader
      type={type}
      airline={flight.airline}
      flightNumber={flight.flightNumber}
      flightClass={flight.flightClass}
    />

    <div className="space-y-4">
      <FlightRoute
        origin={flight.origin}
        destination={flight.destination}
        departureDate={flight.departureDate}
        departureTime={flight.departureTime}
        arrivalDate={flight.arrivalDate}
        arrivalTime={flight.arrivalTime}
        duration={flight.duration}
      />

      <FlightDetails
        baggage={flight.baggage}
        confirmationCode={flight.confirmationCode}
      />

      <FlightPrice price={flight.price} />

      <FlightBookingButton
        bookingUrl={flight.bookingUrl}
        isInteractive={isInteractive}
        isClient={isClient}
      />
    </div>
  </div>
);

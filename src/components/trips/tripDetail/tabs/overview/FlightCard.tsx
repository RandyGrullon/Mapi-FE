import { CardButton } from "../../../../buttons";

interface FlightCardProps {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  onNavigate: () => void;
}

export const FlightCard = ({
  airline,
  flightNumber,
  departureTime,
  arrivalTime,
  onNavigate,
}: FlightCardProps) => (
  <CardButton
    onClick={onNavigate}
    icon="✈️"
    title="Vuelos"
    subtitle="Información de vuelos"
  >
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Vuelo de ida</span>
      <span className="font-medium text-gray-900">
        {airline} {flightNumber}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Horario</span>
      <span className="text-sm text-gray-900">
        {departureTime} - {arrivalTime}
      </span>
    </div>
  </CardButton>
);

interface FlightRouteProps {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
}

export const FlightRoute = ({
  origin,
  destination,
  departureDate,
  departureTime,
  arrivalDate,
  arrivalTime,
  duration,
}: FlightRouteProps) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">Origen</p>
      <p className="font-bold text-lg">{origin}</p>
      <p className="text-sm text-gray-600">
        {departureDate} • {departureTime}
      </p>
    </div>
    <div className="flex-1 mx-4 border-t-2 border-dashed border-gray-300 relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
        <span className="text-xs text-gray-500">{duration}</span>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-600">Destino</p>
      <p className="font-bold text-lg">{destination}</p>
      <p className="text-sm text-gray-600">
        {arrivalDate} • {arrivalTime}
      </p>
    </div>
  </div>
);

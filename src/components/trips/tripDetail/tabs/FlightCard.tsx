import { FlightReservation } from "@/types/trip";

interface FlightCardProps {
  flight: FlightReservation;
  type: "outbound" | "return";
}

export const FlightCard = ({ flight, type }: FlightCardProps) => (
  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">{type === "outbound" ? "🛫" : "🛬"}</span>
        </div>
        <div>
          <h4 className="font-bold text-lg">
            {type === "outbound" ? "Vuelo de Ida" : "Vuelo de Regreso"}
          </h4>
          <p className="text-sm text-gray-600">
            {flight.airline} {flight.flightNumber}
          </p>
        </div>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {flight.flightClass}
      </span>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Origen</p>
          <p className="font-bold text-lg">{flight.origin}</p>
          <p className="text-sm text-gray-600">
            {flight.departureDate} • {flight.departureTime}
          </p>
        </div>
        <div className="flex-1 mx-4 border-t-2 border-dashed border-gray-300 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
            <span className="text-xs text-gray-500">{flight.duration}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Destino</p>
          <p className="font-bold text-lg">{flight.destination}</p>
          <p className="text-sm text-gray-600">
            {flight.arrivalDate} • {flight.arrivalTime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Equipaje</p>
          <p className="text-sm font-medium">{flight.baggage}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Confirmación</p>
          <p className="text-sm font-bold text-blue-600">
            {flight.confirmationCode}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">Precio</span>
        <span className="text-2xl font-bold text-blue-600">
          ${flight.price}
        </span>
      </div>
    </div>
  </div>
);

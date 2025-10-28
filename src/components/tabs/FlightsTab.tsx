"use client";

import { CompletedTrip } from "../trips/CompletedTripsManager";

interface FlightsTabProps {
  trip: CompletedTrip;
  status: CompletedTrip["status"];
  isClient: boolean;
}

export const FlightsTab = ({ trip, status, isClient }: FlightsTabProps) => {
  const FlightCard = ({ flight, type }: { flight: any; type: string }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">
              {type === "outbound" ? "🛫" : "🛬"}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">
              {type === "outbound" ? "Vuelo de Ida" : "Vuelo de Regreso"}
            </h4>
            <p className="text-sm text-gray-600">
              {flight.airline} {flight.flightNumber}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
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

        {isClient &&
          (status === "progress" || status === "ongoing") &&
          flight.bookingUrl && (
            <div className="pt-4 border-t border-gray-200">
              <a
                href={flight.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
              >
                Reservar Vuelo
              </a>
            </div>
          )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <FlightCard flight={trip.flights.outbound} type="outbound" />
      {trip.flights.return && (
        <FlightCard flight={trip.flights.return} type="return" />
      )}
    </div>
  );
};

"use client";

import { CompletedTrip } from "../trips/CompletedTripsManager";
import { ActionButton } from "../buttons";

interface HotelTabProps {
  trip: CompletedTrip;
  status: CompletedTrip["status"];
  openGoogleMaps: (location: string) => void;
  isClient: boolean;
}

export const HotelTab = ({
  trip,
  status,
  openGoogleMaps,
  isClient,
}: HotelTabProps) => {
  const hotel = trip.hotel;
  const isInteractive = status === "progress" || status === "ongoing";
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-6 animate-fade-in">
      {isCancelled && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-bold text-red-900">Viaje Cancelado</p>
            <p className="text-sm text-red-700">
              Esta reserva ha sido cancelada y no está activa.
            </p>
          </div>
        </div>
      )}

      <div
        className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">{hotel.hotelName}</h3>
            <p className="text-green-700 font-medium">{hotel.category}</p>
            <p className="text-sm text-gray-600 mt-1">{hotel.address}</p>

            {isInteractive && (
              <ActionButton
                onClick={() =>
                  openGoogleMaps(`${hotel.hotelName}, ${hotel.address}`)
                }
                variant="primary"
                size="sm"
                className="mt-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Ver en Google Maps
              </ActionButton>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Confirmación</p>
            <p className="text-lg font-bold text-green-600">
              {hotel.confirmationCode}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Check-in</p>
            <p className="font-bold">{hotel.checkIn}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Check-out</p>
            <p className="font-bold">{hotel.checkOut}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Noches</p>
            <p className="font-bold">{hotel.nights}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Huéspedes</p>
            <p className="font-bold">{hotel.guests}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold mb-2">Tipo de Habitación</h4>
          <p className="text-gray-700">{hotel.roomType}</p>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold mb-3">Servicios Incluidos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {hotel.amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-lg p-4">
          <div>
            <p className="text-sm text-gray-600">Precio por noche</p>
            <p className="text-xl font-bold text-green-600">
              ${hotel.pricePerNight}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Precio total</p>
            <p className="text-2xl font-bold text-green-600">
              ${hotel.totalPrice}
            </p>
          </div>
        </div>
        {isClient && isInteractive && hotel.bookingUrl && (
          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3"
          >
            <ActionButton
              onClick={() => {}}
              variant="secondary"
              size="sm"
              className="w-full justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Reservar Hotel
            </ActionButton>
          </a>
        )}
      </div>
    </div>
  );
};

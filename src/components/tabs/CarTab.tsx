"use client";

import { CarRentalReservation } from "../trips/CompletedTripsManager";
import { ActionButton } from "../buttons";

interface CarTabProps {
  carRental: CarRentalReservation;
  status?: "progress" | "ongoing" | "completed" | "cancelled";
  openGoogleMaps?: (location: string) => void;
  isClient?: boolean;
}

export const CarTab = ({
  carRental,
  status = "progress",
  openGoogleMaps,
  isClient = true,
}: CarTabProps) => {
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
        className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">{carRental.company}</h3>
            <p className="text-blue-700 font-medium text-lg">
              {carRental.carType} - {carRental.carModel}
            </p>

            {carRental.imageUrl && (
              <div className="mt-4 mb-4">
                <img
                  src={carRental.imageUrl}
                  alt={`${carRental.carType} - ${carRental.carModel}`}
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Confirmación</p>
            <p className="text-lg font-bold text-blue-600">
              {carRental.confirmationCode}
            </p>
          </div>
        </div>

        {/* Pickup and Dropoff Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pickup */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold mb-3 text-green-700 flex items-center gap-2">
              <span>📍</span> Recogida
            </h4>
            <p className="text-gray-700 mb-2">{carRental.pickupLocation}</p>
            {isInteractive && openGoogleMaps && (
              <ActionButton
                onClick={() => openGoogleMaps(carRental.pickupLocation)}
                variant="primary"
                size="sm"
                className="mt-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Ver en Maps
              </ActionButton>
            )}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-blue-50 rounded p-2">
                <p className="text-xs text-gray-600">Fecha</p>
                <p className="font-semibold text-sm">{carRental.pickupDate}</p>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <p className="text-xs text-gray-600">Hora</p>
                <p className="font-semibold text-sm">{carRental.pickupTime}</p>
              </div>
            </div>
          </div>

          {/* Dropoff */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold mb-3 text-red-700 flex items-center gap-2">
              <span>📍</span> Devolución
            </h4>
            <p className="text-gray-700 mb-2">{carRental.dropoffLocation}</p>
            {isInteractive && openGoogleMaps && (
              <ActionButton
                onClick={() => openGoogleMaps(carRental.dropoffLocation)}
                variant="primary"
                size="sm"
                className="mt-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Ver en Maps
              </ActionButton>
            )}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-blue-50 rounded p-2">
                <p className="text-xs text-gray-600">Fecha</p>
                <p className="font-semibold text-sm">{carRental.dropoffDate}</p>
              </div>
              <div className="bg-blue-50 rounded p-2">
                <p className="text-xs text-gray-600">Hora</p>
                <p className="font-semibold text-sm">{carRental.dropoffTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rental Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Días de Renta</p>
            <p className="font-bold">{carRental.totalDays}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Precio/Día</p>
            <p className="font-bold">${carRental.pricePerDay.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Transmisión</p>
            <p className="font-bold capitalize">{carRental.transmission}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600">Seguro</p>
            <p className="font-bold">{carRental.insurance ? "Incluido" : "No"}</p>
          </div>
        </div>

        {/* Fuel Policy */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold mb-2">Política de Combustible</h4>
          <p className="text-gray-700">{carRental.fuelPolicy}</p>
        </div>

        {/* Features */}
        {carRental.features && carRental.features.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-bold mb-3">Características del Vehículo</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {carRental.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4">
          <div className="flex justify-between items-center text-white">
            <span className="text-lg font-semibold">Precio Total</span>
            <span className="text-2xl font-bold">
              ${carRental.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Booking Link */}
        {carRental.bookingUrl && isInteractive && isClient && (
          <div className="mt-4">
            <a
              href={carRental.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
            >
              Ver Detalles de Reserva
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

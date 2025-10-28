"use client";

import { Hotel } from "../data/travel-data";

interface HotelsViewProps {
  hotels: Hotel[];
  selected: string | null;
  onToggle: (id: string) => void;
  nights: number;
}

export const HotelsView = ({
  hotels,
  selected,
  onToggle,
  nights,
}: HotelsViewProps) => {
  return (
    <div>
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            🏨 Selecciona 1 hotel
          </span>{" "}
          para tu estadía de {nights} noche(s)
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const isSelected = selected === hotel.id;
          const totalPrice = hotel.pricePerNight * nights;

          return (
            <div
              key={hotel.id}
              onClick={() => onToggle(hotel.id)}
              className={`rounded-xl border-2 transition-all cursor-pointer bg-white overflow-hidden ${
                isSelected
                  ? "border-gray-900 shadow-md ring-2 ring-gray-100"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <span className="text-6xl opacity-30">🏨</span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">
                      {hotel.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">
                        {"⭐".repeat(hotel.stars)}
                      </span>
                      <span className="text-gray-600">{hotel.rating}/5</span>
                      <span className="text-gray-400">({hotel.reviews})</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{hotel.location}</p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Servicios destacados
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500">
                        Por {nights} noches
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${totalPrice}
                      </p>
                      <p className="text-xs text-gray-400">
                        ${hotel.pricePerNight}/noche
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

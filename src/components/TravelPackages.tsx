"use client";

import { useState } from "react";
import { TravelInfo } from "./WizardProvider";
import { Toast, ToastType } from "./Toast";

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  class: "Economy" | "Business" | "First";
}

interface Hotel {
  id: string;
  name: string;
  stars: number;
  location: string;
  amenities: string[];
  pricePerNight: number;
  rating: number;
  reviews: number;
}

interface Activity {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  rating: number;
  included: string[];
}

interface TravelPackage {
  id: string;
  name: string;
  description: string;
  flight: Flight;
  hotel: Hotel;
  activities: Activity[];
  totalPrice: number;
  savings: number;
  recommended?: boolean;
}

interface TravelPackagesProps {
  travelInfo: TravelInfo;
  onSelectPackage: (pkg: TravelPackage) => void;
  onClose: () => void;
}

export const TravelPackages = ({
  travelInfo,
  onSelectPackage,
  onClose,
}: TravelPackagesProps) => {
  const [selectedTab, setSelectedTab] = useState<
    "packages" | "flights" | "hotels" | "activities"
  >("packages");
  const [selectedFlights, setSelectedFlights] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Generar paquetes de ejemplo basados en el destino
  const packages: TravelPackage[] = generatePackages(travelInfo);
  const flights: Flight[] = generateFlights(travelInfo);
  const hotels: Hotel[] = generateHotels(travelInfo);
  const activities: Activity[] = generateActivities(travelInfo);

  const handleSelectFlight = (flightId: string) => {
    if (selectedFlights.includes(flightId)) {
      setSelectedFlights(selectedFlights.filter((id) => id !== flightId));
    } else if (selectedFlights.length < 3) {
      setSelectedFlights([...selectedFlights, flightId]);
    }
  };

  const handleSelectHotel = (hotelId: string) => {
    if (selectedHotels.includes(hotelId)) {
      setSelectedHotels(selectedHotels.filter((id) => id !== hotelId));
    } else if (selectedHotels.length < 3) {
      setSelectedHotels([...selectedHotels, hotelId]);
    }
  };

  const handleSelectActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(
        selectedActivities.filter((id) => id !== activityId)
      );
    } else if (selectedActivities.length < 3) {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const createCustomPackage = () => {
    if (selectedFlights.length === 0 || selectedHotels.length === 0) {
      showToast("Debes seleccionar al menos un vuelo y un hotel", "warning");
      return;
    }

    const flight = flights.find((f) => f.id === selectedFlights[0])!;
    const hotel = hotels.find((h) => h.id === selectedHotels[0])!;
    const selectedActivitiesList = activities.filter((a) =>
      selectedActivities.includes(a.id)
    );

    const nights = parseInt(travelInfo.duration) || 5;
    const totalPrice =
      flight.price +
      hotel.pricePerNight * nights +
      selectedActivitiesList.reduce((sum, a) => sum + a.price, 0);

    const customPackage: TravelPackage = {
      id: "custom",
      name: "Paquete Personalizado",
      description: "Tu paquete hecho a medida",
      flight,
      hotel,
      activities: selectedActivitiesList,
      totalPrice,
      savings: 0,
    };

    showToast("¡Paquete personalizado creado exitosamente!", "success");
    setTimeout(() => {
      onSelectPackage(customPackage);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">
              Paquetes de Viaje a {travelInfo.destination}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-blue-100 text-sm">
            {travelInfo.travelers}{" "}
            {travelInfo.travelers === "1" ? "viajero" : "viajeros"} •{" "}
            {travelInfo.duration} días • {travelInfo.dates}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-6">
          <div className="flex gap-1">
            {[
              { id: "packages", label: "Paquetes", icon: "🎁" },
              { id: "flights", label: "Vuelos", icon: "✈️" },
              { id: "hotels", label: "Hoteles", icon: "🏨" },
              { id: "activities", label: "Actividades", icon: "🎯" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative ${
                  selectedTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {selectedTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedTab === "packages" && (
            <PackagesView packages={packages} onSelect={onSelectPackage} />
          )}
          {selectedTab === "flights" && (
            <FlightsView
              flights={flights}
              selected={selectedFlights}
              onToggle={handleSelectFlight}
            />
          )}
          {selectedTab === "hotels" && (
            <HotelsView
              hotels={hotels}
              selected={selectedHotels}
              onToggle={handleSelectHotel}
              nights={parseInt(travelInfo.duration) || 5}
            />
          )}
          {selectedTab === "activities" && (
            <ActivitiesView
              activities={activities}
              selected={selectedActivities}
              onToggle={handleSelectActivity}
            />
          )}
        </div>

        {/* Footer - Custom Package Builder */}
        {selectedTab !== "packages" && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">Seleccionado:</span>
                  <span className="ml-2 text-gray-600">
                    {selectedFlights.length} vuelos • {selectedHotels.length}{" "}
                    hoteles • {selectedActivities.length} actividades
                  </span>
                </div>
              </div>
              <button
                onClick={createCustomPackage}
                disabled={
                  selectedFlights.length === 0 || selectedHotels.length === 0
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Paquete Personalizado
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// Componente: Vista de Paquetes
const PackagesView = ({
  packages,
  onSelect,
}: {
  packages: TravelPackage[];
  onSelect: (pkg: TravelPackage) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className={`bg-white rounded-xl border-2 ${
            pkg.recommended ? "border-blue-500" : "border-gray-200"
          } hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer`}
          onClick={() => onSelect(pkg)}
        >
          {pkg.recommended && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center py-2 text-sm font-bold">
              ⭐ RECOMENDADO
            </div>
          )}

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

            {/* Vuelo */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✈️</span>
                <span className="font-bold text-sm">Vuelo</span>
              </div>
              <p className="text-sm text-gray-700">
                {pkg.flight.airline} {pkg.flight.flightNumber}
              </p>
              <p className="text-xs text-gray-600">
                {pkg.flight.departure} → {pkg.flight.arrival} •{" "}
                {pkg.flight.duration}
              </p>
            </div>

            {/* Hotel */}
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏨</span>
                <span className="font-bold text-sm">Hotel</span>
              </div>
              <p className="text-sm text-gray-700">{pkg.hotel.name}</p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span>{"⭐".repeat(pkg.hotel.stars)}</span>
                <span>• {pkg.hotel.rating}/5</span>
              </div>
            </div>

            {/* Actividades */}
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <span className="font-bold text-sm">
                  {pkg.activities.length} Actividades
                </span>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                {pkg.activities.slice(0, 3).map((activity) => (
                  <li key={activity.id}>• {activity.name}</li>
                ))}
              </ul>
            </div>

            {/* Precio */}
            <div className="border-t pt-4">
              {pkg.savings > 0 && (
                <div className="text-sm text-green-600 font-medium mb-1">
                  Ahorra ${pkg.savings}
                </div>
              )}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-600">Precio total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${pkg.totalPrice.toLocaleString()}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors group-hover:scale-105">
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente: Vista de Vuelos
const FlightsView = ({
  flights,
  selected,
  onToggle,
}: {
  flights: Flight[];
  selected: string[];
  onToggle: (id: string) => void;
}) => {
  return (
    <div className="space-y-4">
      {flights.map((flight) => {
        const isSelected = selected.includes(flight.id);
        const canSelect = selected.length < 3 || isSelected;

        return (
          <div
            key={flight.id}
            onClick={() => canSelect && onToggle(flight.id)}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : canSelect
                ? "border-gray-200 hover:border-blue-300 hover:shadow-md"
                : "border-gray-200 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <h4 className="font-bold text-lg">
                      {flight.airline} {flight.flightNumber}
                    </h4>
                    <p className="text-sm text-gray-600">{flight.class}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <p className="text-sm font-bold">{flight.departure}</p>
                    <p className="text-xs text-gray-600">Salida</p>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                      <span className="text-xs text-gray-600">
                        {flight.duration}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{flight.arrival}</p>
                    <p className="text-xs text-gray-600">Llegada</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600">
                  {flight.stops === 0 ? "Directo" : `${flight.stops} escala(s)`}
                </p>
              </div>

              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-blue-600">
                  ${flight.price}
                </p>
                {isSelected && (
                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
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
                    Seleccionado
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Componente: Vista de Hoteles
const HotelsView = ({
  hotels,
  selected,
  onToggle,
  nights,
}: {
  hotels: Hotel[];
  selected: string[];
  onToggle: (id: string) => void;
  nights: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hotels.map((hotel) => {
        const isSelected = selected.includes(hotel.id);
        const canSelect = selected.length < 3 || isSelected;
        const totalPrice = hotel.pricePerNight * nights;

        return (
          <div
            key={hotel.id}
            onClick={() => canSelect && onToggle(hotel.id)}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
              isSelected
                ? "border-green-500 bg-green-50"
                : canSelect
                ? "border-gray-200 hover:border-green-300 hover:shadow-md"
                : "border-gray-200 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">🏨</span>
              {isSelected && (
                <div className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                  ✓
                </div>
              )}
            </div>

            <h4 className="font-bold text-lg mb-1">{hotel.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">
                {"⭐".repeat(hotel.stars)}
              </span>
              <span className="text-sm text-gray-600">
                {hotel.rating}/5 ({hotel.reviews} reseñas)
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{hotel.location}</p>

            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Servicios:</p>
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

            <div className="border-t pt-3">
              <p className="text-xs text-gray-600">Por {nights} noches</p>
              <p className="text-2xl font-bold text-green-600">${totalPrice}</p>
              <p className="text-xs text-gray-500">
                ${hotel.pricePerNight}/noche
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Componente: Vista de Actividades
const ActivitiesView = ({
  activities,
  selected,
  onToggle,
}: {
  activities: Activity[];
  selected: string[];
  onToggle: (id: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((activity) => {
        const isSelected = selected.includes(activity.id);
        const canSelect = selected.length < 3 || isSelected;

        return (
          <div
            key={activity.id}
            onClick={() => canSelect && onToggle(activity.id)}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
              isSelected
                ? "border-purple-500 bg-purple-50"
                : canSelect
                ? "border-gray-200 hover:border-purple-300 hover:shadow-md"
                : "border-gray-200 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h4 className="font-bold text-lg">{activity.name}</h4>
                  <p className="text-xs text-gray-600">{activity.category}</p>
                </div>
              </div>
              {isSelected && (
                <div className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                  ✓
                </div>
              )}
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm font-medium">{activity.rating}/5</span>
                <span className="text-xs text-gray-500">
                  • {activity.duration}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Incluye:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {activity.included.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-3 flex items-end justify-between">
              <p className="text-2xl font-bold text-purple-600">
                ${activity.price}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Funciones generadoras de datos
function generatePackages(travelInfo: TravelInfo): TravelPackage[] {
  const flights = generateFlights(travelInfo);
  const hotels = generateHotels(travelInfo);
  const activities = generateActivities(travelInfo);
  const nights = parseInt(travelInfo.duration) || 5;

  return [
    {
      id: "pkg-1",
      name: "Paquete Económico",
      description: "Lo esencial para disfrutar tu viaje",
      flight: flights[0],
      hotel: hotels[0],
      activities: activities.slice(0, 2),
      totalPrice:
        flights[0].price +
        hotels[0].pricePerNight * nights +
        activities[0].price +
        activities[1].price,
      savings: 200,
      recommended: false,
    },
    {
      id: "pkg-2",
      name: "Paquete Premium",
      description: "La mejor experiencia de viaje",
      flight: flights[1],
      hotel: hotels[1],
      activities: activities.slice(1, 4),
      totalPrice:
        flights[1].price +
        hotels[1].pricePerNight * nights +
        activities[1].price +
        activities[2].price +
        activities[3].price,
      savings: 350,
      recommended: true,
    },
    {
      id: "pkg-3",
      name: "Paquete Aventura",
      description: "Para los amantes de la aventura",
      flight: flights[2],
      hotel: hotels[2],
      activities: activities.slice(3, 6),
      totalPrice:
        flights[2].price +
        hotels[2].pricePerNight * nights +
        activities[3].price +
        activities[4].price +
        activities[5].price,
      savings: 280,
      recommended: false,
    },
  ];
}

function generateFlights(travelInfo: TravelInfo): Flight[] {
  const origin = travelInfo.origin || "Santo Domingo";
  const destination = travelInfo.destination || "Paris";

  return [
    {
      id: "flight-1",
      airline: "Air France",
      flightNumber: "AF 0459",
      departure: "08:00 AM",
      arrival: "10:30 PM",
      duration: "9h 30m",
      price: 850,
      stops: 0,
      class: "Economy",
    },
    {
      id: "flight-2",
      airline: "Delta Airlines",
      flightNumber: "DL 8564",
      departure: "10:30 AM",
      arrival: "01:15 AM +1",
      duration: "11h 45m",
      price: 950,
      stops: 1,
      class: "Economy",
    },
    {
      id: "flight-3",
      airline: "American Airlines",
      flightNumber: "AA 0206",
      departure: "06:15 PM",
      arrival: "08:45 AM +1",
      duration: "12h 30m",
      price: 780,
      stops: 1,
      class: "Economy",
    },
  ];
}

function generateHotels(travelInfo: TravelInfo): Hotel[] {
  return [
    {
      id: "hotel-1",
      name: "Hotel Central Plaza",
      stars: 3,
      location: "Centro de la ciudad",
      amenities: ["WiFi gratis", "Desayuno", "Aire acondicionado"],
      pricePerNight: 80,
      rating: 4.2,
      reviews: 1250,
    },
    {
      id: "hotel-2",
      name: "Grand Luxury Hotel",
      stars: 5,
      location: "Zona turística premium",
      amenities: [
        "Spa",
        "Piscina",
        "Gimnasio",
        "WiFi gratis",
        "Desayuno buffet",
      ],
      pricePerNight: 220,
      rating: 4.8,
      reviews: 890,
    },
    {
      id: "hotel-3",
      name: "Boutique Riverside Inn",
      stars: 4,
      location: "Junto al río",
      amenities: ["Vistas panorámicas", "WiFi gratis", "Bar", "Restaurante"],
      pricePerNight: 150,
      rating: 4.6,
      reviews: 640,
    },
  ];
}

function generateActivities(travelInfo: TravelInfo): Activity[] {
  return [
    {
      id: "activity-1",
      name: "City Walking Tour",
      category: "Tours guiados",
      duration: "3 horas",
      price: 45,
      rating: 4.7,
      included: ["Guía profesional", "Mapa de la ciudad", "Fotografías"],
    },
    {
      id: "activity-2",
      name: "Museo Nacional",
      category: "Cultura",
      duration: "2 horas",
      price: 25,
      rating: 4.5,
      included: ["Entrada", "Audio guía", "Material informativo"],
    },
    {
      id: "activity-3",
      name: "Cena en Restaurante Típico",
      category: "Gastronomía",
      duration: "2 horas",
      price: 65,
      rating: 4.9,
      included: ["Menú de 3 platos", "Bebidas", "Show en vivo"],
    },
    {
      id: "activity-4",
      name: "Aventura en la Montaña",
      category: "Aventura",
      duration: "6 horas",
      price: 120,
      rating: 4.8,
      included: ["Equipo de seguridad", "Instructor", "Almuerzo", "Transporte"],
    },
    {
      id: "activity-5",
      name: "Paseo en Barco",
      category: "Náutico",
      duration: "4 horas",
      price: 85,
      rating: 4.6,
      included: ["Capitán", "Refrigerios", "Snorkel", "Fotografías"],
    },
    {
      id: "activity-6",
      name: "Spa Day",
      category: "Relax",
      duration: "3 horas",
      price: 95,
      rating: 4.9,
      included: ["Masaje", "Sauna", "Jacuzzi", "Té y snacks"],
    },
  ];
}

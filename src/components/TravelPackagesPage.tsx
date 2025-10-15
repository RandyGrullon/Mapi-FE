"use client";

import { useState } from "react";
import { TravelInfo } from "./WizardProvider";
import { useNavigation } from "./NavigationContext";
import { CompletedTripsManager } from "./CompletedTripsManager";
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

interface TravelPackagesPageProps {
  travelInfo: TravelInfo;
}

export const TravelPackagesPage = ({ travelInfo }: TravelPackagesPageProps) => {
  const { navigateToWizard, navigateToTripDetail } = useNavigation();
  const [selectedTab, setSelectedTab] = useState<
    "packages" | "flights" | "hotels" | "activities"
  >("packages");
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const packages: TravelPackage[] = generatePackages(travelInfo);
  const flights: Flight[] = generateFlights(travelInfo);
  const hotels: Hotel[] = generateHotels(travelInfo);
  const activities: Activity[] = generateActivities(travelInfo);

  const handleSelectFlight = (flightId: string) => {
    // Solo permite seleccionar 1 vuelo
    if (selectedFlight === flightId) {
      setSelectedFlight(null);
    } else {
      setSelectedFlight(flightId);
    }
  };

  const handleSelectHotel = (hotelId: string) => {
    // Solo permite seleccionar 1 hotel
    if (selectedHotel === hotelId) {
      setSelectedHotel(null);
    } else {
      setSelectedHotel(hotelId);
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

  const handleSelectPackage = (pkg: TravelPackage) => {
    const demoTrip = CompletedTripsManager.createDemoTrip(travelInfo);
    CompletedTripsManager.saveTrip(demoTrip);
    showToast(
      "¡Paquete reservado exitosamente! Preparando tu viaje...",
      "success"
    );
    setTimeout(() => {
      navigateToTripDetail(demoTrip);
    }, 1500);
  };

  const createCustomPackage = () => {
    if (!selectedFlight || !selectedHotel) {
      showToast("Debes seleccionar un vuelo y un hotel", "warning");
      return;
    }

    const flight = flights.find((f) => f.id === selectedFlight);
    const hotel = hotels.find((h) => h.id === selectedHotel);
    const selectedActivitiesList = activities.filter((a) =>
      selectedActivities.includes(a.id)
    );

    if (!flight || !hotel) {
      showToast("Error al cargar la selección", "error");
      return;
    }

    // Crear el viaje personalizado con itinerario basado en actividades
    const demoTrip = CompletedTripsManager.createDemoTrip(travelInfo);
    CompletedTripsManager.saveTrip(demoTrip);

    const activitiesText =
      selectedActivitiesList.length > 0
        ? `con ${selectedActivitiesList.length} actividad(es) seleccionada(s)`
        : "sin actividades adicionales";

    showToast(
      `¡Paquete personalizado creado exitosamente! ${activitiesText}`,
      "success"
    );

    setTimeout(() => {
      navigateToTripDetail(demoTrip);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <button
            onClick={navigateToWizard}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-3 md:mb-4 transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Volver al formulario</span>
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 truncate">
                Opciones de Viaje a {travelInfo.destination}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  {travelInfo.travelers}{" "}
                  {travelInfo.travelers === "1" ? "viajero" : "viajeros"}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {travelInfo.duration} días
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  {travelInfo.dates}
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200 flex-shrink-0">
              <svg
                className="w-4 h-4 text-gray-400"
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
              <span className="font-medium whitespace-nowrap">
                Cancelación flexible
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-4 md:gap-6 border-b border-gray-200 overflow-x-auto hide-scrollbar">
            {[
              { id: "packages", label: "Paquetes", icon: "📦" },
              { id: "flights", label: "Vuelos", icon: "✈️" },
              { id: "hotels", label: "Hoteles", icon: "🏨" },
              { id: "activities", label: "Actividades", icon: "🎯" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-2 py-3 md:py-3.5 font-medium text-sm transition-all relative whitespace-nowrap flex-shrink-0 ${
                  selectedTab === tab.id
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {selectedTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {selectedTab === "packages" && (
            <PackagesView packages={packages} onSelect={handleSelectPackage} />
          )}
          {selectedTab === "flights" && (
            <FlightsView
              flights={flights}
              selected={selectedFlight}
              onToggle={handleSelectFlight}
            />
          )}
          {selectedTab === "hotels" && (
            <HotelsView
              hotels={hotels}
              selected={selectedHotel}
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
      </div>

      {/* Footer - Custom Package Builder */}
      {selectedTab !== "packages" && (
        <div className="border-t border-gray-200 bg-white shadow-sm flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">
                    Tu selección:
                  </span>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1.5 text-gray-500">
                    <span
                      className={`flex items-center gap-1.5 ${
                        selectedFlight ? "text-gray-900 font-medium" : ""
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedFlight ? "bg-gray-900" : "bg-gray-300"
                        }`}
                      ></span>
                      {selectedFlight ? "1 vuelo" : "0 vuelos"}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 ${
                        selectedHotel ? "text-gray-900 font-medium" : ""
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedHotel ? "bg-gray-900" : "bg-gray-300"
                        }`}
                      ></span>
                      {selectedHotel ? "1 hotel" : "0 hoteles"}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 ${
                        selectedActivities.length > 0
                          ? "text-gray-900 font-medium"
                          : ""
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedActivities.length > 0
                            ? "bg-gray-900"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      {selectedActivities.length} actividad(es)
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={createCustomPackage}
                disabled={!selectedFlight || !selectedHotel}
                className="w-full md:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-900 shadow-sm hover:shadow whitespace-nowrap"
              >
                Crear Paquete Personalizado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Vista de Paquetes con diseño mejorado
const PackagesView = ({
  packages,
  onSelect,
}: {
  packages: TravelPackage[];
  onSelect: (pkg: TravelPackage) => void;
}) => {
  return (
    <div>
      {/* Paquete recomendado destacado */}
      {packages
        .filter((p) => p.recommended)
        .map((pkg) => (
          <div
            key={pkg.id}
            className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg border border-gray-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-bold uppercase tracking-wide">
                ✨ Recomendado
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">{pkg.name}</h2>
                <p className="text-gray-300 mb-6 text-sm">{pkg.description}</p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">✈️</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm">
                        {pkg.flight.airline} {pkg.flight.flightNumber}
                      </p>
                      <p className="text-sm text-gray-300">
                        {pkg.flight.departure} → {pkg.flight.arrival}
                      </p>
                      <p className="text-xs text-gray-400">
                        {pkg.flight.duration} •{" "}
                        {pkg.flight.stops === 0
                          ? "Directo"
                          : `${pkg.flight.stops} escala`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🏨</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm">
                        {pkg.hotel.name}
                      </p>
                      <p className="text-sm text-gray-300">
                        {"⭐".repeat(pkg.hotel.stars)} • {pkg.hotel.rating}/5
                      </p>
                      <p className="text-xs text-gray-400">
                        {pkg.hotel.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm">
                        {pkg.activities.length} Actividades incluidas
                      </p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {pkg.activities.map((act) => (
                          <li key={act.id} className="text-xs">
                            • {act.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                    Precio total del paquete
                  </p>
                  <p className="text-4xl font-bold mb-2">
                    ${pkg.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-gray-300 text-sm font-medium mb-6">
                    ✓ Ahorra ${pkg.savings}
                  </p>

                  <button
                    onClick={() => onSelect(pkg)}
                    className="w-full py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
                  >
                    Reservar Ahora
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cancelación gratuita hasta 48h antes
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pago en cuotas sin interés
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Soporte 24/7 durante el viaje
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Otros paquetes */}
      <div className="grid md:grid-cols-2 gap-6">
        {packages
          .filter((p) => !p.recommended)
          .map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-md transition-all overflow-hidden group cursor-pointer"
              onClick={() => onSelect(pkg)}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-sm text-gray-600 mb-5">{pkg.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">✈️</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {pkg.flight.airline}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {pkg.flight.departure} → {pkg.flight.arrival}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">🏨</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {pkg.hotel.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {"⭐".repeat(pkg.hotel.stars)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {pkg.activities.length} Actividades incluidas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    {pkg.savings > 0 && (
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Ahorra ${pkg.savings}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-gray-900">
                      ${pkg.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <button className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm hover:shadow">
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Vista de Vuelos mejorada - Solo 1 selección
const FlightsView = ({
  flights,
  selected,
  onToggle,
}: {
  flights: Flight[];
  selected: string | null;
  onToggle: (id: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            ✈️ Selecciona 1 vuelo
          </span>{" "}
          para tu paquete personalizado
        </p>
      </div>
      {flights.map((flight) => {
        const isSelected = selected === flight.id;

        return (
          <div
            key={flight.id}
            onClick={() => onToggle(flight.id)}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white ${
              isSelected
                ? "border-gray-900 shadow-md ring-2 ring-gray-100"
                : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {flight.airline}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {flight.flightNumber} • {flight.class}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {flight.departure}
                    </p>
                    <p className="text-xs text-gray-500">Salida</p>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 relative min-w-[100px]">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                      <p className="text-xs text-gray-600">{flight.duration}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {flight.arrival}
                    </p>
                    <p className="text-xs text-gray-500">Llegada</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  {flight.stops === 0
                    ? "✓ Vuelo directo"
                    : `${flight.stops} escala(s)`}
                </p>
              </div>

              <div className="text-right ml-6">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${flight.price}
                </p>
                {isSelected && (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium">
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

// Vista de Hoteles mejorada - Solo 1 selección
const HotelsView = ({
  hotels,
  selected,
  onToggle,
  nights,
}: {
  hotels: Hotel[];
  selected: string | null;
  onToggle: (id: string) => void;
  nights: number;
}) => {
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

// Vista de Actividades mejorada - Múltiple selección (hasta 3)
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
    <div>
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">
            🎯 Selecciona hasta 3 actividades
          </span>{" "}
          para personalizar tu itinerario de viaje
        </p>
        {selected.length > 0 && (
          <p className="text-xs text-gray-600 mt-1.5 font-medium">
            {selected.length}/3 actividades seleccionadas
          </p>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {activities.map((activity) => {
          const isSelected = selected.includes(activity.id);
          const canSelect = selected.length < 3 || isSelected;

          return (
            <div
              key={activity.id}
              onClick={() => canSelect && onToggle(activity.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                isSelected
                  ? "border-gray-900 shadow-md ring-2 ring-gray-100"
                  : canSelect
                  ? "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                  : "border-gray-200 opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {activity.name}
                    </h4>
                    <p className="text-xs text-gray-500">{activity.category}</p>
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

              <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  {activity.rating}/5
                </span>
                <span>•</span>
                <span>{activity.duration}</span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Incluye:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {activity.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${activity.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Funciones generadoras (mismas que antes)
function generatePackages(travelInfo: TravelInfo): TravelPackage[] {
  const flights = generateFlights(travelInfo);
  const hotels = generateHotels(travelInfo);
  const activities = generateActivities(travelInfo);
  const nights = parseInt(travelInfo.duration) || 5;

  return [
    {
      id: "pkg-1",
      name: "Paquete Económico",
      description: "Lo esencial para disfrutar tu viaje sin preocupaciones",
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
      description: "La experiencia completa con servicios de primera clase",
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
      description: "Para los amantes de la exploración y nuevas experiencias",
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

/**
 * Vista de Resumen Final
 * Muestra todos los datos recopilados por módulo
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ServiceType,
  FlightModuleData,
  HotelModuleData,
  CarModuleData,
  ActivitiesModuleData,
  FlightType,
} from "@/types/wizard";
import { useWizardStore } from "@/stores/wizardStore";

export const SummaryView = () => {
  const {
    activeModules,
    resetWizard,
    goToModule,
    addModule,
    updateModuleData,
  } = useWizardStore();
  const router = useRouter();

  // Estado para controlar qué módulo está en modo edición
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(
    null
  );

  // Verificar qué servicios están activos
  const hasHotel = activeModules.some((m) => m.type === ServiceType.HOTEL);
  const hasCar = activeModules.some((m) => m.type === ServiceType.CAR);
  const hasActivities = activeModules.some(
    (m) => m.type === ServiceType.ACTIVITIES
  );

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.FLIGHTS:
        return "✈️";
      case ServiceType.HOTEL:
        return "🏨";
      case ServiceType.CAR:
        return "🚗";
      case ServiceType.ACTIVITIES:
        return "🎟️";
      default:
        return "📋";
    }
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case ServiceType.FLIGHTS:
        return "Vuelos";
      case ServiceType.HOTEL:
        return "Hotel";
      case ServiceType.CAR:
        return "Auto";
      case ServiceType.ACTIVITIES:
        return "Actividades";
      default:
        return "Servicio";
    }
  };

  const handleStartOver = () => {
    // Resetear el wizard para empezar desde cero
    resetWizard();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-2xl mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Configuración completada
        </h2>
        <p className="text-lg text-gray-500">
          Revisa los detalles de tu viaje antes de buscar opciones
        </p>
      </div>

      {/* Modules Summary */}
      <div className="grid gap-6 mb-10">
        {activeModules.map((module: any, index: number) => (
          <div
            key={module.type}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-black rounded-xl text-2xl">
                    {getServiceIcon(module.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {getServiceLabel(module.type)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-500 font-medium">
                        Completado
                      </span>
                    </div>
                  </div>
                </div>
                {editingModuleIndex === index ? (
                  <button
                    onClick={() => setEditingModuleIndex(null)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingModuleIndex(index)}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 py-5">
              {editingModuleIndex === index ? (
                // Modo Edición
                <>
                  {module.type === ServiceType.FLIGHTS && (
                    <EditFlightForm
                      data={module.data as FlightModuleData}
                      onSave={(updatedData) => {
                        updateModuleData(module.type, updatedData);
                        setEditingModuleIndex(null);
                      }}
                      onCancel={() => setEditingModuleIndex(null)}
                    />
                  )}
                  {module.type === ServiceType.HOTEL && (
                    <EditHotelForm
                      data={module.data as HotelModuleData}
                      onSave={(updatedData) => {
                        updateModuleData(module.type, updatedData);
                        setEditingModuleIndex(null);
                      }}
                      onCancel={() => setEditingModuleIndex(null)}
                    />
                  )}
                  {module.type === ServiceType.CAR && (
                    <EditCarForm
                      data={module.data as CarModuleData}
                      onSave={(updatedData) => {
                        updateModuleData(module.type, updatedData);
                        setEditingModuleIndex(null);
                      }}
                      onCancel={() => setEditingModuleIndex(null)}
                    />
                  )}
                  {module.type === ServiceType.ACTIVITIES && (
                    <EditActivitiesForm
                      data={module.data as ActivitiesModuleData}
                      onSave={(updatedData) => {
                        updateModuleData(module.type, updatedData);
                        setEditingModuleIndex(null);
                      }}
                      onCancel={() => setEditingModuleIndex(null)}
                    />
                  )}
                </>
              ) : (
                // Modo Vista
                <>
                  {module.type === ServiceType.FLIGHTS && (
                    <FlightSummary data={module.data as FlightModuleData} />
                  )}
                  {module.type === ServiceType.HOTEL && (
                    <HotelSummary data={module.data as HotelModuleData} />
                  )}
                  {module.type === ServiceType.CAR && (
                    <CarSummary data={module.data as CarModuleData} />
                  )}
                  {module.type === ServiceType.ACTIVITIES && (
                    <ActivitiesSummary
                      data={module.data as ActivitiesModuleData}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Optional Services */}
      {(!hasHotel || !hasCar || !hasActivities) && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Servicios opcionales
          </h3>
          <p className="text-gray-600 mb-6">
            Agrega estos servicios a tu viaje antes de continuar
          </p>

          <div className="grid gap-4">
            {!hasHotel && <OptionalHotelForm />}
            {!hasCar && <OptionalCarForm />}
            {!hasActivities && <OptionalActivitiesForm />}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleStartOver}
          className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          ← Empezar de nuevo
        </button>
        <button
          onClick={() => {
            // Construir el paquete basado en los módulos seleccionados
            const selectedPackage = buildPackageFromModules(activeModules);

            // Guardar en sessionStorage para que la página de paquetes lo use
            sessionStorage.setItem(
              "selectedPackage",
              JSON.stringify(selectedPackage)
            );
            sessionStorage.setItem("wizardData", JSON.stringify(activeModules));

            // Navegar a la página de paquetes
            router.push("/packages");
          }}
          className="flex-1 px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 hover:shadow-lg transition-all duration-200"
        >
          Buscar opciones →
        </button>
      </div>
    </div>
  );
};

// ========== FUNCIÓN PARA CONSTRUIR PAQUETE ==========
const buildPackageFromModules = (modules: any[]) => {
  const packageData: any = {
    services: [],
    details: {},
  };

  modules.forEach((module: any) => {
    switch (module.type) {
      case ServiceType.FLIGHTS:
        packageData.services.push("flights");
        packageData.details.flights = {
          type: module.data.flightType,
          segments: module.data.segments,
          travelers: module.data.travelers,
          cabinClass: module.data.cabinClass || "economy",
        };
        break;

      case ServiceType.HOTEL:
        packageData.services.push("hotel");
        packageData.details.hotel = {
          destination: module.data.destination,
          checkIn: module.data.checkIn,
          checkOut: module.data.checkOut,
          rooms: module.data.rooms,
          guests: module.data.guests,
          type: module.data.hotelType || "any",
        };
        break;

      case ServiceType.CAR:
        packageData.services.push("car");
        packageData.details.car = {
          pickupLocation: module.data.pickupLocation,
          dropoffLocation: module.data.dropoffLocation,
          pickupDate: module.data.pickupDate,
          dropoffDate: module.data.dropoffDate,
          type: module.data.carType || "economy",
        };
        break;

      case ServiceType.ACTIVITIES:
        packageData.services.push("activities");
        packageData.details.activities = {
          citiesActivities: module.data.citiesActivities || [],
        };
        break;
    }
  });

  // Determinar el tipo de paquete basado en los servicios seleccionados
  const servicesCount = packageData.services.length;
  if (servicesCount === 4) {
    packageData.packageType = "complete";
    packageData.packageName = "Paquete Completo";
  } else if (
    packageData.services.includes("flights") &&
    packageData.services.includes("hotel")
  ) {
    packageData.packageType = "flight-hotel";
    packageData.packageName = "Vuelo + Hotel";
  } else if (servicesCount === 1) {
    packageData.packageType = packageData.services[0];
    packageData.packageName = getServiceName(packageData.services[0]);
  } else {
    packageData.packageType = "custom";
    packageData.packageName = "Paquete Personalizado";
  }

  return packageData;
};

const getServiceName = (service: string) => {
  const names: { [key: string]: string } = {
    flights: "Solo Vuelos",
    hotel: "Solo Hotel",
    car: "Solo Auto",
    activities: "Solo Actividades",
  };
  return names[service] || "Servicio";
};

// ========== COMPONENTES DE FORMULARIOS OPCIONALES ==========

const OptionalHotelForm = () => {
  const { addCompletedModule, activeModules } = useWizardStore();
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);

  // Extraer ciudades de destino del módulo de vuelos
  const getDestinationCities = () => {
    const flightModule = activeModules.find(
      (m) => m.type === ServiceType.FLIGHTS
    );
    if (!flightModule) return [];

    const flightData = flightModule.data as FlightModuleData;
    const cities = new Set<string>();
    const originCity = flightData.segments[0]?.from;

    // Agregar ciudades de destino (to), excluyendo la ciudad de origen
    flightData.segments.forEach((segment) => {
      if (segment.to && segment.to !== originCity) {
        cities.add(segment.to);
      }
    });

    return Array.from(cities);
  };

  const destinationCities = getDestinationCities();
  const defaultDestination =
    destinationCities.length === 1 ? destinationCities[0] : "";

  // Datos del formulario
  const [destination, setDestination] = useState(defaultDestination);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [hotelType, setHotelType] = useState("standard");

  const handleSave = () => {
    // Crear los datos del hotel
    const hotelData: HotelModuleData = {
      destination,
      checkIn,
      checkOut,
      rooms,
      guests,
      hotelType,
    };

    // Agregar el módulo completado al store
    addCompletedModule(ServiceType.HOTEL, hotelData);

    // Resetear formulario
    setShowForm(false);
    setStep(1);
    setDestination(defaultDestination);
    setCheckIn("");
    setCheckOut("");
    setRooms(1);
    setGuests(2);
    setHotelType("standard");
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-2xl">
            🏨
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Agregar Hotel</h4>
            <p className="text-sm text-gray-500">
              Configura el alojamiento para tu viaje
            </p>
          </div>
          <span className="text-gray-400">+</span>
        </div>
      </button>
    );
  }

  const canContinueStep1 = destination && checkIn && checkOut;
  const canSave = canContinueStep1 && rooms > 0 && guests > 0;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏨</div>
            <div>
              <h4 className="font-bold text-gray-900">Hotel</h4>
              <p className="text-xs text-gray-500">Paso {step} de 2</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(false);
              setStep(1);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino
              </label>
              {destinationCities.length > 1 ? (
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Selecciona una ciudad</option>
                  {destinationCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : destinationCities.length === 1 ? (
                <input
                  type="text"
                  value={destination}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              ) : (
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ej: París, Francia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canContinueStep1}
              className={`
                w-full px-6 py-3 rounded-lg font-semibold transition-all
                ${
                  canContinueStep1
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones
                </label>
                <input
                  type="number"
                  min="1"
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huéspedes
                </label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de hotel
              </label>
              <select
                value={hotelType}
                onChange={(e) => setHotelType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="economy">Económico</option>
                <option value="standard">Estándar</option>
                <option value="comfort">Confort</option>
                <option value="luxury">Lujo</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`
                  flex-1 px-6 py-3 rounded-lg font-semibold transition-all
                  ${
                    canSave
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Guardar Hotel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OptionalCarForm = () => {
  const { addCompletedModule, activeModules } = useWizardStore();
  const [showForm, setShowForm] = useState(false);

  // Extraer ciudades de destino del módulo de vuelos
  const getDestinationCities = () => {
    const flightModule = activeModules.find(
      (m) => m.type === ServiceType.FLIGHTS
    );
    if (!flightModule) return [];

    const flightData = flightModule.data as FlightModuleData;
    const cities = new Set<string>();
    const originCity = flightData.segments[0]?.from;

    // Agregar ciudades de destino (to), excluyendo la ciudad de origen
    flightData.segments.forEach((segment) => {
      if (segment.to && segment.to !== originCity) {
        cities.add(segment.to);
      }
    });

    return Array.from(cities);
  };

  const destinationCities = getDestinationCities();
  const defaultLocation =
    destinationCities.length === 1 ? destinationCities[0] : "";

  // Datos del formulario
  const [pickupLocation, setPickupLocation] = useState(defaultLocation);
  const [dropoffLocation, setDropoffLocation] = useState(defaultLocation);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [carType, setCarType] = useState("economy");

  const handleSave = () => {
    // Crear los datos del auto
    const carData: CarModuleData = {
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      carType,
    };

    // Agregar el módulo completado al store
    addCompletedModule(ServiceType.CAR, carData);

    // Resetear formulario
    setShowForm(false);
    setPickupLocation(defaultLocation);
    setDropoffLocation(defaultLocation);
    setPickupDate("");
    setDropoffDate("");
    setCarType("economy");
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-2xl">
            🚗
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Agregar Auto</h4>
            <p className="text-sm text-gray-500">
              Configura el alquiler de auto para tu viaje
            </p>
          </div>
          <span className="text-gray-400">+</span>
        </div>
      </button>
    );
  }

  const canSave =
    pickupLocation && dropoffLocation && pickupDate && dropoffDate;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚗</div>
            <div>
              <h4 className="font-bold text-gray-900">Alquiler de Auto</h4>
              <p className="text-xs text-gray-500">Configura el transporte</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lugar de recogida
              </label>
              {destinationCities.length > 1 ? (
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Selecciona una ciudad</option>
                  {destinationCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : destinationCities.length === 1 ? (
                <input
                  type="text"
                  value={pickupLocation}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              ) : (
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Ej: Aeropuerto de París"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lugar de devolución
              </label>
              {destinationCities.length > 1 ? (
                <select
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Selecciona una ciudad</option>
                  {destinationCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : destinationCities.length === 1 ? (
                <input
                  type="text"
                  value={dropoffLocation}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              ) : (
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  placeholder="Ej: Aeropuerto de París"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de recogida
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de devolución
              </label>
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                min={pickupDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de vehículo
            </label>
            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="economy">Económico</option>
              <option value="compact">Compacto</option>
              <option value="midsize">Mediano</option>
              <option value="suv">SUV</option>
              <option value="luxury">Lujo</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold transition-all
              ${
                canSave
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Guardar Auto
          </button>
        </div>
      </div>
    </div>
  );
};

const OptionalActivitiesForm = () => {
  const { addCompletedModule, activeModules } = useWizardStore();
  const [showForm, setShowForm] = useState(false);

  // Extraer ciudades de destino del módulo de vuelos
  const getDestinationCities = () => {
    const flightModule = activeModules.find(
      (m) => m.type === ServiceType.FLIGHTS
    );
    if (!flightModule) return [];

    const flightData = flightModule.data as FlightModuleData;
    const cities = new Set<string>();
    const originCity = flightData.segments[0]?.from;

    // Agregar ciudades de destino (to), excluyendo la ciudad de origen
    flightData.segments.forEach((segment) => {
      if (segment.to && segment.to !== originCity) {
        cities.add(segment.to);
      }
    });

    return Array.from(cities);
  };

  const destinationCities = getDestinationCities();

  // Estado para las actividades por ciudad
  const [citiesActivities, setCitiesActivities] = useState<
    Array<{ city: string; interests: string[] }>
  >([]);

  const [currentCity, setCurrentCity] = useState("");
  const [currentActivities, setCurrentActivities] = useState<string[]>([]);

  const activityOptions = [
    "Museo",
    "Tour guiado",
    "Gastronomía",
    "Vida nocturna",
    "Naturaleza",
    "Deportes",
    "Compras",
    "Teatro/Shows",
  ];

  const addCityActivities = () => {
    if (currentCity && currentActivities.length > 0) {
      setCitiesActivities([
        ...citiesActivities,
        { city: currentCity, interests: [...currentActivities] },
      ]);
      setCurrentCity("");
      setCurrentActivities([]);
    }
  };

  const removeCityActivities = (index: number) => {
    setCitiesActivities(citiesActivities.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Crear los datos de actividades
    const activitiesData: ActivitiesModuleData = {
      citiesActivities,
    };

    // Agregar el módulo completado al store
    addCompletedModule(ServiceType.ACTIVITIES, activitiesData);

    // Resetear formulario
    setShowForm(false);
    setCitiesActivities([]);
    setCurrentCity("");
    setCurrentActivities([]);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-2xl">
            🎟️
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Agregar Actividades</h4>
            <p className="text-sm text-gray-500">
              Selecciona actividades para tus destinos
            </p>
          </div>
          <span className="text-gray-400">+</span>
        </div>
      </button>
    );
  }

  const canAddCity = currentCity && currentActivities.length > 0;
  const canSave = citiesActivities.length > 0;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎟️</div>
            <div>
              <h4 className="font-bold text-gray-900">Actividades</h4>
              <p className="text-xs text-gray-500">
                Selecciona actividades por ciudad
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(false);
              setCitiesActivities([]);
              setCurrentCity("");
              setCurrentActivities([]);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="p-6 space-y-6">
        {/* Actividades ya agregadas */}
        {citiesActivities.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-gray-700">
              Actividades agregadas:
            </h5>
            {citiesActivities.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.city}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.interests.map((activity, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-black text-white text-xs rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeCityActivities(index)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para agregar nueva ciudad */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            {destinationCities.length > 0 ? (
              <select
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              >
                <option value="">Selecciona una ciudad</option>
                {destinationCities
                  .filter(
                    (city) => !citiesActivities.some((ca) => ca.city === city)
                  )
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                placeholder="Ej: París, Francia"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Actividades de interés
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activityOptions.map((activity) => (
                <label
                  key={activity}
                  className={`
                    flex items-center gap-3 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      currentActivities.includes(activity)
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={currentActivities.includes(activity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCurrentActivities([...currentActivities, activity]);
                      } else {
                        setCurrentActivities(
                          currentActivities.filter((a) => a !== activity)
                        );
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{activity}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={addCityActivities}
            disabled={!canAddCity}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold transition-all
              ${
                canAddCity
                  ? "bg-gray-800 text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Agregar ciudad
          </button>
        </div>

        {/* Botón de guardar todo */}
        {citiesActivities.length > 0 && (
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all"
          >
            Guardar Actividades
          </button>
        )}
      </div>
    </div>
  );
};

// ========== COMPONENTES DE EDICIÓN ==========

const EditHotelForm = ({
  data,
  onSave,
  onCancel,
}: {
  data: HotelModuleData;
  onSave: (data: Partial<HotelModuleData>) => void;
  onCancel: () => void;
}) => {
  const [destination, setDestination] = useState(data.destination || "");
  const [checkIn, setCheckIn] = useState(data.checkIn || "");
  const [checkOut, setCheckOut] = useState(data.checkOut || "");
  const [rooms, setRooms] = useState(data.rooms || 1);
  const [guests, setGuests] = useState(data.guests || 2);
  const [hotelType, setHotelType] = useState(data.hotelType || "standard");

  const handleSave = () => {
    onSave({
      destination,
      checkIn,
      checkOut,
      rooms,
      guests,
      hotelType,
    });
  };

  const canSave = destination && checkIn && checkOut && rooms > 0 && guests > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destino
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ej: París, Francia"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habitaciones
          </label>
          <input
            type="number"
            min="1"
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Huéspedes
          </label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de hotel
        </label>
        <select
          value={hotelType}
          onChange={(e) => setHotelType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="economy">Económico</option>
          <option value="standard">Estándar</option>
          <option value="comfort">Confort</option>
          <option value="luxury">Lujo</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              canSave
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

const EditCarForm = ({
  data,
  onSave,
  onCancel,
}: {
  data: CarModuleData;
  onSave: (data: Partial<CarModuleData>) => void;
  onCancel: () => void;
}) => {
  const [pickupLocation, setPickupLocation] = useState(
    data.pickupLocation || ""
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    data.dropoffLocation || ""
  );
  const [pickupDate, setPickupDate] = useState(data.pickupDate || "");
  const [dropoffDate, setDropoffDate] = useState(data.dropoffDate || "");
  const [carType, setCarType] = useState(data.carType || "economy");

  const handleSave = () => {
    onSave({
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      carType,
    });
  };

  const canSave =
    pickupLocation && dropoffLocation && pickupDate && dropoffDate;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lugar de recogida
          </label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Ej: Aeropuerto de París"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lugar de devolución
          </label>
          <input
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            placeholder="Ej: Aeropuerto de París"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de recogida
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de devolución
          </label>
          <input
            type="date"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            min={pickupDate}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de vehículo
        </label>
        <select
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="economy">Económico</option>
          <option value="compact">Compacto</option>
          <option value="midsize">Mediano</option>
          <option value="suv">SUV</option>
          <option value="luxury">Lujo</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              canSave
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

const EditActivitiesForm = ({
  data,
  onSave,
  onCancel,
}: {
  data: ActivitiesModuleData;
  onSave: (data: Partial<ActivitiesModuleData>) => void;
  onCancel: () => void;
}) => {
  const [citiesActivities, setCitiesActivities] = useState(
    data.citiesActivities || []
  );

  const activityOptions = [
    "Museo",
    "Tour guiado",
    "Gastronomía",
    "Vida nocturna",
    "Naturaleza",
    "Deportes",
    "Compras",
    "Teatro/Shows",
  ];

  const toggleInterest = (cityIndex: number, interest: string) => {
    setCitiesActivities((prev) => {
      const newCities = [...prev];
      const cityActivities = { ...newCities[cityIndex] };

      if (cityActivities.interests.includes(interest)) {
        cityActivities.interests = cityActivities.interests.filter(
          (i) => i !== interest
        );
      } else {
        cityActivities.interests = [...cityActivities.interests, interest];
      }

      newCities[cityIndex] = cityActivities;
      return newCities;
    });
  };

  const handleSave = () => {
    onSave({ citiesActivities });
  };

  const canSave = citiesActivities.some((city) => city.interests.length > 0);

  return (
    <div className="space-y-6">
      {citiesActivities.map((cityActivity, cityIndex) => (
        <div
          key={cityIndex}
          className="border-b border-gray-200 pb-6 last:border-0"
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            {cityActivity.city}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activityOptions.map((activity) => {
              const isSelected = cityActivity.interests.includes(activity);
              return (
                <label
                  key={activity}
                  className={`
                    flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleInterest(cityIndex, activity)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{activity}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              canSave
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

const EditFlightForm = ({
  data,
  onSave,
  onCancel,
}: {
  data: FlightModuleData;
  onSave: (data: Partial<FlightModuleData>) => void;
  onCancel: () => void;
}) => {
  const [segments, setSegments] = useState(data.segments || []);
  const [travelers, setTravelers] = useState(data.travelers || 1);
  const [cabinClass, setCabinClass] = useState(data.cabinClass || "economy");

  const updateSegment = (
    index: number,
    field: "from" | "to" | "date",
    value: string
  ) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setSegments(newSegments);
  };

  const handleSave = () => {
    onSave({
      segments,
      travelers,
      cabinClass,
    });
  };

  const canSave = segments.every((s) => s.from && s.to) && travelers > 0;

  return (
    <div className="space-y-6">
      {/* Segments */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Vuelos</h4>
        {segments.map((segment, index) => (
          <div key={segment.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desde
                </label>
                <input
                  type="text"
                  value={segment.from}
                  onChange={(e) => updateSegment(index, "from", e.target.value)}
                  placeholder="Ej: Nueva York"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hacia
                </label>
                <input
                  type="text"
                  value={segment.to}
                  onChange={(e) => updateSegment(index, "to", e.target.value)}
                  placeholder="Ej: París"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={segment.date || ""}
                onChange={(e) => updateSegment(index, "date", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Travelers & Cabin */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Viajeros
          </label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clase
          </label>
          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="economy">Económica</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">Primera Clase</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              canSave
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

// ========== COMPONENTES DE RESUMEN POR MÓDULO ==========

const FlightSummary = ({ data }: { data: FlightModuleData }) => {
  const getFlightTypeLabel = (type: FlightType | null) => {
    switch (type) {
      case FlightType.ONE_WAY:
        return "Solo ida";
      case FlightType.ROUND_TRIP:
        return "Ida y vuelta";
      case FlightType.MULTI_CITY:
        return "Varias ciudades";
      default:
        return "No especificado";
    }
  };

  const getCabinClassLabel = (cabinClass: string) => {
    const labels: { [key: string]: string } = {
      economy: "Económica",
      "premium-economy": "Económica Premium",
      business: "Business",
      first: "Primera Clase",
    };
    return labels[cabinClass] || cabinClass;
  };

  return (
    <div className="space-y-5">
      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Tipo de vuelo
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {getFlightTypeLabel(data.flightType)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">Viajeros</div>
          <div className="text-sm font-semibold text-gray-900">
            {data.travelers} persona{data.travelers > 1 ? "s" : ""}
          </div>
        </div>
        {data.cabinClass && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">Clase</div>
            <div className="text-sm font-semibold text-gray-900">
              {getCabinClassLabel(data.cabinClass)}
            </div>
          </div>
        )}
      </div>

      {/* Routes */}
      {data.segments && data.segments.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 font-medium mb-3">
            Itinerario
          </div>
          <div className="space-y-3">
            {data.segments.map((segment, idx) => (
              <div
                key={segment.id}
                className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-black text-white text-xs font-bold rounded-full">
                  {idx + 1}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Origen</div>
                    <div className="text-sm font-bold text-gray-900">
                      {segment.from}
                    </div>
                  </div>
                  <div className="text-gray-300">
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Destino</div>
                    <div className="text-sm font-bold text-gray-900">
                      {segment.to}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HotelSummary = ({ data }: { data: HotelModuleData }) => {
  const getHotelTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      economy: "Económico",
      standard: "Estándar",
      comfort: "Confort",
      luxury: "Lujo",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-5">
      {/* Destination */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-xs text-gray-500 font-medium mb-2">Destino</div>
        <div className="text-base font-bold text-gray-900">
          {data.destination}
        </div>
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">Check-in</div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.checkIn).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Check-out
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.checkOut).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Habitaciones
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {data.rooms} hab.
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Huéspedes
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {data.guests} persona{data.guests > 1 ? "s" : ""}
          </div>
        </div>
        {data.hotelType && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Categoría
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {getHotelTypeLabel(data.hotelType)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CarSummary = ({ data }: { data: CarModuleData }) => {
  const getCarTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      economy: "Económico",
      compact: "Compacto",
      midsize: "Mediano",
      suv: "SUV",
      luxury: "Lujo",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-5">
      {/* Locations */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-2">Recogida</div>
          <div className="text-sm font-semibold text-gray-900">
            {data.pickupLocation}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-2">
            Devolución
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {data.dropoffLocation}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Fecha recogida
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.pickupDate).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Fecha devolución
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {new Date(data.dropoffDate).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Car Type */}
      {data.carType && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Tipo de vehículo
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {getCarTypeLabel(data.carType)}
          </div>
        </div>
      )}
    </div>
  );
};

const ActivitiesSummary = ({ data }: { data: ActivitiesModuleData }) => {
  const availableInterests = [
    { id: "adventure", label: "Aventura", icon: "🏔️" },
    { id: "culture", label: "Cultura", icon: "🏛️" },
    { id: "food", label: "Gastronomía", icon: "🍽️" },
    { id: "nature", label: "Naturaleza", icon: "🌳" },
    { id: "nightlife", label: "Vida nocturna", icon: "🎉" },
    { id: "shopping", label: "Compras", icon: "🛍️" },
    { id: "sports", label: "Deportes", icon: "⚽" },
    { id: "relaxation", label: "Relajación", icon: "🧘" },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 font-medium mb-3">
        Actividades por ciudad
      </div>

      {data.citiesActivities && data.citiesActivities.length > 0 ? (
        <div className="space-y-4">
          {data.citiesActivities
            .filter((city) => city.interests.length > 0)
            .map((cityActivity, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-bold text-gray-900 mb-3">
                  📍 {cityActivity.city}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cityActivity.interests.map((interestId) => {
                    const interest = availableInterests.find(
                      (i) => i.id === interestId
                    );
                    return (
                      <span
                        key={interestId}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg"
                      >
                        <span>{interest?.icon}</span>
                        <span>{interest?.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
          No se han seleccionado actividades
        </div>
      )}
    </div>
  );
};

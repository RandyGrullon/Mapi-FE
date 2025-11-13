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
import { geminiService } from "@/services/gemini";
import {
  FlightSummary,
  HotelSummary,
  CarSummary,
  ActivitiesSummary,
  OptionalHotelForm,
  OptionalCarForm,
  OptionalActivitiesForm,
  EditHotelForm,
  EditCarForm,
  EditActivitiesForm,
  EditFlightForm,
  buildPackageFromModules,
} from "./summary";

export const SummaryView = () => {
  const {
    activeModules,
    selectedServices,
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

  // Estado para el loading de búsqueda
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<string>("");

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

  // Función para buscar opciones con Gemini AI
  const handleSearchOptions = async () => {
    setIsSearching(true);

    try {
      // Etapa 1: Preparando búsqueda
      setSearchStage("Preparando búsqueda...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Etapa 2: Construir parámetros desde los módulos
      setSearchStage("🤖 Analizando tus preferencias...");

      // Extraer datos de los módulos
      const flightModule = activeModules.find(
        (m) => m.type === ServiceType.FLIGHTS
      );
      const hotelModule = activeModules.find(
        (m) => m.type === ServiceType.HOTEL
      );
      const activitiesModule = activeModules.find(
        (m) => m.type === ServiceType.ACTIVITIES
      );

      // Construir parámetros para Gemini
      let origin = "";
      let destination = "";
      let startDate = "";
      let endDate = "";
      let travelers = 1;
      let flightType: "one-way" | "round-trip" | "multi-city" | undefined;
      let flightSegments: Array<{ from: string; to: string; date?: string }> =
        [];

      if (flightModule?.data) {
        const flightData = flightModule.data as FlightModuleData;

        // Obtener tipo de vuelo
        if (flightData.flightType === FlightType.ONE_WAY) {
          flightType = "one-way";
        } else if (flightData.flightType === FlightType.ROUND_TRIP) {
          flightType = "round-trip";
        } else if (flightData.flightType === FlightType.MULTI_CITY) {
          flightType = "multi-city";
        }

        // Obtener segmentos de vuelo
        if (flightData.segments && flightData.segments.length > 0) {
          flightSegments = flightData.segments.map((seg) => ({
            from: seg.from || "",
            to: seg.to || "",
            date: seg.date,
          }));

          // Para origin y destination, usar siempre el primer segmento
          origin = flightData.segments[0].from || "";
          destination = flightData.segments[0].to || "";
          startDate = flightData.segments[0].date || "";

          // Si es round trip, obtener fecha de regreso del segundo segmento
          if (
            flightData.flightType === FlightType.ROUND_TRIP &&
            flightData.segments.length > 1
          ) {
            endDate = flightData.segments[1].date || "";
          }

          // Si es multi-city, el destination es el último destino
          if (flightData.flightType === FlightType.MULTI_CITY) {
            destination =
              flightData.segments[flightData.segments.length - 1].to || "";
          }
        }
        travelers = flightData.travelers || 1;
      }

      if (hotelModule?.data) {
        const hotelData = hotelModule.data as HotelModuleData;
        if (!destination) destination = hotelData.destination || "";
        if (!startDate) startDate = hotelData.checkIn || "";
        if (!endDate) endDate = hotelData.checkOut || "";
      }

      // Actividades de interés
      let activities: string[] = [];
      if (activitiesModule?.data) {
        const activitiesData = activitiesModule.data as ActivitiesModuleData;
        if (
          activitiesData.citiesActivities &&
          activitiesData.citiesActivities.length > 0
        ) {
          activities = activitiesData.citiesActivities.flatMap(
            (ca) => ca.interests || []
          );
        }
      }

      const searchParams = {
        origin: origin || "No especificado",
        destination: destination || "No especificado",
        startDate: startDate || new Date().toISOString().split("T")[0],
        endDate:
          endDate ||
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        travelers: travelers,
        flightPreference:
          (flightModule?.data as FlightModuleData)?.cabinClass || "Economy",
        accommodationType:
          (hotelModule?.data as HotelModuleData)?.hotelType || "any",
        activities: activities,
        budget: "Moderado ($1,000 - $3,000 USD)",
        selectedServices: selectedServices, // Pasar los servicios seleccionados
        flightType: flightType, // Pasar el tipo de vuelo
        flightSegments: flightSegments, // Pasar los segmentos de vuelo
      };

      console.log(
        "🔍 Iniciando búsqueda con Gemini AI (Modular):",
        searchParams
      );

      // Etapa 3: Consultando Gemini AI
      setSearchStage("🤖 Consultando inteligencia artificial...");
      const searchResults = await geminiService.searchTravelOptions(
        searchParams
      );

      console.log("✅ Resultados obtenidos de Gemini:", searchResults);

      // Etapa 4: Procesando resultados
      setSearchStage("✨ Procesando las mejores opciones...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Guardar los resultados en sessionStorage
      sessionStorage.setItem(
        "geminiSearchResults",
        JSON.stringify(searchResults)
      );

      // También guardar los datos del wizard modular incluyendo tipo de vuelo
      const selectedPackage = buildPackageFromModules(activeModules);
      sessionStorage.setItem(
        "selectedPackage",
        JSON.stringify(selectedPackage)
      );
      sessionStorage.setItem("wizardData", JSON.stringify(activeModules));

      // Guardar información del tipo de vuelo y segmentos para el page de packages
      sessionStorage.setItem("flightType", flightType || "round-trip");
      sessionStorage.setItem("flightSegments", JSON.stringify(flightSegments));

      // Etapa 5: Finalizando
      setSearchStage("✓ ¡Listo! Redirigiendo...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navegar a la página de paquetes
      router.push("/packages");
    } catch (error) {
      console.error("❌ Error en la búsqueda:", error);

      // Mostrar error al usuario
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudieron obtener opciones de viaje. Por favor, intenta de nuevo.";

      setSearchStage(`❌ ${errorMessage}`);

      // Esperar para que el usuario vea el error
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // NO navegar, mantener al usuario en el wizard para que pueda intentar de nuevo
    } finally {
      setIsSearching(false);
      setSearchStage("");
    }
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
        <p className="text-lg text-gray-500 mb-4">
          Revisa los detalles de tu viaje antes de buscar opciones
        </p>

        {/* Botón volver a editar */}
        <button
          onClick={() => {
            // Volver al último módulo
            if (activeModules.length > 0) {
              goToModule(activeModules.length - 1);
            }
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
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
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Volver a editar
        </button>
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
          disabled={isSearching}
          className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Empezar de nuevo
        </button>
        <button
          onClick={handleSearchOptions}
          disabled={isSearching}
          className="flex-1 px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSearching ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{searchStage || "Buscando opciones..."}</span>
            </>
          ) : (
            <>
              <span>Buscar opciones</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

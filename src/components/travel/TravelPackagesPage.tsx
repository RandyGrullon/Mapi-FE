"use client";

import { useState, useEffect } from "react";
import { TravelInfo } from "../wizard/WizardProvider";
import { useNavigation } from "../navigation/NavigationContext";
import { CompletedTripsManager } from "../trips/trip-management/CompletedTripsManager";
import { Toast, ToastType } from "../ui/Toast";
import { useTravelSelections } from "./useTravelSelections";
import { useDraftStore } from "@/stores/draftStore";
import { useWizardStore } from "@/stores/wizardStore";
import { TravelHeader } from "../ui/TravelHeader";
import { CustomPackageFooter } from "./CustomPackageFooter";
import { PackagesView } from "../views/PackagesView";
import { FlightsView } from "../views/FlightsView";
import { HotelsView } from "../views/HotelsView";
import { CarsView } from "../views/CarsView";
import { ActivitiesView } from "../views/ActivitiesView";
import {
  TravelPackage,
  Flight,
  Hotel,
  CarRental,
  Activity,
} from "@/types/travel";
import { TravelSearchResult } from "@/services/gemini";
import { ServiceType } from "@/types/wizard";

interface TravelPackagesPageProps {
  travelInfo: TravelInfo;
}

export const TravelPackagesPage = ({ travelInfo }: TravelPackagesPageProps) => {
  const { navigateToWizard, navigateToTripDetail } = useNavigation();
  const { currentDraftId, deleteDraft, clearCurrentDraft } = useDraftStore();
  const { selectedServices, resetWizard } = useWizardStore(); // Obtener servicios seleccionados

  // Convertir selectedServices (ServiceType[]) a string[] para los hooks
  const selectedServicesAsStrings = selectedServices.map((s) => s.toString());

  // Estados para tipo de vuelo y segmentos
  const [flightType, setFlightType] = useState<
    "one-way" | "round-trip" | "multi-city"
  >("round-trip");
  const [flightSegments, setFlightSegments] = useState<
    Array<{ from: string; to: string; date?: string }>
  >([]);

  // Calcular número de segmentos requeridos
  const numberOfSegments =
    flightType === "one-way"
      ? 1
      : flightType === "round-trip"
      ? 2
      : flightSegments.length || 1;

  const {
    selectedTab,
    setSelectedTab,
    selectedFlight,
    selectedFlights, // Agregar array de vuelos
    selectedHotel,
    selectedCar,
    selectedActivities,
    handleSelectFlight,
    handleSelectFlightForSegment, // Agregar función para segmentos
    handleSelectHotel,
    handleSelectCar,
    handleSelectActivity,
    hasValidSelection,
    getValidationMessage, // Obtener mensaje dinámico
  } = useTravelSelections({
    selectedServices: selectedServicesAsStrings,
    flightType,
    numberOfSegments,
  }); // Pasar selectedServices, flightType y numberOfSegments al hook

  // Estados para los datos de Gemini
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cars, setCars] = useState<CarRental[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);

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

  // Cargar resultados de Gemini al montar el componente
  useEffect(() => {
    const loadGeminiResults = () => {
      try {
        setIsLoading(true);
        const resultsStr = sessionStorage.getItem("geminiSearchResults");

        // Cargar tipo de vuelo y segmentos
        const storedFlightType = sessionStorage.getItem("flightType") as
          | "one-way"
          | "round-trip"
          | "multi-city"
          | null;
        const storedSegments = sessionStorage.getItem("flightSegments");

        if (storedFlightType) {
          setFlightType(storedFlightType);
        }

        if (storedSegments) {
          try {
            const segments = JSON.parse(storedSegments);
            setFlightSegments(segments);
          } catch (e) {
            console.error("Error parsing flight segments:", e);
          }
        }

        if (resultsStr) {
          const results: TravelSearchResult = JSON.parse(resultsStr);
          console.log("📦 Cargando resultados de Gemini:", results);
          console.log("✈️ Tipo de vuelo:", storedFlightType);
          console.log("🗺️ Segmentos:", storedSegments);

          // Convertir los resultados de Gemini al formato de la app
          const formattedFlights: Flight[] = results.flights.map((f, idx) => ({
            id: `flight-${idx}`,
            airline: f.airline,
            flightNumber: f.flightNumber,
            departure: f.departure, // Ciudad de origen
            arrival: f.arrival, // Ciudad de destino
            origin: f.origin || f.departure, // Alias para mayor claridad
            destination: f.destination || f.arrival, // Alias para mayor claridad
            departureTime: f.departureTime, // Hora de salida
            arrivalTime: f.arrivalTime, // Hora de llegada
            departureDate: f.departureDate, // Fecha de salida
            arrivalDate: f.arrivalDate, // Fecha de llegada
            duration: f.duration,
            price: f.price,
            stops: f.stops,
            class: f.class,
            bookingUrl: f.bookingUrl,
            segmentIndex: f.segmentIndex, // Preservar el índice del segmento
            segmentType: f.segmentType, // Preservar el tipo de segmento
          }));

          const formattedHotels: Hotel[] = results.hotels.map((h, idx) => ({
            id: `hotel-${idx}`,
            name: h.name,
            stars: h.stars,
            location: h.location,
            amenities: h.amenities,
            pricePerNight: h.pricePerNight,
            rating: h.rating,
            reviews: h.reviews,
          }));

          const formattedCars: CarRental[] = results.carRentals.map(
            (c, idx) => ({
              id: `car-${idx}`,
              company: c.company,
              carType: c.carType,
              carModel: c.carModel,
              transmission: c.transmission,
              seats: c.seats,
              pricePerDay: c.pricePerDay,
              totalDays: c.totalDays,
              totalPrice: c.totalPrice,
              features: c.features,
              rating: c.rating,
            })
          );

          const formattedActivities: Activity[] = results.activities.map(
            (a, idx) => ({
              id: `activity-${idx}`,
              name: a.name,
              category: a.category,
              duration: a.duration,
              price: a.price,
              rating: a.rating,
              included: a.included,
            })
          );

          // Crear paquetes combinados (opcional)
          const createdPackages: TravelPackage[] = [];

          // Paquete recomendado (mejor valorados)
          if (formattedFlights.length > 0 && formattedHotels.length > 0) {
            const bestFlight = formattedFlights[0];
            const bestHotel = formattedHotels[0];
            const duration = parseInt(travelInfo.duration) || 5;

            createdPackages.push({
              id: "package-recommended",
              name: "Paquete Recomendado",
              description:
                results.summary || "Las mejores opciones para tu viaje",
              flight: bestFlight,
              hotel: bestHotel,
              carRental: formattedCars[0],
              activities: formattedActivities.slice(0, 3),
              totalPrice:
                bestFlight.price +
                bestHotel.pricePerNight * duration +
                (formattedCars[0]?.totalPrice || 0),
              savings: 150,
              recommended: true,
              benefits: results.benefits || {
                cancellation: "Cancelación gratuita hasta 48h antes",
                payment: "Pago en cuotas sin interés",
                support: "Soporte 24/7 durante el viaje",
              },
            });
          }

          // Paquete económico
          if (formattedFlights.length > 1 && formattedHotels.length > 1) {
            const economicFlight = formattedFlights.reduce((prev, curr) =>
              curr.price < prev.price ? curr : prev
            );
            const economicHotel = formattedHotels.reduce((prev, curr) =>
              curr.pricePerNight < prev.pricePerNight ? curr : prev
            );
            const duration = parseInt(travelInfo.duration) || 5;

            createdPackages.push({
              id: "package-economic",
              name: "Paquete Económico",
              description: "La mejor relación calidad-precio",
              flight: economicFlight,
              hotel: economicHotel,
              activities: formattedActivities.slice(0, 2),
              totalPrice:
                economicFlight.price + economicHotel.pricePerNight * duration,
              savings: 100,
              benefits: results.benefits || {
                cancellation: "Cancelación gratuita hasta 48h antes",
                payment: "Pago en cuotas sin interés",
                support: "Soporte 24/7 durante el viaje",
              },
            });
          }

          // Paquete premium
          if (formattedFlights.length > 2 && formattedHotels.length > 2) {
            const premiumFlight = formattedFlights.reduce((prev, curr) =>
              curr.price > prev.price ? curr : prev
            );
            const premiumHotel = formattedHotels.reduce((prev, curr) =>
              curr.pricePerNight > prev.pricePerNight ? curr : prev
            );
            const duration = parseInt(travelInfo.duration) || 5;

            createdPackages.push({
              id: "package-premium",
              name: "Paquete Premium",
              description: "Experiencia de lujo completa",
              flight: premiumFlight,
              hotel: premiumHotel,
              carRental: formattedCars[1] || formattedCars[0],
              activities: formattedActivities,
              totalPrice:
                premiumFlight.price +
                premiumHotel.pricePerNight * duration +
                (formattedCars[1]?.totalPrice ||
                  formattedCars[0]?.totalPrice ||
                  0),
              savings: 200,
              benefits: results.benefits || {
                cancellation: "Cancelación gratuita hasta 48h antes",
                payment: "Pago en cuotas sin interés",
                support: "Soporte 24/7 durante el viaje",
              },
            });
          }

          setFlights(formattedFlights);
          setHotels(formattedHotels);
          setCars(formattedCars);
          setActivities(formattedActivities);
          setPackages(createdPackages);

          console.log("✅ Datos cargados:", {
            flights: formattedFlights.length,
            hotels: formattedHotels.length,
            cars: formattedCars.length,
            activities: formattedActivities.length,
            packages: createdPackages.length,
          });

          if (formattedFlights.length > 0 || formattedHotels.length > 0) {
            const totalOptions =
              formattedFlights.length +
              formattedHotels.length +
              formattedActivities.length;
            showToast(`¡${totalOptions} opciones encontradas!`, "success");
          }
        } else {
          console.warn(
            "⚠️ No se encontraron resultados de Gemini en sessionStorage"
          );
          // No mostrar toast negativo, simplemente no cargar nada
          // El usuario verá las vistas vacías con sus mensajes correspondientes
        }
      } catch (error) {
        console.error("❌ Error al cargar resultados:", error);
        showToast("Error al cargar las opciones", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadGeminiResults();
  }, []);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSelectPackage = (pkg: TravelPackage) => {
    console.log("📦 Seleccionando paquete:", pkg);

    // Crear viaje desde el paquete seleccionado con sus datos específicos
    const trip = CompletedTripsManager.createTripFromPackage(travelInfo, {
      name: pkg.name,
      flight: pkg.flight,
      hotel: pkg.hotel,
      carRental: pkg.carRental,
      activities: pkg.activities,
    });

    CompletedTripsManager.saveTrip(trip);
    console.log("✅ Viaje creado desde paquete:", trip);

    // Eliminar el draft actual ya que se creó un viaje
    if (currentDraftId) {
      deleteDraft(currentDraftId);
      clearCurrentDraft();
      console.log("🗑️ Draft eliminado:", currentDraftId);
    }

    // Resetear el wizard para la próxima vez
    resetWizard();

    showToast(
      "¡Paquete reservado exitosamente! Preparando tu viaje...",
      "success"
    );

    setTimeout(() => {
      navigateToTripDetail(trip);
    }, 1500);
  };

  const createCustomPackage = () => {
    console.log("🎯 Iniciando creación de paquete personalizado");
    console.log("📊 Estado de validación:", {
      hasValidSelection,
      flightType,
      selectedFlight,
      selectedFlights,
      selectedHotel,
      selectedCar,
      selectedActivities,
    });

    if (!hasValidSelection) {
      const message = getValidationMessage();
      console.log("❌ Validación fallida:", message);
      showToast(message, "warning");
      return;
    }

    if (isCreatingPackage) {
      console.log("⏳ Ya se está creando un paquete...");
      return;
    }

    setIsCreatingPackage(true);

    // Obtener vuelos seleccionados según el tipo
    let selectedFlightData: Flight | undefined;
    let selectedFlightsData: Flight[] = [];

    if (flightType === "one-way") {
      // Solo ida: usar selectedFlight
      selectedFlightData = flights.find((f) => f.id === selectedFlight);
      if (selectedFlightData) {
        selectedFlightsData = [selectedFlightData];
      }
      console.log("✈️ Vuelo de ida seleccionado:", selectedFlightData);
    } else {
      // Ida y vuelta o multi-ciudad: usar selectedFlights array
      selectedFlightsData = selectedFlights
        .filter((id) => id != null && id !== "")
        .map((id) => flights.find((f) => f.id === id))
        .filter((f): f is Flight => f !== undefined);

      // Para compatibilidad, usar el primer vuelo como "flight principal"
      selectedFlightData = selectedFlightsData[0];
      console.log(
        `✈️ Vuelos seleccionados (${flightType}):`,
        selectedFlightsData
      );
    }

    const hotel = hotels.find((h) => h.id === selectedHotel);
    const car = selectedCar
      ? cars.find((c) => c.id === selectedCar)
      : undefined;
    const selectedActivitiesList = activities.filter((a) =>
      selectedActivities.includes(a.id)
    );

    console.log("🏨 Hotel seleccionado:", hotel);
    console.log("🚗 Auto seleccionado:", car);
    console.log("🎯 Actividades seleccionadas:", selectedActivitiesList);

    // Validar que los servicios seleccionados existan (solo si fueron requeridos)
    // Convertir a string para comparación
    const servicesAsStrings = selectedServices.map((s) => s.toString());
    const needsFlight = servicesAsStrings.includes("flights");
    const needsHotel = servicesAsStrings.includes("hotel");

    if (
      (needsFlight && selectedFlightsData.length === 0) ||
      (needsHotel && !hotel)
    ) {
      console.log("❌ Error: Servicio requerido no encontrado");
      showToast("Error al cargar la selección", "error");
      setIsCreatingPackage(false);
      return;
    }

    try {
      console.log("📦 Creando viaje con selecciones personalizadas");

      // Crear el viaje personalizado con las selecciones específicas
      const trip = CompletedTripsManager.createTripFromCustomSelections(
        travelInfo,
        {
          flights: selectedFlightsData,
          hotel: hotel,
          carRental: car,
          activities: selectedActivitiesList,
        }
      );

      CompletedTripsManager.saveTrip(trip);

      console.log("✅ Viaje creado exitosamente:", trip);

      // Eliminar el draft actual ya que se creó un viaje personalizado
      if (currentDraftId) {
        deleteDraft(currentDraftId);
        clearCurrentDraft();
        console.log("🗑️ Draft eliminado:", currentDraftId);
      }

      // Resetear el wizard para la próxima vez
      resetWizard();

      const flightsText =
        flightType === "one-way"
          ? "1 vuelo de ida"
          : flightType === "round-trip"
          ? "vuelos de ida y vuelta"
          : `${selectedFlightsData.length} vuelos`;

      const activitiesText =
        selectedActivitiesList.length > 0
          ? ` y ${selectedActivitiesList.length} actividad(es)`
          : "";

      showToast(
        `¡Paquete personalizado creado con ${flightsText}${activitiesText}!`,
        "success"
      );

      console.log("🚀 Navegando a detalle del viaje...");
      setTimeout(() => {
        setIsCreatingPackage(false);
        navigateToTripDetail(trip);
      }, 1500);
    } catch (error) {
      console.error("❌ Error al crear el paquete:", error);
      showToast("Error al crear el paquete personalizado", "error");
      setIsCreatingPackage(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <TravelHeader
        travelInfo={travelInfo}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onNavigateBack={navigateToWizard}
        selectedServices={selectedServicesAsStrings} // Pasar servicios como strings
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cargando opciones...
            </h3>
            <p className="text-gray-600">
              Procesando los mejores resultados para tu viaje
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
              {selectedTab === "packages" && (
                <PackagesView
                  packages={packages}
                  onSelect={handleSelectPackage}
                />
              )}
              {selectedTab === "flights" && (
                <FlightsView
                  flights={flights}
                  selected={selectedFlight}
                  onToggle={handleSelectFlight}
                  flightType={flightType}
                  flightSegments={flightSegments}
                  selectedFlights={selectedFlights}
                  onSelectForSegment={handleSelectFlightForSegment}
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
              {selectedTab === "cars" && (
                <CarsView
                  cars={cars}
                  selected={selectedCar}
                  onToggle={handleSelectCar}
                  days={parseInt(travelInfo.duration) || 5}
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
            <CustomPackageFooter
              selectedFlight={selectedFlight}
              selectedFlights={selectedFlights}
              selectedHotel={selectedHotel}
              selectedCar={selectedCar}
              selectedActivities={selectedActivities}
              selectedServices={selectedServicesAsStrings} // Pasar servicios como strings
              hasValidSelection={hasValidSelection} // Pasar validación calculada
              isCreating={isCreatingPackage} // Pasar estado de carga
              onCreatePackage={createCustomPackage}
            />
          )}
        </>
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

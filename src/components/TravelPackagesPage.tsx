"use client";

import { useState } from "react";
import { TravelInfo } from "./WizardProvider";
import { useNavigation } from "./NavigationContext";
import { CompletedTripsManager } from "./CompletedTripsManager";
import { DraftManager } from "./DraftManager";
import { Toast, ToastType } from "./Toast";
import { useTravelSelections } from "./useTravelSelections";
import { TravelHeader } from "./TravelHeader";
import { CustomPackageFooter } from "./CustomPackageFooter";
import { PackagesView } from "./PackagesView";
import { FlightsView } from "./FlightsView";
import { HotelsView } from "./HotelsView";
import { ActivitiesView } from "./ActivitiesView";
import {
  generatePackages,
  generateFlights,
  generateHotels,
  generateActivities,
  TravelPackage,
} from "./travel-data";

interface TravelPackagesPageProps {
  travelInfo: TravelInfo;
}

export const TravelPackagesPage = ({ travelInfo }: TravelPackagesPageProps) => {
  const { navigateToWizard, navigateToTripDetail } = useNavigation();
  const {
    selectedTab,
    setSelectedTab,
    selectedFlight,
    selectedHotel,
    selectedActivities,
    handleSelectFlight,
    handleSelectHotel,
    handleSelectActivity,
    hasValidSelection,
  } = useTravelSelections();

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

  const packages = generatePackages(travelInfo);
  const flights = generateFlights(travelInfo);
  const hotels = generateHotels(travelInfo);
  const activities = generateActivities(travelInfo);

  const handleSelectPackage = (pkg: TravelPackage) => {
    const demoTrip = CompletedTripsManager.createDemoTrip(travelInfo);
    CompletedTripsManager.saveTrip(demoTrip);

    // Eliminar el draft correspondiente si existe
    const currentDraftId = localStorage.getItem("currentDraftId");
    if (currentDraftId) {
      DraftManager.deleteDraft(currentDraftId);
      localStorage.removeItem("currentDraftId");
    }

    showToast(
      "¡Paquete reservado exitosamente! Preparando tu viaje...",
      "success"
    );
    setTimeout(() => {
      navigateToTripDetail(demoTrip);
    }, 1500);
  };

  const createCustomPackage = () => {
    if (!hasValidSelection) {
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

    // Eliminar el draft correspondiente si existe
    const currentDraftId = localStorage.getItem("currentDraftId");
    if (currentDraftId) {
      DraftManager.deleteDraft(currentDraftId);
      localStorage.removeItem("currentDraftId");
    }

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
      <TravelHeader
        travelInfo={travelInfo}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onNavigateBack={navigateToWizard}
      />

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
        <CustomPackageFooter
          selectedFlight={selectedFlight}
          selectedHotel={selectedHotel}
          selectedActivities={selectedActivities}
          onCreatePackage={createCustomPackage}
        />
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

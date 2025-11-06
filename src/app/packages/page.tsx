"use client";

import { useState, useEffect } from "react";
import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TravelPackagesPage } from "@/components/travel/TravelPackagesPage";

// Función para convertir los datos del wizard al formato esperado por TravelPackagesPage
function convertWizardDataToTravelInfo(packageData: any, wizardModules: any) {
  // Validar que wizardModules sea un array
  if (!Array.isArray(wizardModules)) {
    return null;
  }

  const flightModule = wizardModules.find(
    (m: any) => m.type === "flights"
  )?.data;
  const hotelModule = wizardModules.find((m: any) => m.type === "hotel")?.data;
  const activitiesModule = wizardModules.find(
    (m: any) => m.type === "activities"
  )?.data;

  // Extraer origen y destino del vuelo si existe
  let origin = "Madrid";
  let destination = "Barcelona";
  let startDate = new Date().toISOString().split("T")[0];
  let endDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  if (flightModule) {
    // Verificar que routes exista y sea un array
    const routes = Array.isArray(flightModule.routes)
      ? flightModule.routes
      : [];

    if (routes.length > 0) {
      if (flightModule.flightType === "one-way") {
        origin = routes[0]?.from || origin;
        destination = routes[0]?.to || destination;
      } else if (flightModule.flightType === "round-trip") {
        origin = routes[0]?.from || origin;
        destination = routes[0]?.to || destination;
      } else if (flightModule.flightType === "multi-city") {
        origin = routes[0]?.from || origin;
        destination = routes[routes.length - 1]?.to || destination;
      }
    }

    if (flightModule.departureDate) startDate = flightModule.departureDate;
    if (flightModule.returnDate) endDate = flightModule.returnDate;
  }

  // Calcular duración en días
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  ).toString();

  return {
    origin,
    destination,
    startDate,
    endDate,
    travelers: flightModule?.passengers || 2,
    flightPreference:
      flightModule?.cabinClass === "first"
        ? "Lujo (Primera clase)"
        : flightModule?.cabinClass === "business"
        ? "Confort (Clase business)"
        : "Económico (más barato)",
    accommodationType:
      hotelModule?.roomType === "suite"
        ? "Hotel de lujo (5 estrellas)"
        : hotelModule?.roomType === "deluxe"
        ? "Hotel confort (4 estrellas)"
        : "Hotel básico (3 estrellas)",
    activities: activitiesModule?.selectedActivities || [],
    budget: "Moderado ($1,000 - $3,000 USD)",
    organizedActivities:
      (activitiesModule?.selectedActivities?.length || 0) > 0,
    duration,
  };
}

const PackagesPageLayout = () => {
  const [packageData, setPackageData] = useState<any>(null);
  const [travelInfo, setTravelInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Asegurarse de que estamos en el cliente
    if (typeof window === "undefined") return;

    try {
      // Leer datos del wizard desde sessionStorage
      const savedPackage = sessionStorage.getItem("selectedPackage");
      const savedWizardData = sessionStorage.getItem("wizardData");

      if (savedPackage && savedWizardData) {
        const pkg = JSON.parse(savedPackage);
        const wizardData = JSON.parse(savedWizardData);

        setPackageData(pkg);

        // Convertir los datos del wizard al formato que espera TravelPackagesPage
        const convertedTravelInfo = convertWizardDataToTravelInfo(
          pkg,
          wizardData
        );

        // Si la conversión falla, usar datos demo
        if (convertedTravelInfo) {
          setTravelInfo(convertedTravelInfo);
        } else {
          setTravelInfo({
            origin: "Madrid",
            destination: "Barcelona",
            startDate: "2025-11-15",
            endDate: "2025-11-20",
            travelers: 2,
            flightPreference: "Económico (más barato)",
            accommodationType: "Hotel confort (4 estrellas)",
            activities: ["Cultura e historia", "Gastronomía y restaurantes"],
            budget: "Moderado ($1,000 - $3,000 USD)",
            organizedActivities: false,
            duration: "5",
          });
        }
      } else {
        // Datos demo si no hay datos del wizard
        setTravelInfo({
          origin: "Madrid",
          destination: "Barcelona",
          startDate: "2025-11-15",
          endDate: "2025-11-20",
          travelers: 2,
          flightPreference: "Económico (más barato)",
          accommodationType: "Hotel confort (4 estrellas)",
          activities: ["Cultura e historia", "Gastronomía y restaurantes"],
          budget: "Moderado ($1,000 - $3,000 USD)",
          organizedActivities: false,
          duration: "5",
        });
      }
    } catch (error) {
      // Usar datos demo en caso de error
      setTravelInfo({
        origin: "Madrid",
        destination: "Barcelona",
        startDate: "2025-11-15",
        endDate: "2025-11-20",
        travelers: 2,
        flightPreference: "Económico (más barato)",
        accommodationType: "Hotel confort (4 estrellas)",
        activities: ["Cultura e historia", "Gastronomía y restaurantes"],
        budget: "Moderado ($1,000 - $3,000 USD)",
        organizedActivities: false,
        duration: "5",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading || !travelInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TravelPackagesPage travelInfo={travelInfo} />
      </div>
    </div>
  );
};

export default function PackagesPage() {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <PackagesPageLayout />
      </SidebarProvider>
    </NavigationProvider>
  );
}

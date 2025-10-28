"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TripDetailPage } from "@/components/trips/TripDetailPage";
import {
  CompletedTripsManager,
  CompletedTrip,
} from "@/components/trips/CompletedTripsManager";
import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { WizardProvider } from "@/components/wizard/WizardProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { Sidebar } from "@/components/sidebar/Sidebar";

const TripPageContent = () => {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<CompletedTrip | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const tripData = CompletedTripsManager.getTrip(tripId);
    setTrip(tripData);
  }, [tripId]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando viaje...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Viaje no encontrado
          </h1>
          <p className="text-gray-600">
            El viaje que buscas no existe o ha sido eliminado.
          </p>
        </div>
      </div>
    );
  }

  return <TripDetailPage trip={trip} />;
};

const TripPageLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TripPageContent />
      </div>
    </div>
  );
};

export default function TripPage() {
  return (
    <NavigationProvider>
      <WizardProvider>
        <SidebarProvider>
          <TripPageLayout />
        </SidebarProvider>
      </WizardProvider>
    </NavigationProvider>
  );
}

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { CompletedTrip } from "../trips/CompletedTripsManager";
import { CompletedTripsManager } from "../trips/CompletedTripsManager";
import { TravelInfo } from "../wizard/WizardProvider";

type ViewType = "home" | "wizard" | "trip-detail" | "packages" | "drafts";

interface NavigationContextType {
  currentView: ViewType;
  selectedTrip: CompletedTrip | null;
  travelInfo: TravelInfo | null;
  navigateToHome: () => void;
  navigateToWizard: () => void;
  navigateToDrafts: () => void;
  navigateToTripDetail: (trip: CompletedTrip) => void;
  navigateToPackages: (info: TravelInfo) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTrip, setSelectedTrip] = useState<CompletedTrip | null>(null);
  const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);

  // Determinar la vista actual basada en la URL
  const getCurrentView = (): ViewType => {
    if (pathname === "/") return "home";
    if (pathname === "/plan") return "wizard";
    if (pathname === "/drafts") return "drafts";
    if (pathname.startsWith("/trip/")) return "trip-detail";
    if (pathname === "/packages") return "packages";
    return "home";
  };

  const currentView = getCurrentView();

  // Actualizar selectedTrip cuando estamos en una página de viaje
  useEffect(() => {
    if (currentView === "trip-detail" && pathname.startsWith("/trip/")) {
      const tripId = pathname.split("/trip/")[1];
      if (tripId) {
        const trip = CompletedTripsManager.getTrip(tripId);
        setSelectedTrip(trip || null);
      }
    } else {
      setSelectedTrip(null);
    }
  }, [pathname, currentView]);

  const navigateToHome = () => {
    router.push("/");
    setSelectedTrip(null);
    setTravelInfo(null);
  };

  const navigateToWizard = () => {
    router.push("/plan");
    setSelectedTrip(null);
    setTravelInfo(null);
  };

  const navigateToDrafts = () => {
    router.push("/drafts");
    setSelectedTrip(null);
    setTravelInfo(null);
  };

  const navigateToTripDetail = (trip: CompletedTrip) => {
    router.push(`/trip/${trip.id}`);
    setSelectedTrip(trip);
  };

  const navigateToPackages = (info: TravelInfo) => {
    setTravelInfo(info);
    router.push("/packages");
  };

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        selectedTrip,
        travelInfo,
        navigateToHome,
        navigateToWizard,
        navigateToDrafts,
        navigateToTripDetail,
        navigateToPackages,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

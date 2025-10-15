"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CompletedTrip } from "./CompletedTripsManager";
import { TravelInfo } from "./WizardProvider";

type ViewType = "wizard" | "trip-detail" | "packages";

interface NavigationContextType {
  currentView: ViewType;
  selectedTrip: CompletedTrip | null;
  travelInfo: TravelInfo | null;
  navigateToWizard: () => void;
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
  const [currentView, setCurrentView] = useState<ViewType>("wizard");
  const [selectedTrip, setSelectedTrip] = useState<CompletedTrip | null>(null);
  const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);

  const navigateToWizard = () => {
    setCurrentView("wizard");
    setSelectedTrip(null);
    setTravelInfo(null);
  };

  const navigateToTripDetail = (trip: CompletedTrip) => {
    setSelectedTrip(trip);
    setCurrentView("trip-detail");
  };

  const navigateToPackages = (info: TravelInfo) => {
    setTravelInfo(info);
    setCurrentView("packages");
  };

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        selectedTrip,
        travelInfo,
        navigateToWizard,
        navigateToTripDetail,
        navigateToPackages,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

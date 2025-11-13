"use client";

import { useState } from "react";
import { CompletedTrip } from "@/types/trip";
import { TripDetailHeader } from "./TripDetailHeader";
import { TabNavigation } from "./TabNavigation";
import {
  OverviewTab,
  FlightsTab,
  HotelTab,
  ActivitiesTab,
  ItineraryTab,
  BudgetTab,
} from "./tabs";

interface TripDetailViewProps {
  trip: CompletedTrip;
  onClose: () => void;
}

type TabType =
  | "overview"
  | "flights"
  | "hotel"
  | "car"
  | "activities"
  | "itinerary"
  | "budget";

export const TripDetailView = ({ trip, onClose }: TripDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isClient, setIsClient] = useState(false);

  // Para detectar si estamos en el cliente
  useState(() => {
    setIsClient(true);
  });

  const openGoogleMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );
  };

  const tabs = [
    { id: "overview", label: "Resumen", icon: "📋" },
    { id: "flights", label: "Vuelos", icon: "✈️" },
    { id: "hotel", label: "Hotel", icon: "🏨" },
    { id: "activities", label: "Actividades", icon: "🎯" },
    { id: "itinerary", label: "Itinerario", icon: "📅" },
    { id: "budget", label: "Presupuesto", icon: "💰" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            trip={trip}
            openGoogleMaps={openGoogleMaps}
            setActiveTab={setActiveTab}
          />
        );
      case "flights":
        return (
          <FlightsTab trip={trip} status={trip.status} isClient={isClient} />
        );
      case "hotel":
        return (
          <HotelTab
            trip={trip}
            status={trip.status}
            openGoogleMaps={openGoogleMaps}
            isClient={isClient}
          />
        );
      case "activities":
        return (
          <ActivitiesTab
            trip={trip}
            status={trip.status}
            openGoogleMaps={openGoogleMaps}
            isClient={isClient}
          />
        );
      case "itinerary":
        return <ItineraryTab trip={trip} />;
      case "budget":
        return <BudgetTab trip={trip} />;
      default:
        return (
          <OverviewTab
            trip={trip}
            openGoogleMaps={openGoogleMaps}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <TripDetailHeader trip={trip} onClose={onClose} />

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabType)}
        />

        <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>
      </div>

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

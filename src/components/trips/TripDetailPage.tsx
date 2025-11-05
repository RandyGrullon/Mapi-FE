"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CompletedTrip,
  CompletedTripsManager,
  TripParticipant,
} from "./CompletedTripsManager";
import { useNavigation } from "../navigation/NavigationContext";
import { ShareModal } from "../modals/ShareModal";
import { OverviewTab } from "../tabs/OverviewTab";
import { FlightsTab } from "../tabs/FlightsTab";
import { HotelTab } from "../tabs/HotelTab";
import { ActivitiesTab } from "../tabs/ActivitiesTab";
import { BudgetTab } from "../tabs/BudgetTab";
import { CarTab } from "../tabs/CarTab";
import { BackButton, ShareButton, TabButton } from "../buttons";
import { NotificationIcon } from "../notifications/NotificationIcon";

interface TripDetailPageProps {
  trip: CompletedTrip;
}

export const TripDetailPage = ({ trip }: TripDetailPageProps) => {
  const { navigateToWizard } = useNavigation();
  const [activeTab, setActiveTab] = useState<
    "overview" | "flights" | "hotel" | "car" | "activities" | "budget"
  >("overview");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(trip);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setCurrentTrip(trip);
  }, [trip]);

  const handleShareClick = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId as any);
  }, []);

  const handleRemoveParticipant = useCallback(
    (participantId: string) => {
      const updatedParticipants = (currentTrip.participants || []).filter(
        (p) => p.id !== participantId
      );
      const updatedTrip = {
        ...currentTrip,
        participants: updatedParticipants,
      };
      CompletedTripsManager.saveTrip(updatedTrip);
      setCurrentTrip(updatedTrip);
    },
    [currentTrip]
  );

  const openGoogleMaps = (location: string) => {
    const query = encodeURIComponent(location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: CompletedTrip["status"]) => {
    const badges = {
      progress: {
        text: "📋 En Progreso",
        color: "bg-blue-100 text-blue-700 border border-blue-300",
      },
      ongoing: {
        text: "✈️ En Curso",
        color: "bg-green-100 text-green-700 border border-green-300",
      },
      completed: {
        text: "✅ Completado",
        color: "bg-gray-100 text-gray-600 border border-gray-300",
      },
      cancelled: {
        text: "❌ Cancelado",
        color: "bg-red-100 text-red-600 border border-red-300",
      },
    };
    const badge = badges[status] || badges.progress; // Default to progress if status is invalid
    return (
      <span
        className={`px-3 py-1 rounded-lg text-xs font-semibold ${badge.color}`}
      >
        {badge.text}
      </span>
    );
  };

  const tabs = [
    { id: "overview", label: "Resumen", icon: "📋" },
    { id: "flights", label: "Vuelos", icon: "✈️" },
    { id: "hotel", label: "Hotel", icon: "🏨" },
    ...(currentTrip.carRental
      ? [{ id: "car", label: "Auto", icon: "🚗" }]
      : []),
    { id: "activities", label: "Actividades", icon: "🎯" },
    // { id: "itinerary", label: "Itinerario", icon: "📅" }, // Comentado para MVP
    { id: "budget", label: "Presupuesto", icon: "💰" },
  ];

  return (
    <div
      className="flex-1 overflow-hidden flex flex-col bg-gray-50"
      suppressHydrationWarning
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <BackButton onClick={navigateToWizard} className="mb-4" />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  {currentTrip.name}
                </h1>
                {getStatusBadge(currentTrip.status)}
              </div>
              <p className="text-gray-600 text-sm">
                {formatDate(currentTrip.startDate)} -{" "}
                {formatDate(currentTrip.endDate)}
              </p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span>{currentTrip.travelType === "solo" ? "🚶" : "👥"}</span>
                  {currentTrip.travelers}{" "}
                  {currentTrip.travelers === 1 ? "viajero" : "viajeros"}
                  {trip.travelType === "group" &&
                    trip.participants &&
                    trip.participants.length > 1 && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {trip.participants.length} participante
                        {trip.participants.length !== 1 ? "s" : ""}
                      </span>
                    )}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 self-start">
              <NotificationIcon />
              <ShareButton
                onClick={handleShareClick}
                showLabelOnMobile={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => handleTabClick(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === "overview" && (
            <OverviewTab
              trip={currentTrip}
              openGoogleMaps={openGoogleMaps}
              setActiveTab={setActiveTab}
              onInviteParticipants={handleShareClick}
              onRemoveParticipant={handleRemoveParticipant}
            />
          )}
          {activeTab === "flights" && (
            <FlightsTab
              trip={currentTrip}
              status={currentTrip.status}
              isClient={isClient}
            />
          )}
          {activeTab === "hotel" && (
            <HotelTab
              trip={currentTrip}
              status={currentTrip.status}
              openGoogleMaps={openGoogleMaps}
              isClient={isClient}
            />
          )}
          {activeTab === "car" && currentTrip.carRental && (
            <CarTab
              carRental={currentTrip.carRental}
              status={currentTrip.status}
              openGoogleMaps={openGoogleMaps}
              isClient={isClient}
            />
          )}
          {activeTab === "activities" && (
            <ActivitiesTab
              trip={currentTrip}
              status={currentTrip.status}
              openGoogleMaps={openGoogleMaps}
              isClient={isClient}
            />
          )}
          {/* {activeTab === "itinerary" && (
            <ItineraryTab
              trip={currentTrip}
              status={currentTrip.status}
              openGoogleMaps={openGoogleMaps}
            />
          )} */}
          {activeTab === "budget" && <BudgetTab trip={currentTrip} />}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        trip={currentTrip}
        onClose={() => setIsShareModalOpen(false)}
        onAddParticipant={(participant) => {
          const updatedTrip = {
            ...currentTrip,
            participants: [...(currentTrip.participants || []), participant],
          };
          CompletedTripsManager.saveTrip(updatedTrip);
          setCurrentTrip(updatedTrip);
        }}
      />

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

// Tab: Resumen
// Tab: Vuelos
// Tab: Hotel
// Tab: Actividades
// Tab: Presupuesto

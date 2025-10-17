"use client";

import { useState } from "react";

export type TabType = "packages" | "flights" | "hotels" | "activities";

export function useTravelSelections() {
  const [selectedTab, setSelectedTab] = useState<TabType>("packages");
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const handleSelectFlight = (flightId: string) => {
    // Solo permite seleccionar 1 vuelo
    if (selectedFlight === flightId) {
      setSelectedFlight(null);
    } else {
      setSelectedFlight(flightId);
    }
  };

  const handleSelectHotel = (hotelId: string) => {
    // Solo permite seleccionar 1 hotel
    if (selectedHotel === hotelId) {
      setSelectedHotel(null);
    } else {
      setSelectedHotel(hotelId);
    }
  };

  const handleSelectActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(
        selectedActivities.filter((id) => id !== activityId)
      );
    } else if (selectedActivities.length < 3) {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const resetSelections = () => {
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedActivities([]);
  };

  return {
    selectedTab,
    setSelectedTab,
    selectedFlight,
    selectedHotel,
    selectedActivities,
    handleSelectFlight,
    handleSelectHotel,
    handleSelectActivity,
    resetSelections,
    hasValidSelection: selectedFlight && selectedHotel,
  };
}

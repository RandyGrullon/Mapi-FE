"use client";

import { useState } from "react";

export type TabType = "packages" | "flights" | "hotels" | "cars" | "activities";

export function useTravelSelections() {
  const [selectedTab, setSelectedTab] = useState<TabType>("packages");
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
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

  const handleSelectCar = (carId: string) => {
    // Solo permite seleccionar 1 carro
    if (selectedCar === carId) {
      setSelectedCar(null);
    } else {
      setSelectedCar(carId);
    }
  };

  const handleSelectActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(
        selectedActivities.filter((id) => id !== activityId)
      );
    } else {
      // Permitir seleccionar todas las actividades sin límite
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const resetSelections = () => {
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedCar(null);
    setSelectedActivities([]);
  };

  return {
    selectedTab,
    setSelectedTab,
    selectedFlight,
    selectedHotel,
    selectedCar,
    selectedActivities,
    handleSelectFlight,
    handleSelectHotel,
    handleSelectCar,
    handleSelectActivity,
    resetSelections,
    hasValidSelection: selectedFlight && selectedHotel,
  };
}

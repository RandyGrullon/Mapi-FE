"use client";

import { useState, useEffect } from "react";
import { CompletedTripsManager, CompletedTrip } from "./CompletedTripsManager";

export const useTrips = () => {
  const [trips, setTrips] = useState<CompletedTrip[]>([]);

  // Cargar trips y actualizar cada 2 segundos
  useEffect(() => {
    const loadTrips = () => {
      const allTrips = CompletedTripsManager.getAllTrips();
      setTrips(allTrips);
    };

    loadTrips();

    // Actualizar cada 2 segundos para reflejar cambios
    const interval = setInterval(loadTrips, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateTripName = (tripId: string, newName: string) => {
    CompletedTripsManager.updateTripName(tripId, newName);
    setTrips(CompletedTripsManager.getAllTrips());
  };

  const deleteTrip = (tripId: string) => {
    CompletedTripsManager.deleteTrip(tripId);
    setTrips(CompletedTripsManager.getAllTrips());
  };

  return {
    trips,
    updateTripName,
    deleteTrip,
  };
};

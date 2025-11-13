"use client";

import { useState, useEffect } from "react";
import { tripService } from "@/services/trips";
import { useAuth } from "../../auth/AuthContext";

export const useTrips = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  // Cargar trips de Supabase
  useEffect(() => {
    let isMounted = true;

    const loadTrips = async () => {
      // Esperar a que termine de cargar la autenticación
      if (authLoading) {
        return;
      }

      // Si no hay usuario, limpiar y salir
      if (!user) {
        if (isMounted) {
          setTrips([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const data = await tripService.getTrips();

        if (isMounted) {
          setTrips(data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al cargar los viajes";
          console.error("Error loading trips:", errorMessage);
          setError(errorMessage);
          setTrips([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTrips();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  const updateTripName = async (tripId: string, newName: string) => {
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    try {
      await tripService.updateTrip(tripId, { name: newName });

      // Actualizar localmente
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === tripId ? { ...trip, name: newName } : trip
        )
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al actualizar el nombre del viaje";
      console.error("Error updating trip name:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTrip = async (tripId: string) => {
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    try {
      await tripService.deleteTrip(tripId);

      // Actualizar localmente
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar el viaje";
      console.error("Error deleting trip:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    trips,
    loading,
    error,
    updateTripName,
    deleteTrip,
  };
};

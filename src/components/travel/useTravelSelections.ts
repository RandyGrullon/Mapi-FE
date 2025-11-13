"use client";

import { useState, useMemo } from "react";

export type TabType = "packages" | "flights" | "hotels" | "cars" | "activities";

interface UseTravelSelectionsProps {
  selectedServices?: string[]; // Servicios seleccionados en el wizard
  flightType?: "one-way" | "round-trip" | "multi-city"; // Tipo de vuelo
  numberOfSegments?: number; // Número de segmentos de vuelo requeridos
}

export function useTravelSelections(props?: UseTravelSelectionsProps) {
  const selectedServices = props?.selectedServices || [];
  const flightType = props?.flightType || "round-trip";
  const numberOfSegments =
    props?.numberOfSegments ||
    (flightType === "one-way" ? 1 : flightType === "round-trip" ? 2 : 1);

  const [selectedTab, setSelectedTab] = useState<TabType>("packages");
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [selectedFlights, setSelectedFlights] = useState<string[]>([]); // Para múltiples vuelos
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const handleSelectFlight = (flightId: string) => {
    // Solo permite seleccionar 1 vuelo (para compatibilidad con one-way)
    if (selectedFlight === flightId) {
      setSelectedFlight(null);
    } else {
      setSelectedFlight(flightId);
    }
  };

  // Nueva función para seleccionar vuelos por segmento
  const handleSelectFlightForSegment = (
    segmentIndex: number,
    flightId: string
  ) => {
    setSelectedFlights((prev) => {
      const newFlights = [...prev];
      // Si el vuelo ya está seleccionado en este segmento, deseleccionarlo
      if (newFlights[segmentIndex] === flightId) {
        newFlights[segmentIndex] = "";
      } else {
        newFlights[segmentIndex] = flightId;
      }
      return newFlights;
    });
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
    setSelectedFlights([]);
    setSelectedHotel(null);
    setSelectedCar(null);
    setSelectedActivities([]);
  };

  // Validación dinámica basada en servicios seleccionados
  const hasValidSelection = useMemo(() => {
    const needsFlight = selectedServices.includes("flights");
    const needsHotel = selectedServices.includes("hotel");
    const needsCar = selectedServices.includes("car");
    const needsActivities = selectedServices.includes("activities");

    // Validar vuelos según el tipo
    let flightsValid = true;
    if (needsFlight) {
      if (flightType === "one-way") {
        // Solo ida: requiere 1 vuelo seleccionado
        flightsValid = selectedFlight !== null;
      } else {
        // Ida y vuelta o multi-ciudad: requiere un vuelo por cada segmento
        const requiredSegments = numberOfSegments;
        const selectedSegments = selectedFlights.filter(
          (id) => id != null && id !== ""
        ).length;
        flightsValid = selectedSegments >= requiredSegments;
      }
    }

    // Validar que se hayan seleccionado TODOS los servicios requeridos
    return (
      flightsValid &&
      (!needsHotel || selectedHotel !== null) &&
      (!needsCar || selectedCar !== null) &&
      (!needsActivities || selectedActivities.length > 0)
    );
  }, [
    selectedServices,
    flightType,
    numberOfSegments,
    selectedFlight,
    selectedFlights,
    selectedHotel,
    selectedCar,
    selectedActivities,
  ]);

  // Generar mensaje de validación dinámico
  const getValidationMessage = () => {
    const needsFlight = selectedServices.includes("flights");
    const needsHotel = selectedServices.includes("hotel");
    const needsCar = selectedServices.includes("car");
    const needsActivities = selectedServices.includes("activities");

    const missing: string[] = [];

    // Validar vuelos según el tipo
    if (needsFlight) {
      if (flightType === "one-way") {
        if (!selectedFlight) {
          missing.push("un vuelo de ida");
        }
      } else if (flightType === "round-trip") {
        const selectedSegments = selectedFlights.filter(
          (id) => id != null && id !== ""
        ).length;
        if (selectedSegments === 0) {
          missing.push("vuelos de ida y vuelta");
        } else if (selectedSegments === 1) {
          missing.push(
            selectedFlights[0] ? "un vuelo de regreso" : "un vuelo de ida"
          );
        }
      } else if (flightType === "multi-city") {
        const selectedSegments = selectedFlights.filter(
          (id) => id != null && id !== ""
        ).length;
        const remaining = numberOfSegments - selectedSegments;
        if (remaining > 0) {
          missing.push(`${remaining} vuelo(s) más para completar tu ruta`);
        }
      }
    }

    if (needsHotel && !selectedHotel) missing.push("un hotel");
    if (needsCar && !selectedCar) missing.push("un auto");
    if (needsActivities && selectedActivities.length === 0)
      missing.push("actividades");

    if (missing.length === 0) return "";
    if (missing.length === 1) return `Debes seleccionar ${missing[0]}`;
    if (missing.length === 2)
      return `Debes seleccionar ${missing[0]} y ${missing[1]}`;

    const lastItem = missing.pop();
    return `Debes seleccionar ${missing.join(", ")} y ${lastItem}`;
  };

  return {
    selectedTab,
    setSelectedTab,
    selectedFlight,
    selectedFlights, // Exportar array de vuelos
    selectedHotel,
    selectedCar,
    selectedActivities,
    handleSelectFlight,
    handleSelectFlightForSegment, // Exportar nueva función
    handleSelectHotel,
    handleSelectCar,
    handleSelectActivity,
    resetSelections,
    hasValidSelection,
    getValidationMessage,
  };
}

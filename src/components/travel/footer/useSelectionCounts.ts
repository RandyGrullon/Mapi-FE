interface SelectionCounts {
  flights: number;
  hotel: number;
  car: number;
  activities: number;
}

interface UseSelectionCountsParams {
  selectedFlight: string | null;
  selectedFlights: string[];
  selectedHotel: string | null;
  selectedCar: string | null;
  selectedActivities: string[];
}

export const useSelectionCounts = ({
  selectedFlight,
  selectedFlights,
  selectedHotel,
  selectedCar,
  selectedActivities,
}: UseSelectionCountsParams): SelectionCounts => {
  // Contar vuelos seleccionados (para round-trip o multi-city)
  const flightsCount =
    selectedFlights.filter((id) => id != null && id !== "").length ||
    (selectedFlight ? 1 : 0);

  return {
    flights: flightsCount,
    hotel: selectedHotel ? 1 : 0,
    car: selectedCar ? 1 : 0,
    activities: selectedActivities.length,
  };
};

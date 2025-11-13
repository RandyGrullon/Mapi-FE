// Re-exportar tipos
export type {
  CompletedTrip,
  FlightReservation,
  HotelReservation,
  ActivityReservation,
  CarRentalReservation,
  DayItinerary,
  TripParticipant,
} from "./trip";

// Servicios
export { TripStorageService } from "../services/tripStorage";

// Utilidades
export { TripUtils } from "../utils/tripUtils";

// Factories
export { DemoTripFactory } from "../factories/DemoTripFactory";
export { CustomTripFactory } from "../factories/CustomTripFactory";
export { PackageTripFactory } from "../factories/PackageTripFactory";

// Manager principal (para compatibilidad con código existente)
export { CompletedTripsManager } from "../components/trips/trip-management/CompletedTripsManager";

import { CompletedTrip } from "@/types/trip";

const COMPLETED_TRIPS_KEY = "mapi_completed_trips";

export class TripStorageService {
  // Guardar un viaje completado
  static saveTrip(trip: CompletedTrip): void {
    if (typeof window === "undefined") return;

    const trips = this.getAllTrips();
    const existingIndex = trips.findIndex((t) => t.id === trip.id);

    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.unshift(trip);
    }

    localStorage.setItem(COMPLETED_TRIPS_KEY, JSON.stringify(trips));
  }

  // Obtener todos los viajes
  static getAllTrips(): CompletedTrip[] {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem(COMPLETED_TRIPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  // Obtener un viaje específico
  static getTrip(id: string): CompletedTrip | null {
    const trips = this.getAllTrips();
    return trips.find((t) => t.id === id) || null;
  }

  // Actualizar estado de un viaje
  static updateTripStatus(id: string, status: CompletedTrip["status"]): void {
    if (typeof window === "undefined") return;

    const trips = this.getAllTrips();
    const trip = trips.find((t) => t.id === id);

    if (trip) {
      trip.status = status;
      if (status === "completed") {
        trip.completedAt = new Date().toISOString();
      }
      localStorage.setItem(COMPLETED_TRIPS_KEY, JSON.stringify(trips));
    }
  }

  // Actualizar nombre de un viaje
  static updateTripName(id: string, newName: string): void {
    if (typeof window === "undefined") return;

    const trips = this.getAllTrips();
    const trip = trips.find((t) => t.id === id);

    if (trip) {
      trip.name = newName;
      localStorage.setItem(COMPLETED_TRIPS_KEY, JSON.stringify(trips));
    }
  }

  // Eliminar un viaje
  static deleteTrip(id: string): void {
    if (typeof window === "undefined") return;

    const trips = this.getAllTrips();
    const filtered = trips.filter((t) => t.id !== id);
    localStorage.setItem(COMPLETED_TRIPS_KEY, JSON.stringify(filtered));
  }
}

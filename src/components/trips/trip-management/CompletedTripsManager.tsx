"use client";

import { TravelInfo } from "../../wizard/WizardProvider";
import { CompletedTrip } from "@/types/trip";
import { tripService } from "@/services/trips";
import { DemoTripFactory } from "@/factories/DemoTripFactory";
import { CustomTripFactory } from "@/factories/CustomTripFactory";
import { PackageTripFactory } from "@/factories/PackageTripFactory";
import { TripUtils } from "@/utils/tripUtils";

// Re-exportar tipos para compatibilidad con código existente
export type {
  CompletedTrip,
  FlightReservation,
  HotelReservation,
  ActivityReservation,
  CarRentalReservation,
  DayItinerary,
  TripParticipant,
} from "@/types/trip";

/**
 * @deprecated This class is being migrated to use database services directly.
 * Use tripService from @/services/trips instead for new code.
 *
 * CompletedTripsManager now wraps the database service for backward compatibility.
 * All trips are now stored in the Supabase database instead of localStorage.
 */
export class CompletedTripsManager {
  // Métodos básicos de almacenamiento - ahora usan la base de datos
  static async saveTrip(trip: CompletedTrip): Promise<void> {
    try {
      // Si el trip ya tiene ID, actualizarlo; si no, crearlo
      if (trip.id) {
        await tripService.updateTrip(trip.id, trip as any);
      } else {
        await tripService.createTrip(trip as any);
      }
    } catch (error) {
      console.error("Error saving trip:", error);
      throw error;
    }
  }

  static async getAllTrips(): Promise<CompletedTrip[]> {
    try {
      const trips = await tripService.getTrips();
      // La base de datos retorna trips básicos, necesitamos convertirlos al formato CompletedTrip
      return trips as any as CompletedTrip[];
    } catch (error) {
      console.error("Error getting all trips:", error);
      return [];
    }
  }

  static async getTrip(id: string): Promise<CompletedTrip | null> {
    try {
      const trip = await tripService.getTrip(id);
      return trip as CompletedTrip | null;
    } catch (error) {
      console.error("Error getting trip:", error);
      return null;
    }
  }

  static async updateTripStatus(
    id: string,
    status: CompletedTrip["status"]
  ): Promise<void> {
    try {
      // Mapear status de UI a status de DB
      const dbStatus =
        status === "progress" || status === "ongoing"
          ? "planned"
          : (status as "draft" | "planned" | "completed" | "cancelled");
      await tripService.updateTrip(id, { status: dbStatus });
    } catch (error) {
      console.error("Error updating trip status:", error);
      throw error;
    }
  }

  static async updateTripName(id: string, newName: string): Promise<void> {
    try {
      await tripService.updateTrip(id, { name: newName });
    } catch (error) {
      console.error("Error updating trip name:", error);
      throw error;
    }
  }

  static async deleteTrip(id: string): Promise<void> {
    try {
      await tripService.deleteTrip(id);
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  }

  // Métodos de utilidades - delegados a TripUtils
  static generateId(): string {
    return TripUtils.generateId();
  }

  // Métodos de creación de viajes - delegados a factories
  // Nota: Las factories ahora retornan el trip pero NO lo guardan automáticamente
  // Debes llamar a saveTrip() después de crear el trip
  static createDemoTrip(travelInfo: TravelInfo): CompletedTrip {
    return DemoTripFactory.create(travelInfo);
  }

  static createTripFromCustomSelections(
    travelInfo: TravelInfo,
    selections: {
      flights?: any[];
      hotel?: any;
      carRental?: any;
      activities?: any[];
    }
  ): CompletedTrip {
    return CustomTripFactory.create(travelInfo, selections);
  }

  static createTripFromPackage(
    travelInfo: TravelInfo,
    pkg: {
      name: string;
      flight: any;
      hotel: any;
      carRental?: any;
      activities: any[];
    }
  ): CompletedTrip {
    return PackageTripFactory.create(travelInfo, pkg);
  }

  /**
   * Helper method to create and save a trip in one operation
   */
  static async createAndSaveTrip(
    trip: CompletedTrip
  ): Promise<CompletedTrip | null> {
    try {
      const saved = await tripService.createTrip(trip as any);
      return saved as CompletedTrip | null;
    } catch (error) {
      console.error("Error creating and saving trip:", error);
      return null;
    }
  }
}

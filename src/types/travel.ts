/**
 * Travel Types
 * Interfaces y tipos para el sistema de viajes
 */

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  // Campos de ubicación (ciudades/aeropuertos)
  departure: string; // Ciudad/aeropuerto de origen (ej: "Santo Domingo")
  arrival: string; // Ciudad/aeropuerto de destino (ej: "Barcelona")
  origin?: string; // Alias para departure (para mayor claridad)
  destination?: string; // Alias para arrival (para mayor claridad)
  // Campos de tiempo
  departureTime?: string; // Hora de salida (ej: "14:30")
  arrivalTime?: string; // Hora de llegada (ej: "22:15")
  departureDate?: string; // Fecha de salida (ej: "2024-03-15")
  arrivalDate?: string; // Fecha de llegada (ej: "2024-03-16")
  duration: string;
  price: number;
  stops: number;
  class: "Economy" | "Business" | "First";
  bookingUrl?: string;
  segmentIndex?: number; // Índice del segmento (0 = ida, 1 = regreso, etc.)
  segmentType?: "outbound" | "return"; // Tipo de segmento para ida y vuelta
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  location: string;
  amenities: string[];
  pricePerNight: number;
  rating: number;
  reviews: number;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  rating: number;
  included: string[];
}

export interface CarRental {
  id: string;
  company: string;
  carType: string;
  carModel: string;
  transmission: "automatic" | "manual";
  seats: number;
  pricePerDay: number;
  totalDays: number;
  totalPrice: number;
  features: string[];
  rating: number;
  imageUrl?: string;
}

export interface TravelPackage {
  id: string;
  name: string;
  description: string;
  flight: Flight;
  hotel: Hotel;
  carRental?: CarRental;
  activities: Activity[];
  totalPrice: number;
  savings: number;
  recommended?: boolean;
  benefits?: {
    cancellation: string;
    payment: string;
    support: string;
  };
}

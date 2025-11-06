/**
 * Travel Types
 * Interfaces y tipos para el sistema de viajes
 */

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  class: "Economy" | "Business" | "First";
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
}

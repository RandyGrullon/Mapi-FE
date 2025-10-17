"use client";

import { TravelInfo } from "./WizardProvider";

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

export interface TravelPackage {
  id: string;
  name: string;
  description: string;
  flight: Flight;
  hotel: Hotel;
  activities: Activity[];
  totalPrice: number;
  savings: number;
  recommended?: boolean;
}

export function generatePackages(travelInfo: TravelInfo): TravelPackage[] {
  const flights = generateFlights(travelInfo);
  const hotels = generateHotels(travelInfo);
  const activities = generateActivities(travelInfo);
  const nights = parseInt(travelInfo.duration) || 5;

  return [
    {
      id: "pkg-1",
      name: "Paquete Económico",
      description: "Lo esencial para disfrutar tu viaje sin preocupaciones",
      flight: flights[0],
      hotel: hotels[0],
      activities: activities.slice(0, 2),
      totalPrice:
        flights[0].price +
        hotels[0].pricePerNight * nights +
        activities[0].price +
        activities[1].price,
      savings: 200,
      recommended: false,
    },
    {
      id: "pkg-2",
      name: "Paquete Premium",
      description: "La experiencia completa con servicios de primera clase",
      flight: flights[1],
      hotel: hotels[1],
      activities: activities.slice(1, 4),
      totalPrice:
        flights[1].price +
        hotels[1].pricePerNight * nights +
        activities[1].price +
        activities[2].price +
        activities[3].price,
      savings: 350,
      recommended: true,
    },
    {
      id: "pkg-3",
      name: "Paquete Aventura",
      description: "Para los amantes de la exploración y nuevas experiencias",
      flight: flights[2],
      hotel: hotels[2],
      activities: activities.slice(3, 6),
      totalPrice:
        flights[2].price +
        hotels[2].pricePerNight * nights +
        activities[3].price +
        activities[4].price +
        activities[5].price,
      savings: 280,
      recommended: false,
    },
  ];
}

export function generateFlights(travelInfo: TravelInfo): Flight[] {
  return [
    {
      id: "flight-1",
      airline: "Air France",
      flightNumber: "AF 0459",
      departure: "08:00 AM",
      arrival: "10:30 PM",
      duration: "9h 30m",
      price: 850,
      stops: 0,
      class: "Economy",
    },
    {
      id: "flight-2",
      airline: "Delta Airlines",
      flightNumber: "DL 8564",
      departure: "10:30 AM",
      arrival: "01:15 AM +1",
      duration: "11h 45m",
      price: 950,
      stops: 1,
      class: "Economy",
    },
    {
      id: "flight-3",
      airline: "American Airlines",
      flightNumber: "AA 0206",
      departure: "06:15 PM",
      arrival: "08:45 AM +1",
      duration: "12h 30m",
      price: 780,
      stops: 1,
      class: "Economy",
    },
  ];
}

export function generateHotels(travelInfo: TravelInfo): Hotel[] {
  return [
    {
      id: "hotel-1",
      name: "Hotel Central Plaza",
      stars: 3,
      location: "Centro de la ciudad",
      amenities: ["WiFi gratis", "Desayuno", "Aire acondicionado"],
      pricePerNight: 80,
      rating: 4.2,
      reviews: 1250,
    },
    {
      id: "hotel-2",
      name: "Grand Luxury Hotel",
      stars: 5,
      location: "Zona turística premium",
      amenities: [
        "Spa",
        "Piscina",
        "Gimnasio",
        "WiFi gratis",
        "Desayuno buffet",
      ],
      pricePerNight: 220,
      rating: 4.8,
      reviews: 890,
    },
    {
      id: "hotel-3",
      name: "Boutique Riverside Inn",
      stars: 4,
      location: "Junto al río",
      amenities: ["Vistas panorámicas", "WiFi gratis", "Bar", "Restaurante"],
      pricePerNight: 150,
      rating: 4.6,
      reviews: 640,
    },
  ];
}

export function generateActivities(travelInfo: TravelInfo): Activity[] {
  return [
    {
      id: "activity-1",
      name: "City Walking Tour",
      category: "Tours guiados",
      duration: "3 horas",
      price: 45,
      rating: 4.7,
      included: ["Guía profesional", "Mapa de la ciudad", "Fotografías"],
    },
    {
      id: "activity-2",
      name: "Museo Nacional",
      category: "Cultura",
      duration: "2 horas",
      price: 25,
      rating: 4.5,
      included: ["Entrada", "Audio guía", "Material informativo"],
    },
    {
      id: "activity-3",
      name: "Cena en Restaurante Típico",
      category: "Gastronomía",
      duration: "2 horas",
      price: 65,
      rating: 4.9,
      included: ["Menú de 3 platos", "Bebidas", "Show en vivo"],
    },
    {
      id: "activity-4",
      name: "Aventura en la Montaña",
      category: "Aventura",
      duration: "6 horas",
      price: 120,
      rating: 4.8,
      included: ["Equipo de seguridad", "Instructor", "Almuerzo", "Transporte"],
    },
    {
      id: "activity-5",
      name: "Paseo en Barco",
      category: "Náutico",
      duration: "4 horas",
      price: 85,
      rating: 4.6,
      included: ["Capitán", "Refrigerios", "Snorkel", "Fotografías"],
    },
    {
      id: "activity-6",
      name: "Spa Day",
      category: "Relax",
      duration: "3 horas",
      price: 95,
      rating: 4.9,
      included: ["Masaje", "Sauna", "Jacuzzi", "Té y snacks"],
    },
  ];
}

"use client";

import { TravelInfo } from "../wizard/WizardProvider";

// Tipo para una reserva de hotel
export type HotelReservation = {
  hotelName: string;
  category: string; // 3 estrellas, 4 estrellas, 5 estrellas, etc.
  address: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  guests: number;
  amenities: string[];
  confirmationCode: string;
  totalPrice: number;
  pricePerNight: number;
  imageUrl?: string;
  bookingUrl?: string; // URL para reservar el hotel
};

// Tipo para una reserva de vuelo
export type FlightReservation = {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  flightClass: string; // Economy, Business, First Class
  seatNumber?: string;
  confirmationCode: string;
  price: number;
  baggage: string;
  type: "outbound" | "return"; // Ida o vuelta
  bookingUrl?: string; // URL para reservar/comprar el vuelo
};

// Tipo para una actividad reservada
export type ActivityReservation = {
  id: string;
  name: string;
  category: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  price: number;
  confirmationCode: string;
  included: string[];
  imageUrl?: string;
  bookingUrl?: string; // URL para reservar la actividad
};

// Tipo para renta de vehículo
export type CarRentalReservation = {
  company: string; // Empresa de renta (Hertz, Avis, etc.)
  carType: string; // economy, compact, suv, luxury
  carModel: string; // Modelo del vehículo
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  confirmationCode: string;
  insurance?: string; // Tipo de seguro incluido
  transmission: "automatic" | "manual";
  fuelPolicy: string; // Full-to-Full, Pre-paid, etc.
  features?: string[]; // GPS, Child seat, etc.
  imageUrl?: string;
  bookingUrl?: string;
};

// Tipo para el itinerario diario
export type DayItinerary = {
  day: number;
  date: string;
  title: string;
  activities: ActivityReservation[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  notes?: string;
};

// Tipo para participante del viaje
export type TripParticipant = {
  id: string;
  name: string;
  email?: string;
  role: "owner" | "participant";
  joinedAt: string;
};

// Tipo para un viaje completado
export type CompletedTrip = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: "progress" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;

  // Información del viaje
  travelInfo: TravelInfo;

  // Reservas
  flights: {
    outbound: FlightReservation;
    return?: FlightReservation;
  };
  hotel: HotelReservation;
  carRental?: CarRentalReservation; // Renta de vehículo (opcional)
  activities: ActivityReservation[];

  // Itinerario
  itinerary: DayItinerary[];

  // Resumen financiero
  budget: {
    total: number;
    flights: number;
    hotel: number;
    carRental: number; // Costo de renta de vehículo
    activities: number;
    extras: number;
  };

  // Documentos e información adicional
  documents?: {
    bookingConfirmation?: string;
    insurance?: string;
    tickets?: string[];
  };

  // Participantes y compartir
  participants?: TripParticipant[];
  isShared?: boolean;
  shareToken?: string; // Token único para compartir
  travelType?: "solo" | "group"; // Si viaja solo o en grupo

  imageUrl?: string;
};

const COMPLETED_TRIPS_KEY = "mapi_completed_trips";

export class CompletedTripsManager {
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
      console.error("Error loading trips:", error);
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

  // Generar ID único
  static generateId(): string {
    return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Crear viaje de ejemplo/demo
  static createDemoTrip(travelInfo: TravelInfo): CompletedTrip {
    const id = this.generateId();
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Generar reserva de vuelo de ida
    const outboundFlight: FlightReservation = {
      airline: "Iberia",
      flightNumber: "IB6853",
      origin: travelInfo.origin,
      destination: travelInfo.destination,
      departureDate: startDate.toISOString().split("T")[0],
      departureTime: "08:30",
      arrivalDate: startDate.toISOString().split("T")[0],
      arrivalTime: "14:45",
      duration: "8h 15m",
      flightClass: travelInfo.flightPreference?.includes("Económico")
        ? "Economy"
        : travelInfo.flightPreference?.includes("Business")
        ? "Business"
        : "Economy",
      confirmationCode: `IB${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`,
      price: 450,
      baggage: "1 maleta de 23kg + equipaje de mano",
      type: "outbound",
      bookingUrl: `https://www.iberia.com/es/flight/${travelInfo.origin}-${
        travelInfo.destination
      }/${startDate.toISOString().split("T")[0]}/`,
    };

    // Generar reserva de vuelo de regreso
    const returnFlight: FlightReservation = {
      airline: "Iberia",
      flightNumber: "IB6854",
      origin: travelInfo.destination,
      destination: travelInfo.origin,
      departureDate: endDate.toISOString().split("T")[0],
      departureTime: "16:00",
      arrivalDate: endDate.toISOString().split("T")[0],
      arrivalTime: "22:15",
      duration: "8h 15m",
      flightClass: outboundFlight.flightClass,
      confirmationCode: `IB${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`,
      price: 450,
      baggage: "1 maleta de 23kg + equipaje de mano",
      type: "return",
      bookingUrl: `https://www.iberia.com/es/flight/${travelInfo.destination}-${
        travelInfo.origin
      }/${endDate.toISOString().split("T")[0]}/`,
    };

    // Generar reserva de hotel
    const hotelReservation: HotelReservation = {
      hotelName: `Grand Hotel ${travelInfo.destination}`,
      category: travelInfo.accommodationType || "Hotel confort (4 estrellas)",
      address: `Calle Principal 123, ${travelInfo.destination}`,
      checkIn: startDate.toISOString().split("T")[0],
      checkOut: endDate.toISOString().split("T")[0],
      nights: 7,
      roomType: "Habitación Doble Superior",
      guests: Number(travelInfo.travelers) || 2,
      amenities: [
        "WiFi gratuito",
        "Desayuno incluido",
        "Piscina",
        "Gimnasio",
        "Spa",
        "Estacionamiento",
      ],
      confirmationCode: `HTL${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`,
      totalPrice: 980,
      pricePerNight: 140,
      bookingUrl: `https://www.booking.com/hotel/es/grand-hotel-${travelInfo.destination
        .toLowerCase()
        .replace(/\s+/g, "-")}.es.html`,
    };

    // Generar actividades
    const activities: ActivityReservation[] = [];
    const activityCategories = Array.isArray(travelInfo.activities)
      ? travelInfo.activities
      : [travelInfo.activities].filter(Boolean);

    activityCategories.slice(0, 3).forEach((category, index) => {
      const day = index + 2;
      const activityDate = new Date(startDate);
      activityDate.setDate(activityDate.getDate() + day);

      activities.push({
        id: `act_${index}`,
        name: `${category} Tour`,
        category: category,
        description: `Experiencia única de ${category} en ${travelInfo.destination}`,
        date: activityDate.toISOString().split("T")[0],
        time: "09:00",
        duration: "4 horas",
        location: `${travelInfo.destination} Centro`,
        price: 75,
        confirmationCode: `ACT${Math.random()
          .toString(36)
          .substr(2, 6)
          .toUpperCase()}`,
        included: ["Guía profesional", "Transporte", "Entrada"],
        bookingUrl: `https://www.viator.com/es-ES/${travelInfo.destination
          .toLowerCase()
          .replace(/\s+/g, "-")}/tours/${category
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      });
    });

    // Generar itinerario
    const itinerary: DayItinerary[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);

      const dayActivities = activities.filter(
        (act) => act.date === dayDate.toISOString().split("T")[0]
      );

      itinerary.push({
        day: i + 1,
        date: dayDate.toISOString().split("T")[0],
        title: i === 0 ? "Llegada" : i === 6 ? "Salida" : `Día ${i + 1}`,
        activities: dayActivities,
        meals: {
          breakfast: hotelReservation.amenities.includes("Desayuno incluido")
            ? "Desayuno en el hotel"
            : undefined,
        },
      });
    }

    // Calcular presupuesto
    const budget = {
      flights: outboundFlight.price + (returnFlight?.price || 0),
      hotel: hotelReservation.totalPrice,
      carRental: 0, // Por ahora 0, se actualizará cuando se agregue el servicio
      activities: activities.reduce((sum, act) => sum + act.price, 0),
      extras: 200,
      total: 0,
    };
    budget.total =
      budget.flights + budget.hotel + budget.carRental + budget.activities + budget.extras;

    const trip: CompletedTrip = {
      id,
      name: `${travelInfo.origin} → ${travelInfo.destination}`,
      origin: travelInfo.origin,
      destination: travelInfo.destination,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      travelers: Number(travelInfo.travelers) || 2,
      status: "progress",
      createdAt: new Date().toISOString(),
      travelInfo,
      flights: {
        outbound: outboundFlight,
        return: returnFlight,
      },
      hotel: hotelReservation,
      activities,
      itinerary,
      budget,
      // Datos de compartir y participantes
      travelType: Number(travelInfo.travelers) === 1 ? "solo" : "group",
      isShared: false,
      shareToken: `share_${id}`,
      participants: [
        {
          id: "owner_1",
          name: "Viajero Principal",
          email: "usuario@email.com",
          role: "owner",
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    return trip;
  }
}

import { TravelInfo } from "../components/wizard/WizardProvider";

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

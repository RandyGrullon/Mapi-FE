import { TravelInfo } from "@/components/wizard/WizardProvider";
import {
  CompletedTrip,
  FlightReservation,
  HotelReservation,
  ActivityReservation,
  CarRentalReservation,
  DayItinerary,
} from "@/types/trip";
import { TripUtils } from "@/utils/tripUtils";

/**
 * Factory for creating trips from custom user selections.
 *
 * Note: This factory only creates the trip object - it does NOT save it to the database.
 * Callers must save the trip explicitly using:
 * - CompletedTripsManager.createAndSaveTrip(trip), or
 * - tripService.createTrip(trip)
 */
export class CustomTripFactory {
  static create(
    travelInfo: TravelInfo,
    selections: {
      flights?: any[];
      hotel?: any;
      carRental?: any;
      activities?: any[];
    }
  ): CompletedTrip {
    const id = TripUtils.generateId();
    const startDate = new Date(travelInfo.startDate || new Date());
    const endDate = new Date(travelInfo.endDate || new Date());
    endDate.setDate(endDate.getDate() + (Number(travelInfo.duration) || 7));

    const { outboundFlight, returnFlight } = this.processFlights(
      selections.flights,
      travelInfo,
      startDate,
      endDate
    );
    const hotel = this.processHotel(
      selections.hotel,
      travelInfo,
      startDate,
      endDate
    );
    const activities = this.processActivities(
      selections.activities,
      travelInfo,
      startDate
    );
    const carRental = this.processCarRental(
      selections.carRental,
      travelInfo,
      startDate,
      endDate
    );
    const itinerary = this.createItinerary(
      startDate,
      endDate,
      travelInfo,
      activities,
      hotel
    );
    const budget = this.calculateBudget(
      outboundFlight,
      returnFlight,
      hotel,
      activities,
      carRental
    );

    return {
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
      hotel,
      carRental,
      activities,
      itinerary,
      budget,
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
  }

  private static processFlights(
    flights: any[] | undefined,
    travelInfo: TravelInfo,
    startDate: Date,
    endDate: Date
  ) {
    if (!flights || flights.length === 0) {
      return this.createDefaultFlights(travelInfo, startDate, endDate);
    }

    const outboundFlightData =
      flights.find(
        (f) => f.segmentType === "outbound" || f.segmentIndex === 0
      ) || flights[0];

    const outboundFlight: FlightReservation = {
      airline: outboundFlightData.airline || "Airline",
      flightNumber: outboundFlightData.flightNumber || "XXXX",
      origin:
        outboundFlightData.origin ||
        outboundFlightData.departure ||
        travelInfo.origin,
      destination:
        outboundFlightData.destination ||
        outboundFlightData.arrival ||
        travelInfo.destination,
      departureDate:
        outboundFlightData.departureDate ||
        startDate.toISOString().split("T")[0],
      departureTime: outboundFlightData.departureTime || "08:00",
      arrivalDate:
        outboundFlightData.arrivalDate || startDate.toISOString().split("T")[0],
      arrivalTime: outboundFlightData.arrivalTime || "14:00",
      duration: outboundFlightData.duration || "6h",
      flightClass: outboundFlightData.class || "Economy",
      confirmationCode: TripUtils.generateConfirmationCode("FLT"),
      price: outboundFlightData.price || 0,
      baggage: "1 maleta de 23kg + equipaje de mano",
      type: "outbound",
      bookingUrl: outboundFlightData.bookingUrl,
    };

    let returnFlight: FlightReservation | undefined;
    if (flights.length > 1) {
      const returnFlightData =
        flights.find(
          (f) => f.segmentType === "return" || f.segmentIndex === 1
        ) || flights[1];

      returnFlight = {
        airline: returnFlightData.airline || "Airline",
        flightNumber: returnFlightData.flightNumber || "XXXX",
        origin:
          returnFlightData.origin ||
          returnFlightData.departure ||
          travelInfo.destination,
        destination:
          returnFlightData.destination ||
          returnFlightData.arrival ||
          travelInfo.origin,
        departureDate:
          returnFlightData.departureDate || endDate.toISOString().split("T")[0],
        departureTime: returnFlightData.departureTime || "16:00",
        arrivalDate:
          returnFlightData.arrivalDate || endDate.toISOString().split("T")[0],
        arrivalTime: returnFlightData.arrivalTime || "22:00",
        duration: returnFlightData.duration || "6h",
        flightClass: returnFlightData.class || "Economy",
        confirmationCode: TripUtils.generateConfirmationCode("FLT"),
        price: returnFlightData.price || 0,
        baggage: "1 maleta de 23kg + equipaje de mano",
        type: "return",
        bookingUrl: returnFlightData.bookingUrl,
      };
    }

    return { outboundFlight, returnFlight };
  }

  private static createDefaultFlights(
    travelInfo: TravelInfo,
    startDate: Date,
    endDate: Date
  ) {
    const outboundFlight: FlightReservation = {
      airline: "Airline",
      flightNumber: "XXXX",
      origin: travelInfo.origin,
      destination: travelInfo.destination,
      departureDate: startDate.toISOString().split("T")[0],
      departureTime: "08:00",
      arrivalDate: startDate.toISOString().split("T")[0],
      arrivalTime: "14:00",
      duration: "6h",
      flightClass: "Economy",
      confirmationCode: TripUtils.generateConfirmationCode("FLT"),
      price: 0,
      baggage: "1 maleta de 23kg + equipaje de mano",
      type: "outbound",
    };

    return { outboundFlight, returnFlight: undefined };
  }

  private static processHotel(
    hotel: any,
    travelInfo: TravelInfo,
    startDate: Date,
    endDate: Date
  ): HotelReservation {
    if (!hotel) {
      return this.createDefaultHotel(travelInfo, startDate, endDate);
    }

    const nights = TripUtils.calculateNights(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    return {
      hotelName: hotel.name || "Hotel",
      category: hotel.stars ? `${hotel.stars} estrellas` : "Hotel confort",
      address: hotel.location || travelInfo.destination,
      checkIn: startDate.toISOString().split("T")[0],
      checkOut: endDate.toISOString().split("T")[0],
      nights,
      roomType: "Habitación Doble",
      guests: Number(travelInfo.travelers) || 2,
      amenities: hotel.amenities || ["WiFi gratuito", "Desayuno incluido"],
      confirmationCode: TripUtils.generateConfirmationCode("HTL"),
      totalPrice: hotel.pricePerNight * nights,
      pricePerNight: hotel.pricePerNight || 0,
      imageUrl: hotel.imageUrl,
    };
  }

  private static createDefaultHotel(
    travelInfo: TravelInfo,
    startDate: Date,
    endDate: Date
  ): HotelReservation {
    const nights = TripUtils.calculateNights(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    return {
      hotelName: `Hotel en ${travelInfo.destination}`,
      category: "Hotel confort",
      address: travelInfo.destination,
      checkIn: startDate.toISOString().split("T")[0],
      checkOut: endDate.toISOString().split("T")[0],
      nights,
      roomType: "Habitación Doble",
      guests: Number(travelInfo.travelers) || 2,
      amenities: ["WiFi gratuito"],
      confirmationCode: TripUtils.generateConfirmationCode("HTL"),
      totalPrice: 0,
      pricePerNight: 0,
    };
  }

  private static processActivities(
    activities: any[] | undefined,
    travelInfo: TravelInfo,
    startDate: Date
  ): ActivityReservation[] {
    if (!activities || activities.length === 0) {
      return [];
    }

    return activities.map((act, index) => ({
      id: act.id || `act_${index}`,
      name: act.name || "Actividad",
      category: act.category || "General",
      description: act.name || "Actividad incluida",
      date: new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      time: "10:00",
      duration: act.duration || "2-3 horas",
      location: travelInfo.destination,
      price: act.price || 0,
      confirmationCode: TripUtils.generateConfirmationCode("ACT"),
      included: act.included || [],
      imageUrl: act.imageUrl,
    }));
  }

  private static processCarRental(
    carRental: any,
    travelInfo: TravelInfo,
    startDate: Date,
    endDate: Date
  ): CarRentalReservation | undefined {
    if (!carRental) {
      return undefined;
    }

    return {
      company: carRental.company || "Rental Company",
      carType: carRental.carType || "economy",
      carModel: carRental.carModel || "Sedan",
      pickupLocation: travelInfo.destination,
      dropoffLocation: travelInfo.destination,
      pickupDate: startDate.toISOString().split("T")[0],
      pickupTime: "10:00",
      dropoffDate: endDate.toISOString().split("T")[0],
      dropoffTime: "10:00",
      totalDays: carRental.totalDays || Number(travelInfo.duration) || 7,
      pricePerDay: carRental.pricePerDay || 0,
      totalPrice: carRental.totalPrice || 0,
      confirmationCode: TripUtils.generateConfirmationCode("CAR"),
      transmission: carRental.transmission || "automatic",
      fuelPolicy: "Full-to-Full",
      features: carRental.features || [],
      imageUrl: carRental.imageUrl,
    };
  }

  private static createItinerary(
    startDate: Date,
    endDate: Date,
    travelInfo: TravelInfo,
    activities: ActivityReservation[],
    hotel: HotelReservation
  ): DayItinerary[] {
    const itinerary: DayItinerary[] = [];
    const durationDays = Number(travelInfo.duration) || 7;

    for (let i = 0; i < durationDays; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);

      const dayActivities = activities.filter(
        (act) => act.date === dayDate.toISOString().split("T")[0]
      );

      itinerary.push({
        day: i + 1,
        date: dayDate.toISOString().split("T")[0],
        title:
          i === 0
            ? "Llegada"
            : i === durationDays - 1
            ? "Regreso"
            : `Día ${i + 1}`,
        activities: dayActivities,
        meals: {
          breakfast: hotel.amenities.includes("Desayuno incluido")
            ? "Incluido en el hotel"
            : "No incluido",
          lunch: "Libre",
          dinner: "Libre",
        },
      });
    }

    return itinerary;
  }

  private static calculateBudget(
    outboundFlight: FlightReservation,
    returnFlight: FlightReservation | undefined,
    hotel: HotelReservation,
    activities: ActivityReservation[],
    carRental: CarRentalReservation | undefined
  ) {
    const flightsCost = outboundFlight.price + (returnFlight?.price || 0);
    const activitiesCost = activities.reduce((sum, act) => sum + act.price, 0);
    const carRentalCost = carRental?.totalPrice || 0;

    return {
      total: flightsCost + hotel.totalPrice + carRentalCost + activitiesCost,
      flights: flightsCost,
      hotel: hotel.totalPrice,
      carRental: carRentalCost,
      activities: activitiesCost,
      extras: 0,
    };
  }
}

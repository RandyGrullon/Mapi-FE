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
 * Factory for creating demo trips with sample data.
 *
 * Note: This factory only creates the trip object - it does NOT save it to the database.
 * Callers must save the trip explicitly using:
 * - CompletedTripsManager.createAndSaveTrip(trip), or
 * - tripService.createTrip(trip)
 */
export class DemoTripFactory {
  static create(travelInfo: TravelInfo): CompletedTrip {
    const id = TripUtils.generateId();
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const outboundFlight = this.createDemoFlight(
      travelInfo,
      startDate,
      "outbound"
    );
    const returnFlight = this.createDemoFlight(travelInfo, endDate, "return");
    const hotel = this.createDemoHotel(travelInfo, startDate, endDate);
    const activities = this.createDemoActivities(travelInfo, startDate);
    const itinerary = this.createDemoItinerary(startDate, activities, hotel);
    const budget = this.calculateBudget(
      outboundFlight,
      returnFlight,
      hotel,
      activities
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

  private static createDemoFlight(
    travelInfo: TravelInfo,
    date: Date,
    type: "outbound" | "return"
  ): FlightReservation {
    const isOutbound = type === "outbound";

    return {
      airline: "Iberia",
      flightNumber: isOutbound ? "IB6853" : "IB6854",
      origin: isOutbound ? travelInfo.origin : travelInfo.destination,
      destination: isOutbound ? travelInfo.destination : travelInfo.origin,
      departureDate: date.toISOString().split("T")[0],
      departureTime: isOutbound ? "08:30" : "16:00",
      arrivalDate: date.toISOString().split("T")[0],
      arrivalTime: isOutbound ? "14:45" : "22:15",
      duration: "8h 15m",
      flightClass: this.getFlightClass(travelInfo.flightPreference),
      confirmationCode: TripUtils.generateConfirmationCode("IB"),
      price: 450,
      baggage: "1 maleta de 23kg + equipaje de mano",
      type,
      bookingUrl: TripUtils.createBookingUrl("flight", {
        origin: isOutbound ? travelInfo.origin : travelInfo.destination,
        destination: isOutbound ? travelInfo.destination : travelInfo.origin,
        date: date.toISOString().split("T")[0],
      }),
    };
  }

  private static createDemoHotel(
    travelInfo: TravelInfo,
    startDate: Date,
    endDate: Date
  ): HotelReservation {
    const nights = TripUtils.calculateNights(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    return {
      hotelName: `Grand Hotel ${travelInfo.destination}`,
      category: travelInfo.accommodationType || "Hotel confort (4 estrellas)",
      address: `Calle Principal 123, ${travelInfo.destination}`,
      checkIn: startDate.toISOString().split("T")[0],
      checkOut: endDate.toISOString().split("T")[0],
      nights,
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
      confirmationCode: TripUtils.generateConfirmationCode("HTL"),
      totalPrice: 980,
      pricePerNight: 140,
      bookingUrl: TripUtils.createBookingUrl("hotel", {
        destination: travelInfo.destination,
      }),
    };
  }

  private static createDemoActivities(
    travelInfo: TravelInfo,
    startDate: Date
  ): ActivityReservation[] {
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
        confirmationCode: TripUtils.generateConfirmationCode("ACT"),
        included: ["Guía profesional", "Transporte", "Entrada"],
        bookingUrl: TripUtils.createBookingUrl("activity", {
          destination: travelInfo.destination,
          category,
        }),
      });
    });

    return activities;
  }

  private static createDemoItinerary(
    startDate: Date,
    activities: ActivityReservation[],
    hotel: HotelReservation
  ): DayItinerary[] {
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
          breakfast: hotel.amenities.includes("Desayuno incluido")
            ? "Desayuno en el hotel"
            : undefined,
        },
      });
    }

    return itinerary;
  }

  private static calculateBudget(
    outboundFlight: FlightReservation,
    returnFlight: FlightReservation,
    hotel: HotelReservation,
    activities: ActivityReservation[]
  ) {
    const budget = {
      flights: outboundFlight.price + returnFlight.price,
      hotel: hotel.totalPrice,
      carRental: 0,
      activities: activities.reduce((sum, act) => sum + act.price, 0),
      extras: 200,
      total: 0,
    };

    budget.total =
      budget.flights +
      budget.hotel +
      budget.carRental +
      budget.activities +
      budget.extras;
    return budget;
  }

  private static getFlightClass(flightPreference?: string): string {
    if (flightPreference?.includes("Business")) return "Business";
    if (flightPreference?.includes("Económico")) return "Economy";
    return "Economy";
  }
}

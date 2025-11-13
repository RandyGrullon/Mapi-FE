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
 * Factory for creating trips from pre-built travel packages.
 *
 * Note: This factory only creates the trip object - it does NOT save it to the database.
 * Callers must save the trip explicitly using:
 * - CompletedTripsManager.createAndSaveTrip(trip), or
 * - tripService.createTrip(trip)
 */
export class PackageTripFactory {
  static create(
    travelInfo: TravelInfo,
    pkg: {
      name: string;
      flight: any;
      hotel: any;
      carRental?: any;
      activities: any[];
    }
  ): CompletedTrip {
    const id = TripUtils.generateId();
    const startDate = new Date(travelInfo.startDate || new Date());
    const endDate = new Date(travelInfo.endDate || new Date());
    endDate.setDate(endDate.getDate() + (Number(travelInfo.duration) || 7));

    const outboundFlight = this.processPackageFlight(
      pkg.flight,
      travelInfo,
      startDate
    );
    const hotel = this.processPackageHotel(
      pkg.hotel,
      travelInfo,
      startDate,
      endDate
    );
    const activities = this.processPackageActivities(
      pkg.activities,
      travelInfo,
      startDate
    );
    const carRental = this.processPackageCarRental(
      pkg.carRental,
      travelInfo,
      startDate,
      endDate
    );
    const itinerary = this.createPackageItinerary(
      startDate,
      endDate,
      travelInfo,
      activities
    );
    const budget = this.calculatePackageBudget(
      outboundFlight,
      hotel,
      activities,
      carRental
    );

    return {
      id,
      name: pkg.name || `${travelInfo.origin} → ${travelInfo.destination}`,
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

  private static processPackageFlight(
    flight: any,
    travelInfo: TravelInfo,
    startDate: Date
  ): FlightReservation {
    return {
      airline: flight.airline || "Airline",
      flightNumber: flight.flightNumber || "XXXX",
      origin: flight.origin || flight.departure || travelInfo.origin,
      destination:
        flight.destination || flight.arrival || travelInfo.destination,
      departureDate:
        flight.departureDate || startDate.toISOString().split("T")[0],
      departureTime: flight.departureTime || "08:00",
      arrivalDate: flight.arrivalDate || startDate.toISOString().split("T")[0],
      arrivalTime: flight.arrivalTime || "14:00",
      duration: flight.duration || "6h",
      flightClass: flight.class || "Economy",
      confirmationCode: TripUtils.generateConfirmationCode("PKG"),
      price: flight.price || 0,
      baggage: "1 maleta de 23kg + equipaje de mano",
      type: "outbound",
      bookingUrl: flight.bookingUrl,
    };
  }

  private static processPackageHotel(
    hotel: any,
    travelInfo: TravelInfo,
    startDate: Date,
    endDate: Date
  ): HotelReservation {
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

  private static processPackageActivities(
    activities: any[],
    travelInfo: TravelInfo,
    startDate: Date
  ): ActivityReservation[] {
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

  private static processPackageCarRental(
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

  private static createPackageItinerary(
    startDate: Date,
    endDate: Date,
    travelInfo: TravelInfo,
    activities: ActivityReservation[]
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
          breakfast: "Incluido en el hotel",
          lunch: "Libre",
          dinner: "Libre",
        },
      });
    }

    return itinerary;
  }

  private static calculatePackageBudget(
    outboundFlight: FlightReservation,
    hotel: HotelReservation,
    activities: ActivityReservation[],
    carRental: CarRentalReservation | undefined
  ) {
    const activitiesCost = activities.reduce((sum, act) => sum + act.price, 0);
    const carRentalCost = carRental?.totalPrice || 0;

    return {
      total:
        outboundFlight.price +
        hotel.totalPrice +
        carRentalCost +
        activitiesCost,
      flights: outboundFlight.price,
      hotel: hotel.totalPrice,
      carRental: carRentalCost,
      activities: activitiesCost,
      extras: 0,
    };
  }
}

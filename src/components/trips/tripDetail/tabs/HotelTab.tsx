"use client";

import { CompletedTrip } from "@/types/trip";
import {
  HotelHeader,
  HotelDates,
  RoomType,
  AmenitiesList,
  HotelPricing,
  BookingButton,
  CancelledBanner,
} from "./hotel";

interface HotelTabProps {
  trip: CompletedTrip;
  status: CompletedTrip["status"];
  openGoogleMaps: (location: string) => void;
  isClient: boolean;
}

export const HotelTab = ({
  trip,
  status,
  openGoogleMaps,
  isClient,
}: HotelTabProps) => {
  const hotel = trip.hotel;
  const isInteractive = status === "progress" || status === "ongoing";
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-6 animate-fade-in">
      {isCancelled && <CancelledBanner />}

      <div
        className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        <HotelHeader
          hotelName={hotel.hotelName}
          category={hotel.category}
          address={hotel.address}
          confirmationCode={hotel.confirmationCode}
          isInteractive={isInteractive}
          onOpenMap={openGoogleMaps}
        />

        <HotelDates
          checkIn={hotel.checkIn}
          checkOut={hotel.checkOut}
          nights={hotel.nights}
          guests={hotel.guests}
        />

        <RoomType roomType={hotel.roomType} />

        <AmenitiesList amenities={hotel.amenities} />

        <HotelPricing
          pricePerNight={hotel.pricePerNight}
          totalPrice={hotel.totalPrice}
        />

        <BookingButton
          bookingUrl={hotel.bookingUrl}
          isInteractive={isInteractive}
          isClient={isClient}
        />
      </div>
    </div>
  );
};

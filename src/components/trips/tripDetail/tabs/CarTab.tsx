"use client";

import { CarRentalReservation } from "@/types/trip";
import {
  CarHeader,
  RentalLocations,
  RentalDetails,
  FuelPolicy,
  CarFeatures,
  TotalPrice,
  BookingLink,
  CancelledBanner,
} from "./car";

interface CarTabProps {
  carRental: CarRentalReservation;
  status?: "progress" | "ongoing" | "completed" | "cancelled";
  openGoogleMaps?: (location: string) => void;
  isClient?: boolean;
}

export const CarTab = ({
  carRental,
  status = "progress",
  openGoogleMaps,
  isClient = true,
}: CarTabProps) => {
  const isInteractive = status === "progress" || status === "ongoing";
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-6 animate-fade-in">
      {isCancelled && <CancelledBanner />}

      <div
        className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 ${
          isCancelled ? "opacity-50" : ""
        }`}
      >
        <CarHeader
          company={carRental.company}
          carType={carRental.carType}
          carModel={carRental.carModel}
          imageUrl={carRental.imageUrl}
          confirmationCode={carRental.confirmationCode}
        />

        <RentalLocations
          pickupLocation={carRental.pickupLocation}
          pickupDate={carRental.pickupDate}
          pickupTime={carRental.pickupTime}
          dropoffLocation={carRental.dropoffLocation}
          dropoffDate={carRental.dropoffDate}
          dropoffTime={carRental.dropoffTime}
          isInteractive={isInteractive}
          onOpenMap={openGoogleMaps}
        />

        <RentalDetails
          totalDays={carRental.totalDays}
          pricePerDay={carRental.pricePerDay}
          transmission={carRental.transmission}
          insurance={carRental.insurance}
        />

        <FuelPolicy policy={carRental.fuelPolicy} />

        <CarFeatures features={carRental.features} />

        <TotalPrice price={carRental.totalPrice} />

        <BookingLink
          url={carRental.bookingUrl}
          isInteractive={isInteractive}
          isClient={isClient}
        />
      </div>
    </div>
  );
};

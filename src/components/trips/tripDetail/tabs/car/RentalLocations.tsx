import { LocationCard } from "./LocationCard";

interface RentalLocationsProps {
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  isInteractive: boolean;
  onOpenMap?: (location: string) => void;
}

export const RentalLocations = ({
  pickupLocation,
  pickupDate,
  pickupTime,
  dropoffLocation,
  dropoffDate,
  dropoffTime,
  isInteractive,
  onOpenMap,
}: RentalLocationsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <LocationCard
      type="pickup"
      location={pickupLocation}
      date={pickupDate}
      time={pickupTime}
      isInteractive={isInteractive}
      onOpenMap={onOpenMap}
    />
    <LocationCard
      type="dropoff"
      location={dropoffLocation}
      date={dropoffDate}
      time={dropoffTime}
      isInteractive={isInteractive}
      onOpenMap={onOpenMap}
    />
  </div>
);

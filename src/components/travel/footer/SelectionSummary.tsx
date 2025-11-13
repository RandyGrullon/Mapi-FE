import { SelectionIndicator } from "./SelectionIndicator";

interface SelectionSummaryProps {
  flightsCount: number;
  hotelCount: number;
  carCount: number;
  activitiesCount: number;
  needsFlight: boolean;
  needsHotel: boolean;
  needsCar: boolean;
  needsActivities: boolean;
}

export const SelectionSummary = ({
  flightsCount,
  hotelCount,
  carCount,
  activitiesCount,
  needsFlight,
  needsHotel,
  needsCar,
  needsActivities,
}: SelectionSummaryProps) => (
  <div className="text-sm">
    <span className="font-semibold text-gray-700">Tu selección:</span>
    <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1.5 text-gray-500">
      {needsFlight && (
        <SelectionIndicator
          count={flightsCount}
          label={flightsCount === 1 ? "vuelo" : "vuelos"}
          isActive={flightsCount > 0}
        />
      )}
      {needsHotel && (
        <SelectionIndicator
          count={hotelCount}
          label={hotelCount === 1 ? "hotel" : "hoteles"}
          isActive={hotelCount > 0}
        />
      )}
      {needsCar && (
        <SelectionIndicator
          count={carCount}
          label={carCount === 1 ? "auto" : "autos"}
          isActive={carCount > 0}
        />
      )}
      {needsActivities && (
        <SelectionIndicator
          count={activitiesCount}
          label="actividad(es)"
          isActive={activitiesCount > 0}
        />
      )}
    </div>
  </div>
);

"use client";

import {
  SelectionSummary,
  CreatePackageButton,
  useSelectionCounts,
  useServiceNeeds,
} from "./footer";

interface CustomPackageFooterProps {
  selectedFlight: string | null;
  selectedFlights?: string[]; // Array de vuelos para round-trip/multi-city
  selectedHotel: string | null;
  selectedCar: string | null;
  selectedActivities: string[];
  selectedServices: string[]; // Nuevo: servicios que el usuario seleccionó en el wizard
  hasValidSelection: boolean; // Validación desde el padre
  isCreating?: boolean; // Estado de carga
  onCreatePackage: () => void;
}

export const CustomPackageFooter = ({
  selectedFlight,
  selectedFlights = [],
  selectedHotel,
  selectedCar,
  selectedActivities,
  selectedServices,
  hasValidSelection,
  isCreating = false,
  onCreatePackage,
}: CustomPackageFooterProps) => {
  // Custom hooks para lógica de negocio
  const serviceNeeds = useServiceNeeds(selectedServices);
  const counts = useSelectionCounts({
    selectedFlight,
    selectedFlights,
    selectedHotel,
    selectedCar,
    selectedActivities,
  });

  return (
    <div className="border-t border-gray-200 bg-white shadow-sm flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <SelectionSummary
              flightsCount={counts.flights}
              hotelCount={counts.hotel}
              carCount={counts.car}
              activitiesCount={counts.activities}
              needsFlight={serviceNeeds.needsFlight}
              needsHotel={serviceNeeds.needsHotel}
              needsCar={serviceNeeds.needsCar}
              needsActivities={serviceNeeds.needsActivities}
            />
          </div>
          <CreatePackageButton
            isCreating={isCreating}
            isDisabled={!hasValidSelection || isCreating}
            onClick={onCreatePackage}
          />
        </div>
      </div>
    </div>
  );
};

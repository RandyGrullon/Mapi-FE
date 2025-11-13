import { CheckIcon } from "./HotelIcons";

interface AmenitiesListProps {
  amenities: string[];
}

export const AmenitiesList = ({ amenities }: AmenitiesListProps) => (
  <div className="bg-white rounded-lg p-4 mb-4">
    <h4 className="font-bold mb-3">Servicios Incluidos</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <CheckIcon />
          <span>{amenity}</span>
        </div>
      ))}
    </div>
  </div>
);

import { ActionButton } from "../../../../buttons";
import { MapIcon } from "./HotelIcons";

interface HotelHeaderProps {
  hotelName: string;
  category: string;
  address: string;
  confirmationCode: string;
  isInteractive: boolean;
  onOpenMap: (location: string) => void;
}

export const HotelHeader = ({
  hotelName,
  category,
  address,
  confirmationCode,
  isInteractive,
  onOpenMap,
}: HotelHeaderProps) => (
  <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
      <h3 className="text-2xl font-bold mb-1">{hotelName}</h3>
      <p className="text-green-700 font-medium">{category}</p>
      <p className="text-sm text-gray-600 mt-1">{address}</p>

      {isInteractive && (
        <ActionButton
          onClick={() => onOpenMap(`${hotelName}, ${address}`)}
          variant="primary"
          size="sm"
          className="mt-3"
        >
          <MapIcon />
          Ver en Google Maps
        </ActionButton>
      )}
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-600">Confirmación</p>
      <p className="text-lg font-bold text-green-600">{confirmationCode}</p>
    </div>
  </div>
);

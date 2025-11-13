import { ActionButton } from "../../../../buttons";
import { LocationDetails } from "./LocationDetails";
import { MapIcon } from "./MapIcon";

interface LocationCardProps {
  type: "pickup" | "dropoff";
  location: string;
  date: string;
  time: string;
  isInteractive: boolean;
  onOpenMap?: (location: string) => void;
}

export const LocationCard = ({
  type,
  location,
  date,
  time,
  isInteractive,
  onOpenMap,
}: LocationCardProps) => {
  const isPickup = type === "pickup";
  const title = isPickup ? "Recogida" : "Devolución";
  const titleColor = isPickup ? "text-green-700" : "text-red-700";

  return (
    <div className="bg-white rounded-lg p-4">
      <h4 className={`font-bold mb-3 ${titleColor} flex items-center gap-2`}>
        <span>📍</span> {title}
      </h4>
      <p className="text-gray-700 mb-2">{location}</p>
      {isInteractive && onOpenMap && (
        <ActionButton
          onClick={() => onOpenMap(location)}
          variant="primary"
          size="sm"
          className="mt-2"
        >
          <MapIcon />
          Ver en Maps
        </ActionButton>
      )}
      <LocationDetails date={date} time={time} />
    </div>
  );
};

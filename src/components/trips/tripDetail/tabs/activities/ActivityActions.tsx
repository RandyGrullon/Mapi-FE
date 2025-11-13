import { ActionButton } from "../../../../buttons";
import { MapPinIcon, CheckCircleIcon } from "./ActivityIcons";

interface ActivityActionsProps {
  activityName: string;
  location: string;
  bookingUrl?: string;
  isInteractive: boolean;
  isClient: boolean;
  onOpenMap: (location: string) => void;
}

export const ActivityActions = ({
  activityName,
  location,
  bookingUrl,
  isInteractive,
  isClient,
  onOpenMap,
}: ActivityActionsProps) => (
  <div className="space-y-2 mt-auto">
    <ActionButton
      onClick={() => onOpenMap(`${activityName}, ${location}`)}
      variant="primary"
      size="sm"
      className="w-full justify-center"
    >
      <MapPinIcon />
      Ver ubicación
    </ActionButton>

    {isClient && isInteractive && bookingUrl && (
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <ActionButton
          onClick={() => {}}
          variant="secondary"
          size="sm"
          className="w-full justify-center"
        >
          <CheckCircleIcon />
          Reservar Actividad
        </ActionButton>
      </a>
    )}
  </div>
);

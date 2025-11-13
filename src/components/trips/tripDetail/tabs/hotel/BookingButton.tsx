import { ActionButton } from "../../../../buttons";
import { BookingIcon } from "./HotelIcons";

interface BookingButtonProps {
  bookingUrl?: string;
  isInteractive: boolean;
  isClient: boolean;
}

export const BookingButton = ({
  bookingUrl,
  isInteractive,
  isClient,
}: BookingButtonProps) => {
  if (!isClient || !isInteractive || !bookingUrl) return null;

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3"
    >
      <ActionButton
        onClick={() => {}}
        variant="secondary"
        size="sm"
        className="w-full justify-center"
      >
        <BookingIcon />
        Reservar Hotel
      </ActionButton>
    </a>
  );
};

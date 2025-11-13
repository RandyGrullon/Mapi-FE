interface FlightBookingButtonProps {
  bookingUrl?: string;
  isInteractive: boolean;
  isClient: boolean;
}

export const FlightBookingButton = ({
  bookingUrl,
  isInteractive,
  isClient,
}: FlightBookingButtonProps) => {
  if (!isClient || !isInteractive || !bookingUrl) return null;

  return (
    <div className="pt-4 border-t border-gray-200">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
      >
        Reservar Vuelo
      </a>
    </div>
  );
};

interface BookingLinkProps {
  url?: string;
  isInteractive: boolean;
  isClient: boolean;
}

export const BookingLink = ({
  url,
  isInteractive,
  isClient,
}: BookingLinkProps) => {
  if (!url || !isInteractive || !isClient) return null;

  return (
    <div className="mt-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
      >
        Ver Detalles de Reserva
      </a>
    </div>
  );
};

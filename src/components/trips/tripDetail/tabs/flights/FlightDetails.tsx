interface FlightDetailsProps {
  baggage: string;
  confirmationCode: string;
}

export const FlightDetails = ({
  baggage,
  confirmationCode,
}: FlightDetailsProps) => (
  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
    <div>
      <p className="text-sm text-gray-600">Equipaje</p>
      <p className="text-sm font-medium">{baggage}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">Confirmación</p>
      <p className="text-sm font-bold text-blue-600">{confirmationCode}</p>
    </div>
  </div>
);

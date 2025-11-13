import { CardButton } from "../../../../buttons";

interface HotelCardProps {
  hotelName: string;
  nights: number;
  onNavigate: () => void;
}

export const HotelCard = ({
  hotelName,
  nights,
  onNavigate,
}: HotelCardProps) => (
  <CardButton
    onClick={onNavigate}
    icon="🏨"
    title="Hotel"
    subtitle="Alojamiento"
  >
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Hotel</span>
      <span className="font-medium text-gray-900">{hotelName}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Duración</span>
      <span className="text-sm text-gray-900">{nights} noches</span>
    </div>
  </CardButton>
);

import { CardButton } from "../../../../buttons";

interface CarRentalCardProps {
  carType: string;
  totalDays: number;
  onNavigate: () => void;
}

export const CarRentalCard = ({
  carType,
  totalDays,
  onNavigate,
}: CarRentalCardProps) => (
  <CardButton
    onClick={onNavigate}
    icon="🚗"
    title="Renta de Auto"
    subtitle="Vehículo reservado"
  >
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Vehículo</span>
      <span className="font-medium text-gray-900">{carType}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Duración</span>
      <span className="text-sm text-gray-900">{totalDays} días</span>
    </div>
  </CardButton>
);

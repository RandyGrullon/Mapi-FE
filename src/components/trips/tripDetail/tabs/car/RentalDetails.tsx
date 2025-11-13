import { InfoCard } from "./InfoCard";

interface RentalDetailsProps {
  totalDays: number;
  pricePerDay: number;
  transmission: string;
  insurance?: boolean | string;
}

export const RentalDetails = ({
  totalDays,
  pricePerDay,
  transmission,
  insurance,
}: RentalDetailsProps) => {
  const insuranceValue = insurance ? "Incluido" : "No";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <InfoCard label="Días de Renta" value={totalDays} />
      <InfoCard label="Precio/Día" value={`$${pricePerDay.toFixed(2)}`} />
      <InfoCard label="Transmisión" value={transmission} />
      <InfoCard label="Seguro" value={insuranceValue} />
    </div>
  );
};

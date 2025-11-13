import { InfoCard } from "./InfoCard";

interface HotelDatesProps {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
}

export const HotelDates = ({
  checkIn,
  checkOut,
  nights,
  guests,
}: HotelDatesProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <InfoCard label="Check-in" value={checkIn} />
    <InfoCard label="Check-out" value={checkOut} />
    <InfoCard label="Noches" value={nights} />
    <InfoCard label="Huéspedes" value={guests} />
  </div>
);

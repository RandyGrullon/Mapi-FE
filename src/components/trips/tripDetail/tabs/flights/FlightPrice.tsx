interface FlightPriceProps {
  price: number;
}

export const FlightPrice = ({ price }: FlightPriceProps) => (
  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
    <span className="text-sm text-gray-600">Precio</span>
    <span className="text-2xl font-bold text-blue-600">${price}</span>
  </div>
);

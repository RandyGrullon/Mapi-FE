interface HotelPricingProps {
  pricePerNight: number;
  totalPrice: number;
}

export const HotelPricing = ({
  pricePerNight,
  totalPrice,
}: HotelPricingProps) => (
  <div className="flex items-center justify-between bg-white rounded-lg p-4">
    <div>
      <p className="text-sm text-gray-600">Precio por noche</p>
      <p className="text-xl font-bold text-green-600">${pricePerNight}</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-600">Precio total</p>
      <p className="text-2xl font-bold text-green-600">${totalPrice}</p>
    </div>
  </div>
);

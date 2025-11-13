interface TotalPriceProps {
  price: number;
}

export const TotalPrice = ({ price }: TotalPriceProps) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4">
    <div className="flex justify-between items-center text-white">
      <span className="text-lg font-semibold">Precio Total</span>
      <span className="text-2xl font-bold">${price.toFixed(2)}</span>
    </div>
  </div>
);

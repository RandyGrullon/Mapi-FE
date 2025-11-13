interface CostItemProps {
  icon: string;
  label: string;
  amount: number;
  isTotal?: boolean;
}

export const CostItem = ({
  icon,
  label,
  amount,
  isTotal = false,
}: CostItemProps) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-2">
      <span className="text-2xl mr-2">{icon}</span>
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
    <p
      className={`font-bold text-gray-900 ${isTotal ? "text-2xl" : "text-xl"}`}
    >
      ${amount.toLocaleString()}
    </p>
  </div>
);

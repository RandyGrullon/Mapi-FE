interface BudgetItemProps {
  label: string;
  amount: number;
  icon: string;
  color: string;
  total: number;
}

export const BudgetItem = ({
  label,
  amount,
  icon,
  color,
  total,
}: BudgetItemProps) => {
  const percentage = ((amount / total) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">${amount}</p>
          <p className="text-xs text-gray-600">{percentage}%</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-600 h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

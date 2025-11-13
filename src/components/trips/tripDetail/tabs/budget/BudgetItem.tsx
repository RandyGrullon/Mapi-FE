interface BudgetItemProps {
  icon: string;
  label: string;
  amount: number;
  percentage: string;
}

export const BudgetItem = ({
  icon,
  label,
  amount,
  percentage,
}: BudgetItemProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          ${amount.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">{percentage}%</p>
      </div>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="bg-gray-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

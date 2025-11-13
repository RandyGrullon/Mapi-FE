interface CostCardProps {
  icon: string;
  title: string;
  amount: string;
  description: string;
}

export const CostCard = ({
  icon,
  title,
  amount,
  description,
}: CostCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-gray-900">{title}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900">{amount}</p>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
);

import { CardButton } from "../../../../buttons";

interface BudgetCardProps {
  total: number;
  travelers: number;
  onNavigate: () => void;
}

export const BudgetCard = ({
  total,
  travelers,
  onNavigate,
}: BudgetCardProps) => {
  const perPerson = (total / travelers).toFixed(2);

  return (
    <CardButton
      onClick={onNavigate}
      icon="💰"
      title="Presupuesto"
      subtitle="Resumen de costos"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Total estimado</span>
        <span className="font-medium text-gray-900">
          ${total.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Por persona</span>
        <span className="text-sm text-gray-900">${perPerson}</span>
      </div>
    </CardButton>
  );
};

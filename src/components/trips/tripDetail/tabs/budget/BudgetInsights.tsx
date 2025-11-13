import { BudgetBreakdownItem } from "./BudgetBreakdown";

interface BudgetInsightsProps {
  items: BudgetBreakdownItem[];
  travelers: number;
  nights: number;
}

export const BudgetInsights = ({
  items,
  travelers,
  nights,
}: BudgetInsightsProps) => {
  const topCategory = items.reduce((max, item) =>
    item.amount > max.amount ? item : max
  ).label;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        Información del Presupuesto
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Categoría principal</p>
          <p className="font-medium text-gray-900">{topCategory}</p>
        </div>
        <div>
          <p className="text-gray-600">Viajeros</p>
          <p className="font-medium text-gray-900">{travelers}</p>
        </div>
        <div>
          <p className="text-gray-600">Duración</p>
          <p className="font-medium text-gray-900">{nights + 1} días</p>
        </div>
      </div>
    </div>
  );
};

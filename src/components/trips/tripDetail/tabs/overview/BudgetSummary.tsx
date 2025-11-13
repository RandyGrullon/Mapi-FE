import { CostItem } from "./CostItem";

interface Budget {
  flights: number;
  hotel: number;
  carRental: number;
  activities: number;
  total: number;
}

interface BudgetSummaryProps {
  budget: Budget;
  hasCarRental: boolean;
}

export const BudgetSummary = ({ budget, hasCarRental }: BudgetSummaryProps) => {
  const showCarRental = hasCarRental && budget.carRental > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Resumen de Costos
        </h3>
      </div>

      <div className="p-6">
        <div
          className={`grid grid-cols-2 ${
            showCarRental ? "md:grid-cols-5" : "md:grid-cols-4"
          } gap-6`}
        >
          <CostItem icon="✈️" label="Vuelos" amount={budget.flights} />
          <CostItem icon="🏨" label="Hotel" amount={budget.hotel} />
          {showCarRental && (
            <CostItem icon="🚗" label="Auto" amount={budget.carRental} />
          )}
          <CostItem icon="🎯" label="Actividades" amount={budget.activities} />
          <CostItem icon="💰" label="Total" amount={budget.total} isTotal />
        </div>
      </div>
    </div>
  );
};

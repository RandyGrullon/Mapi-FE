import { CostCard } from "./CostCard";

interface CostAnalysisProps {
  totalBudget: number;
  nights: number;
}

export const CostAnalysis = ({ totalBudget, nights }: CostAnalysisProps) => {
  const costPerNight = (totalBudget / nights).toFixed(2);
  const costPerDay = (totalBudget / (nights + 1)).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CostCard
        icon="🏨"
        title="Costo por Noche"
        amount={`$${costPerNight}`}
        description={`Basado en ${nights} noches`}
      />
      <CostCard
        icon="📅"
        title="Costo por Día"
        amount={`$${costPerDay}`}
        description="Promedio diario del viaje"
      />
    </div>
  );
};

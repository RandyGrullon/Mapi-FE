import { CompletedTrip } from "@/types/trip";
import { BudgetBreakdownItem } from "./BudgetBreakdown";

export const useBudgetItems = (trip: CompletedTrip): BudgetBreakdownItem[] => {
  const { budget } = trip;

  const items: BudgetBreakdownItem[] = [
    { label: "Vuelos", amount: budget.flights, icon: "✈️" },
    { label: "Hotel", amount: budget.hotel, icon: "🏨" },
  ];

  if (budget.carRental > 0) {
    items.push({
      label: "Renta de Auto",
      amount: budget.carRental,
      icon: "🚗",
    });
  }

  items.push(
    { label: "Actividades", amount: budget.activities, icon: "🎯" },
    { label: "Extras", amount: budget.extras, icon: "🎁" }
  );

  return items;
};

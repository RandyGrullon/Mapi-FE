"use client";

import { CompletedTrip } from "@/types/trip";
import {
  BudgetSummary,
  BudgetBreakdown,
  CostAnalysis,
  BudgetInsights,
  useBudgetItems,
} from "./budget";

interface BudgetTabProps {
  trip: CompletedTrip;
}

export const BudgetTab = ({ trip }: BudgetTabProps) => {
  const { budget, travelers, hotel } = trip;
  const items = useBudgetItems(trip);
  const perPerson = budget.total / travelers;

  return (
    <div className="space-y-8 animate-fade-in">
      <BudgetSummary total={budget.total} perPerson={perPerson} />

      <BudgetBreakdown items={items} total={budget.total} />

      <CostAnalysis totalBudget={budget.total} nights={hotel.nights} />

      <BudgetInsights
        items={items}
        travelers={travelers}
        nights={hotel.nights}
      />
    </div>
  );
};

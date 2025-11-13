interface BudgetSummaryProps {
  total: number;
  perPerson: number;
}

export const BudgetSummary = ({ total, perPerson }: BudgetSummaryProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Presupuesto Total
      </h3>
      <p className="text-4xl font-bold text-gray-900 mb-1">
        ${total.toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        ${perPerson.toFixed(2)} por persona
      </p>
    </div>
  </div>
);

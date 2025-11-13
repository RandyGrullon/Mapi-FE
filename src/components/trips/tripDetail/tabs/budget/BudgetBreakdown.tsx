import { BudgetItem } from "./BudgetItem";

export interface BudgetBreakdownItem {
  label: string;
  amount: number;
  icon: string;
}

interface BudgetBreakdownProps {
  items: BudgetBreakdownItem[];
  total: number;
}

export const BudgetBreakdown = ({ items, total }: BudgetBreakdownProps) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Desglose de Gastos
      </h3>
    </div>

    <div className="p-6 space-y-4">
      {items.map((item, index) => {
        const percentage = ((item.amount / total) * 100).toFixed(1);
        return (
          <BudgetItem
            key={index}
            icon={item.icon}
            label={item.label}
            amount={item.amount}
            percentage={percentage}
          />
        );
      })}
    </div>
  </div>
);

interface SelectionIndicatorProps {
  count: number;
  label: string;
  isActive: boolean;
}

export const SelectionIndicator = ({
  count,
  label,
  isActive,
}: SelectionIndicatorProps) => (
  <span
    className={`flex items-center gap-1.5 ${
      isActive ? "text-gray-900 font-medium" : ""
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        isActive ? "bg-gray-900" : "bg-gray-300"
      }`}
    ></span>
    {count} {label}
  </span>
);

interface TabButtonProps {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const TabButton = ({
  id,
  label,
  icon,
  isActive,
  onClick,
  className = "",
}: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all relative ${
        isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
      } ${className}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
      )}
    </button>
  );
};

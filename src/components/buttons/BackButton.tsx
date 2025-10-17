interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const BackButton = ({
  onClick,
  label = "Volver",
  className = "",
}: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

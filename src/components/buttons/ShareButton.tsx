interface ShareButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  showLabelOnMobile?: boolean;
}

export const ShareButton = ({
  onClick,
  label = "Compartir",
  className = "",
  showLabelOnMobile = false,
}: ShareButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm border border-blue-700 ${className}`}
    >
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      <span className={showLabelOnMobile ? "" : "hidden sm:inline"}>
        {label}
      </span>
    </button>
  );
};

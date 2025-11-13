interface LogoutButtonProps {
  onLogout: (e: React.MouseEvent) => void;
  isLoading: boolean;
}

export const LogoutButton = ({ onLogout, isLoading }: LogoutButtonProps) => {
  return (
    <button
      onClick={onLogout}
      disabled={isLoading}
      className="p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
      title="Cerrar sesión"
      aria-label="Cerrar sesión"
    >
      {isLoading ? (
        <svg
          className="w-5 h-5 text-gray-400 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-gray-600 group-hover:text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      )}
    </button>
  );
};

/**
 * Botones de acción del resumen
 */

"use client";

interface SummaryActionsProps {
  isSearching: boolean;
  searchStage: string;
  onStartOver: () => void;
  onSearchOptions: () => void;
}

export const SummaryActions = ({
  isSearching,
  searchStage,
  onStartOver,
  onSearchOptions,
}: SummaryActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onStartOver}
        disabled={isSearching}
        className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Empezar de nuevo
      </button>
      <button
        onClick={onSearchOptions}
        disabled={isSearching}
        className="flex-1 px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isSearching ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{searchStage}</span>
          </>
        ) : (
          <>
            <span>Buscar opciones</span>
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

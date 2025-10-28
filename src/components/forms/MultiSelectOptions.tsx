"use client";

interface MultiSelectOptionsProps {
  options: string[];
  selectedValues: string[];
  onToggle: (option: string) => void;
  onRemove: (option: string) => void;
  isLoading: boolean;
}

export const MultiSelectOptions = ({
  options,
  selectedValues,
  onToggle,
  onRemove,
  isLoading,
}: MultiSelectOptionsProps) => {
  return (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option, idx) => {
          const isSelected = selectedValues.includes(option);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onToggle(option)}
              className={`p-3 text-left rounded-lg border-2 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transform hover:scale-[1.02] ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white"
              }`}
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {selectedValues.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-medium mb-1">
            Seleccionadas ({selectedValues.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((opt, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
              >
                {opt}
                <button
                  type="button"
                  onClick={() => onRemove(opt)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

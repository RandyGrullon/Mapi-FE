"use client";

interface SelectOptionsProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isLoading: boolean;
}

export const SelectOptions = ({
  options,
  selectedValue,
  onSelect,
  isLoading,
}: SelectOptionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
      {options.map((option, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(option)}
          className={`p-3 text-left rounded-lg border-2 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transform hover:scale-[1.02] ${
            selectedValue === option
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 bg-white"
          }`}
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedValue === option
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedValue === option && (
                <svg
                  className="w-3 h-3 text-white"
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
            <span className="text-sm font-medium text-gray-700">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

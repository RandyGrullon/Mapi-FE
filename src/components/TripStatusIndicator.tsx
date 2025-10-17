"use client";

interface TripStatusIndicatorProps {
  isSelected: boolean;
  size?: "sm" | "md";
}

export const TripStatusIndicator = ({
  isSelected,
  size = "md",
}: TripStatusIndicatorProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${
        isSelected ? "bg-blue-500" : "bg-gray-400"
      }`}
    ></div>
  );
};

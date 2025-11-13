interface FlightIconProps {
  type: "outbound" | "return";
}

export const FlightIcon = ({ type }: FlightIconProps) => (
  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
    <span className="text-2xl">{type === "outbound" ? "🛫" : "🛬"}</span>
  </div>
);

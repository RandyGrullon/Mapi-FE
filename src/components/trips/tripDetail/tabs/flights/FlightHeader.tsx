import { FlightIcon } from "./FlightIcon";

interface FlightHeaderProps {
  type: "outbound" | "return";
  airline: string;
  flightNumber: string;
  flightClass: string;
}

export const FlightHeader = ({
  type,
  airline,
  flightNumber,
  flightClass,
}: FlightHeaderProps) => {
  const title = type === "outbound" ? "Vuelo de Ida" : "Vuelo de Regreso";

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <FlightIcon type={type} />
        <div>
          <h4 className="font-bold text-lg text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">
            {airline} {flightNumber}
          </p>
        </div>
      </div>
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
        {flightClass}
      </span>
    </div>
  );
};

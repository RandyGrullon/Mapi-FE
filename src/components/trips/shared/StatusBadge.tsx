import { CompletedTrip } from "@/types/trip";
import { getStatusBadgeConfig } from "../tripDetail/tripDetailUtils";

interface StatusBadgeProps {
  status: CompletedTrip["status"];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const badge = getStatusBadgeConfig(status);

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
    >
      {badge.text}
    </span>
  );
};

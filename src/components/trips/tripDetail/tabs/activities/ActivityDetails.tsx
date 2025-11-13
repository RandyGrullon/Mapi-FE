import { CalendarIcon, ClockIcon, LocationIcon } from "./ActivityIcons";

interface ActivityDetailsProps {
  date: string;
  time: string;
  duration: string;
  location: string;
}

export const ActivityDetails = ({
  date,
  time,
  duration,
  location,
}: ActivityDetailsProps) => (
  <div className="space-y-2 text-sm mb-4">
    <div className="flex items-center gap-2">
      <CalendarIcon />
      <span className="truncate">
        {date} • {time}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <ClockIcon />
      <span className="truncate">Duración: {duration}</span>
    </div>
    <div className="flex items-center gap-2">
      <LocationIcon />
      <span className="truncate">{location}</span>
    </div>
  </div>
);

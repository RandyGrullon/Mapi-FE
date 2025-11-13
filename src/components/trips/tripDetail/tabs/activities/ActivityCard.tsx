import { ActivityHeader } from "./ActivityHeader";
import { ActivityDetails } from "./ActivityDetails";
import { ActivityIncludes } from "./ActivityIncludes";
import { ConfirmationCode } from "./ConfirmationCode";
import { ActivityActions } from "./ActivityActions";

interface Activity {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  included: string[];
  confirmationCode: string;
  bookingUrl?: string;
}

interface ActivityCardProps {
  activity: Activity;
  isInteractive: boolean;
  isClient: boolean;
  onOpenMap: (location: string) => void;
}

export const ActivityCard = ({
  activity,
  isInteractive,
  isClient,
  onOpenMap,
}: ActivityCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all animate-fade-in flex flex-col h-full">
    <ActivityHeader
      name={activity.name}
      category={activity.category}
      price={activity.price}
    />

    <div className="mb-4 flex-grow">
      <p className="text-sm text-gray-700 line-clamp-3">
        {activity.description}
      </p>
    </div>

    <ActivityDetails
      date={activity.date}
      time={activity.time}
      duration={activity.duration}
      location={activity.location}
    />

    <ActivityIncludes included={activity.included} />

    <ConfirmationCode code={activity.confirmationCode} />

    <ActivityActions
      activityName={activity.name}
      location={activity.location}
      bookingUrl={activity.bookingUrl}
      isInteractive={isInteractive}
      isClient={isClient}
      onOpenMap={onOpenMap}
    />
  </div>
);

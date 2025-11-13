import { JoinRequest } from "@/types/notification";

interface TripDetailsProps {
  request: JoinRequest;
}

export const TripDetails = ({ request }: TripDetailsProps) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
      Viaje
    </h4>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900 mb-2">{request.tripName}</p>
      <p className="text-sm text-gray-600 mb-3">
        {new Date(request.tripDates.start + "T00:00:00").toLocaleDateString(
          "es-ES",
          {
            month: "long",
            day: "numeric",
          }
        )}{" "}
        -{" "}
        {new Date(request.tripDates.end + "T00:00:00").toLocaleDateString(
          "es-ES",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        )}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {request.tripDestination}
      </div>
    </div>
  </div>
);

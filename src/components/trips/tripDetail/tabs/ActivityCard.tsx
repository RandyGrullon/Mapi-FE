import { ActivityReservation } from "@/types/trip";

interface ActivityCardProps {
  activity: ActivityReservation;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-lg mb-1">{activity.name}</h4>
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
            {activity.category}
          </span>
        </div>
        <span className="text-xl font-bold text-purple-600">
          ${activity.price}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3">{activity.description}</p>

      <div className="space-y-2 text-sm mb-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {activity.date} • {activity.time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Duración: {activity.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-purple-600"
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
          <span>{activity.location}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-600 mb-1">Incluye:</p>
        <div className="flex flex-wrap gap-1">
          {activity.included.map((item, index) => (
            <span
              key={index}
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-2">
        <p className="text-xs text-gray-600">Código de confirmación</p>
        <p className="text-sm font-bold text-purple-600">
          {activity.confirmationCode}
        </p>
      </div>
    </div>
  );
};

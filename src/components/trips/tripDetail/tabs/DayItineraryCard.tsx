import { DayItinerary } from "@/types/trip";
import { formatDateWithWeekday } from "../tripDetailUtils";

interface DayItineraryCardProps {
  day: DayItinerary;
  index: number;
}

export const DayItineraryCard = ({ day, index }: DayItineraryCardProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
          {day.day}
        </div>
        <div>
          <h4 className="font-bold text-lg">{day.title}</h4>
          <p className="text-sm text-gray-600">
            {formatDateWithWeekday(day.date)}
          </p>
        </div>
      </div>

      {day.activities.length > 0 && (
        <div className="bg-white rounded-lg p-4 mb-3">
          <h5 className="font-bold text-sm mb-2">Actividades del día</h5>
          <div className="space-y-2">
            {day.activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg"
              >
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-xs text-gray-600">
                    {activity.time} • {activity.duration}
                  </p>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  ${activity.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
        <div className="bg-white rounded-lg p-4 mb-3">
          <h5 className="font-bold text-sm mb-2">Comidas</h5>
          <div className="space-y-1 text-sm">
            {day.meals.breakfast && (
              <p className="flex items-center gap-2">
                <span>🍳</span>
                <span>{day.meals.breakfast}</span>
              </p>
            )}
            {day.meals.lunch && (
              <p className="flex items-center gap-2">
                <span>🍽️</span>
                <span>{day.meals.lunch}</span>
              </p>
            )}
            {day.meals.dinner && (
              <p className="flex items-center gap-2">
                <span>🍷</span>
                <span>{day.meals.dinner}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {day.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Nota:</span> {day.notes}
          </p>
        </div>
      )}
    </div>
  );
};

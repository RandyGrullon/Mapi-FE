import { CompletedTrip } from "@/types/trip";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
};

export const formatDateWithWeekday = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const getStatusBadgeConfig = (status: CompletedTrip["status"]) => {
  const badges = {
    progress: { text: "📋 En Progreso", color: "bg-blue-100 text-blue-800" },
    ongoing: { text: "En curso", color: "bg-green-100 text-green-800" },
    completed: { text: "Completado", color: "bg-gray-100 text-gray-800" },
    cancelled: { text: "Cancelado", color: "bg-red-100 text-red-800" },
  };

  return badges[status] || badges.progress;
};

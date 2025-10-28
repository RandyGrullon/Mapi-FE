"use client";

import { CompletedTrip } from "../trips/CompletedTripsManager";

export const formatTripDate = (date: Date) => {
  return date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTripDateShort = (date: Date) => {
  return date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
};

export const getTripStatusText = (status: CompletedTrip["status"]) => {
  switch (status) {
    case "progress":
      return "En progreso";
    case "ongoing":
      return "En curso";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Desconocido";
  }
};

export const getTripStatusColor = (status: CompletedTrip["status"]) => {
  switch (status) {
    case "progress":
      return "text-blue-600";
    case "ongoing":
      return "text-green-600";
    case "completed":
      return "text-gray-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

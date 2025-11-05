/**
 * Notification Panel Component
 * Panel desplegable con lista de notificaciones
 */

"use client";

import { useNotificationStore } from "@/stores/notificationStore";
import { TripNotification } from "@/types/notification";
import { JoinRequestModal } from "./JoinRequestModal";
import { useState } from "react";
import { CompletedTripsManager, TripParticipant } from "../trips/CompletedTripsManager";

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    approveJoinRequest,
    rejectJoinRequest,
    getPendingRequests,
  } = useNotificationStore();

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleApprove = (notification: TripNotification) => {
    // Buscar la solicitud pendiente
    const requests = getPendingRequests(notification.tripId);
    const request = requests.find(
      (req) => req.requesterEmail === notification.from.email
    );

    if (!request) return;

    // Aprobar solicitud
    const approvedRequest = approveJoinRequest(request.id);
    if (!approvedRequest) return;

    // Agregar participante al viaje
    const trips = CompletedTripsManager.getAllTrips();
    const trip = trips.find((t) => t.id === notification.tripId);

    if (trip) {
      const newParticipant: TripParticipant = {
        id: approvedRequest.requesterId,
        name: approvedRequest.requesterName,
        email: approvedRequest.requesterEmail,
        role: "participant",
        joinedAt: new Date().toISOString(),
      };

      const updatedTrip = {
        ...trip,
        participants: [...(trip.participants || []), newParticipant],
      };

      CompletedTripsManager.saveTrip(updatedTrip);
    }

    // Marcar notificación como leída
    markAsRead(notification.id);
  };

  const handleReject = (notification: TripNotification) => {
    const requests = getPendingRequests(notification.tripId);
    const request = requests.find(
      (req) => req.requesterEmail === notification.from.email
    );

    if (request) {
      rejectJoinRequest(request.id);
    }

    markAsRead(notification.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="w-full md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[calc(100vh-100px)] md:max-h-[600px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 flex-shrink-0 bg-white">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({unreadCount})
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2 md:gap-3">
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-xs md:text-sm text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium transition-colors whitespace-nowrap touch-manipulation"
            >
              Marcar todas
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors touch-manipulation"
            aria-label="Cerrar notificaciones"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray-500 font-medium">No hay notificaciones</p>
            <p className="text-sm text-gray-400 mt-1">
              Te notificaremos cuando haya algo nuevo
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 md:p-5 hover:bg-gray-50 transition-colors ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                      {notification.from.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Solicita unirse a tu viaje
                    </p>
                    {notification.message && (
                      <p className="text-sm text-gray-500 mt-1.5 italic line-clamp-2">
                        "{notification.message}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(notification.createdAt)}
                    </p>

                    {/* Actions */}
                    {notification.status === "pending" && (
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleApprove(notification)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors touch-manipulation"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleReject(notification)}
                          className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors touch-manipulation"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}

                    {notification.status === "accepted" && (
                      <div className="mt-3 text-sm text-green-600 font-medium">
                        ✓ Solicitud aceptada
                      </div>
                    )}

                    {notification.status === "rejected" && (
                      <div className="mt-3 text-sm text-gray-500">
                        Solicitud rechazada
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    title="Eliminar"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

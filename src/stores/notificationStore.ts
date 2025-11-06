/**
 * Notification Store
 * Zustand store para gestionar notificaciones y solicitudes de unión
 */

import { create } from "zustand";
import {
  Notification,
  JoinRequest,
  NotificationStore,
} from "@/types/notification";

const NOTIFICATIONS_KEY = "mapi_notifications";
const JOIN_REQUESTS_KEY = "mapi_join_requests";

// Helper functions para localStorage
const loadNotifications = (): Notification[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading notifications:", error);
    return [];
  }
};

const saveNotifications = (notifications: Notification[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error("Error saving notifications:", error);
  }
};

const loadJoinRequests = (): JoinRequest[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(JOIN_REQUESTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading join requests:", error);
    return [];
  }
};

const saveJoinRequests = (requests: JoinRequest[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving join requests:", error);
  }
};

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: loadNotifications(),
  joinRequests: loadJoinRequests(),
  unreadCount: loadNotifications().filter((n) => !n.read).length,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const notifications = [newNotification, ...state.notifications];
      saveNotifications(notifications);
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },

  markAsRead: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      saveNotifications(notifications);
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      saveNotifications(notifications);
      return {
        notifications,
        unreadCount: 0,
      };
    });
  },

  deleteNotification: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.filter(
        (n) => n.id !== notificationId
      );
      saveNotifications(notifications);
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },

  clearAll: () => {
    set(() => {
      saveNotifications([]);
      return {
        notifications: [],
        unreadCount: 0,
      };
    });
  },

  createJoinRequest: (request) => {
    const newRequest: JoinRequest = {
      ...request,
      id: generateId(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const joinRequests = [newRequest, ...state.joinRequests];
      saveJoinRequests(joinRequests);
      return { joinRequests };
    });

    // Crear notificación para el organizador del viaje
    get().addNotification({
      type: "join_request",
      title: "Nueva solicitud para unirse",
      message: `${request.requesterName} quiere unirse a tu viaje a ${request.tripDestination}`,
      read: false,
      data: {
        tripId: request.tripId,
        requestId: newRequest.id,
      },
    });

    return newRequest.id;
  },

  acceptJoinRequest: (requestId) => {
    set((state) => {
      const joinRequests = state.joinRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "accepted" as const,
              respondedAt: new Date().toISOString(),
            }
          : r
      );
      saveJoinRequests(joinRequests);

      const request = joinRequests.find((r) => r.id === requestId);
      if (request) {
        // Notificar al solicitante
        get().addNotification({
          type: "join_accepted",
          title: "¡Solicitud aceptada!",
          message: `Tu solicitud para unirte al viaje a ${request.tripDestination} ha sido aceptada`,
          read: false,
          data: {
            tripId: request.tripId,
            requestId: requestId,
          },
        });
      }

      return { joinRequests };
    });
  },

  rejectJoinRequest: (requestId, reason) => {
    set((state) => {
      const joinRequests = state.joinRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "rejected" as const,
              respondedAt: new Date().toISOString(),
            }
          : r
      );
      saveJoinRequests(joinRequests);

      const request = joinRequests.find((r) => r.id === requestId);
      if (request) {
        // Notificar al solicitante
        get().addNotification({
          type: "join_rejected",
          title: "Solicitud rechazada",
          message:
            reason ||
            `Tu solicitud para unirte al viaje a ${request.tripDestination} ha sido rechazada`,
          read: false,
          data: {
            tripId: request.tripId,
            requestId: requestId,
          },
        });
      }

      return { joinRequests };
    });
  },

  getRequestsByTrip: (tripId) => {
    return get().joinRequests.filter((r) => r.tripId === tripId);
  },

  getPendingRequests: () => {
    return get().joinRequests.filter((r) => r.status === "pending");
  },
}));

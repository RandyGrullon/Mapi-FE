/**
 * Notification Store
 * Gestión de notificaciones usando Zustand
 */

import { create } from "zustand";
import { TripNotification, JoinRequest } from "@/types/notification";

interface NotificationState {
  notifications: TripNotification[];
  joinRequests: JoinRequest[];
  addNotification: (notification: Omit<TripNotification, "id" | "createdAt">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  getUnreadCount: () => number;
  addJoinRequest: (request: Omit<JoinRequest, "id" | "createdAt" | "status">) => string;
  approveJoinRequest: (requestId: string) => JoinRequest | null;
  rejectJoinRequest: (requestId: string) => void;
  getPendingRequests: (tripId: string) => JoinRequest[];
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const STORAGE_KEY = "mapi_notifications";
const REQUESTS_KEY = "mapi_join_requests";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  joinRequests: [],

  addNotification: (notification) => {
    const newNotification: TripNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
    get().saveToStorage();
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    }));
    get().saveToStorage();
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notif) => ({
        ...notif,
        read: true,
      })),
    }));
    get().saveToStorage();
  },

  deleteNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notif) => notif.id !== notificationId
      ),
    }));
    get().saveToStorage();
  },

  getUnreadCount: () => {
    return get().notifications.filter((notif) => !notif.read).length;
  },

  addJoinRequest: (request) => {
    const newRequest: JoinRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    set((state) => ({
      joinRequests: [newRequest, ...state.joinRequests],
    }));
    
    // Agregar notificación para el owner del viaje
    get().addNotification({
      tripId: request.tripId,
      tripName: "Viaje", // Se actualizará con el nombre real
      type: "join_request",
      from: {
        name: request.requesterName,
        email: request.requesterEmail,
      },
      message: request.message,
      read: false,
      status: "pending",
    });

    get().saveToStorage();
    return newRequest.id;
  },

  approveJoinRequest: (requestId) => {
    const request = get().joinRequests.find((req) => req.id === requestId);
    if (!request) return null;

    set((state) => ({
      joinRequests: state.joinRequests.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      ),
    }));

    get().saveToStorage();
    return { ...request, status: "approved" as const };
  },

  rejectJoinRequest: (requestId) => {
    set((state) => ({
      joinRequests: state.joinRequests.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      ),
    }));
    get().saveToStorage();
  },

  getPendingRequests: (tripId) => {
    return get().joinRequests.filter(
      (req) => req.tripId === tripId && req.status === "pending"
    );
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedRequests = localStorage.getItem(REQUESTS_KEY);

      if (stored) {
        const notifications = JSON.parse(stored);
        set({ notifications });
      }

      if (storedRequests) {
        const joinRequests = JSON.parse(storedRequests);
        set({ joinRequests });
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  },

  saveToStorage: () => {
    if (typeof window === "undefined") return;

    try {
      const { notifications, joinRequests } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(joinRequests));
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  },
}));

// Cargar notificaciones al iniciar
if (typeof window !== "undefined") {
  useNotificationStore.getState().loadFromStorage();
}

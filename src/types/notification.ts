/**
 * Notification Types
 * Tipos para el sistema de notificaciones
 */

export interface JoinRequest {
  id: string;
  tripId: string;
  tripName: string;
  tripDestination: string;
  tripDates: {
    start: string;
    end: string;
  };
  requesterName: string;
  requesterEmail: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  respondedAt?: string;
}

export interface Notification {
  id: string;
  type: "join_request" | "join_accepted" | "join_rejected" | "trip_update";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    tripId?: string;
    requestId?: string;
    [key: string]: any;
  };
}

export interface NotificationStore {
  notifications: Notification[];
  joinRequests: JoinRequest[];
  unreadCount: number;

  // Actions
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;

  // Join Requests
  createJoinRequest: (
    request: Omit<JoinRequest, "id" | "createdAt" | "status">
  ) => string;
  acceptJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string, reason?: string) => void;
  getRequestsByTrip: (tripId: string) => JoinRequest[];
  getPendingRequests: () => JoinRequest[];
}

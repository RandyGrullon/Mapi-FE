/**
 * Trip Notification Types
 * Tipos para el sistema de notificaciones de viajes
 */

export type NotificationType = "join_request" | "join_accepted" | "join_rejected";

export interface TripNotification {
  id: string;
  tripId: string;
  tripName: string;
  type: NotificationType;
  from: {
    name: string;
    email: string;
  };
  message?: string;
  createdAt: string;
  read: boolean;
  status: "pending" | "accepted" | "rejected";
}

export interface JoinRequest {
  id: string;
  tripId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

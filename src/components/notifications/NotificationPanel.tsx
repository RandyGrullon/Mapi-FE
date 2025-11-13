/**
 * Notification Panel Component
 * Panel deslizable con lista de notificaciones
 */

"use client";

import { useNotificationStore } from "@/stores/notificationStore";
import { useState } from "react";
import {
  PanelOverlay,
  PanelHeader,
  ActionsBar,
  NotificationList,
  RequestList,
} from "./panel";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestClick: (requestId: string) => void;
}

export const NotificationPanel = ({
  isOpen,
  onClose,
  onRequestClick,
}: NotificationPanelProps) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getPendingRequests,
  } = useNotificationStore();

  const pendingRequests = getPendingRequests();
  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");

  if (!isOpen) return null;

  return (
    <>
      <PanelOverlay onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <PanelHeader
          onClose={onClose}
          unreadCount={unreadCount}
          pendingRequestsCount={pendingRequests.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "all" && (
          <ActionsBar
            hasNotifications={notifications.length > 0}
            unreadCount={unreadCount}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAll}
          />
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "all" ? (
            <NotificationList
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onRequestClick={onRequestClick}
            />
          ) : (
            <RequestList
              requests={pendingRequests}
              onRequestClick={onRequestClick}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

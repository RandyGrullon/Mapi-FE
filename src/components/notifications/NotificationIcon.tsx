/**
 * Notification Icon Component
 * Icono de notificaciones con badge de contador
 */

"use client";

import { useState, useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

interface NotificationIconProps {
  onClick: () => void;
}

export const NotificationIcon = ({ onClick }: NotificationIconProps) => {
  const { unreadCount } = useNotificationStore();
  const [isAnimating, setIsAnimating] = useState(false);

  // Animar cuando hay nuevas notificaciones
  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ${
        isAnimating ? "animate-bounce" : ""
      }`}
      aria-label={`Notificaciones${
        unreadCount > 0 ? ` (${unreadCount} sin leer)` : ""
      }`}
      title="Notificaciones"
    >
      {/* Bell Icon */}
      <svg
        className="w-6 h-6 text-gray-600"
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

      {/* Badge de contador */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 bg-red-600 text-white text-xs font-bold rounded-full border-2 border-white shadow-lg">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}

      {/* Indicador de pulso para nuevas notificaciones */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full animate-ping opacity-75"></span>
      )}
    </button>
  );
};

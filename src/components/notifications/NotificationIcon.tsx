/**
 * Notification Icon Component
 * Icono de notificaciones con badge de contador
 */

"use client";

import { useState, useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { NotificationPanel } from "./NotificationPanel";

export const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const getUnreadCount = useNotificationStore((state) => state.getUnreadCount);

  useEffect(() => {
    setUnreadCount(getUnreadCount());

    // Actualizar contador cada segundo
    const interval = setInterval(() => {
      setUnreadCount(getUnreadCount());
    }, 1000);

    return () => clearInterval(interval);
  }, [getUnreadCount]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Notificaciones"
        aria-label="Notificaciones"
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6 text-gray-700"
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

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop - solo en mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed md:absolute right-0 md:right-0 top-16 md:top-auto md:mt-2 z-50 w-full md:w-auto px-4 md:px-0">
            <NotificationPanel onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
};

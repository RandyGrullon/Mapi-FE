"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors = {
    success: "bg-white border-gray-300 text-gray-900",
    error: "bg-white border-gray-300 text-gray-900",
    warning: "bg-white border-gray-300 text-gray-900",
    info: "bg-white border-gray-300 text-gray-900",
  };

  const iconColors = {
    success: "bg-gray-900 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-gray-700 text-white",
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div
        className={`flex items-center gap-3 ${colors[type]} border rounded-lg px-4 py-3 shadow-lg max-w-md min-w-[300px]`}
      >
        <div
          className={`w-8 h-8 rounded-full ${iconColors[type]} flex items-center justify-center font-bold flex-shrink-0`}
        >
          {icons[type]}
        </div>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Cerrar"
        >
          <svg
            className="w-5 h-5"
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
  );
};

// Hook personalizado para usar el Toast
export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return { toast, showToast, hideToast };
};

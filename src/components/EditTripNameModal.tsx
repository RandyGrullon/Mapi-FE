"use client";

import { useState, useEffect } from "react";
import { CompletedTrip } from "./CompletedTripsManager";
import { Toast, ToastType } from "./Toast";

interface EditTripNameModalProps {
  isOpen: boolean;
  trip: CompletedTrip | null;
  onClose: () => void;
  onSave: (tripId: string, newName: string) => void;
}

export const EditTripNameModal = ({
  isOpen,
  trip,
  onClose,
  onSave,
}: EditTripNameModalProps) => {
  const [name, setName] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  useEffect(() => {
    if (trip) {
      setName(trip.name);
    }
  }, [trip]);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSave = () => {
    if (!trip) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      showToast("El nombre del viaje no puede estar vacío", "error");
      return;
    }

    if (trimmedName === trip.name) {
      onClose();
      return;
    }

    onSave(trip.id, trimmedName);
    showToast("Nombre del viaje actualizado", "success");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen || !trip) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Editar nombre del viaje
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo nombre
                </label>
                <input
                  id="tripName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ingresa el nuevo nombre del viaje"
                  autoFocus
                />
              </div>

              <div className="text-sm text-gray-500">
                Viaje actual: <span className="font-medium">{trip.origin} → {trip.destination}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};
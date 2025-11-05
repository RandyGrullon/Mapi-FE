"use client";

import { useState } from "react";
import { CompletedTrip, TripParticipant } from "../trips/CompletedTripsManager";
import { Toast, ToastType } from "../ui/Toast";
import { JoinRequestModal } from "../notifications/JoinRequestModal";

interface ShareModalProps {
  isOpen: boolean;
  trip: CompletedTrip;
  onClose: () => void;
  onAddParticipant?: (participant: TripParticipant) => void;
}

export const ShareModal = ({
  isOpen,
  trip,
  onClose,
  onAddParticipant,
}: ShareModalProps) => {
  const [email, setEmail] = useState("");
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

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (!isOpen) return null;

  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/trip/${trip.shareToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    showToast("¡Link copiado al portapapeles!", "success");
  };

  const handleAddParticipant = () => {
    if (!name.trim()) {
      showToast("Por favor ingresa un nombre", "warning");
      return;
    }

    if (email && !email.includes("@")) {
      showToast("Por favor ingresa un email válido", "warning");
      return;
    }

    const newParticipant: TripParticipant = {
      id: `participant_${Date.now()}`,
      name: name.trim(),
      email: email.trim() || undefined,
      role: "participant",
      joinedAt: new Date().toISOString(),
    };

    if (onAddParticipant) {
      onAddParticipant(newParticipant);
    }

    showToast(`${name} ha sido agregado al viaje`, "success");
    setName("");
    setEmail("");
  };

  const participants = trip.participants || [];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Compartir Viaje</h2>
                <p className="text-blue-100 text-sm">
                  {trip.destination} • {trip.travelers}{" "}
                  {trip.travelers === 1 ? "viajero" : "viajeros"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
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

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Tipo de viaje */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {trip.travelType === "solo" ? "🚶" : "👥"}
                </span>
                <div>
                  <p className="font-bold text-gray-900">
                    {trip.travelType === "solo" ? "Viaje Solo" : "Viaje Grupal"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {trip.travelType === "solo"
                      ? "Este viaje es individual"
                      : `${participants.length} participante${
                          participants.length !== 1 ? "s" : ""
                        } en este viaje`}
                  </p>
                </div>
              </div>
            </div>

            {/* Link para compartir */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de Compartir
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  📋 Copiar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Comparte este link con otros viajeros para que vean los detalles
                del viaje
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Opciones de participación
                </span>
              </div>
            </div>

            {/* Agregar participante */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agregar Participante Directamente
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddParticipant}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  + Agregar Participante
                </button>
              </div>
            </div>

            {/* Lista de participantes */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Participantes ({participants.length})
              </h3>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {participant.name}
                          {participant.role === "owner" && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              Organizador
                            </span>
                          )}
                        </p>
                        {participant.email && (
                          <p className="text-sm text-gray-600">
                            {participant.email}
                          </p>
                        )}
                      </div>
                    </div>
                    {participant.role !== "owner" && (
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Cerrar
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

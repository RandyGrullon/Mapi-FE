/**
 * Join Request Modal
 * Modal para solicitar o aprobar unirse a un viaje
 */

"use client";

import { useState } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { CompletedTrip } from "../trips/CompletedTripsManager";
import { JoinRequest } from "@/types/notification";

interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "request" | "respond";
  trip?: CompletedTrip;
  request?: JoinRequest;
  onApprove?: (requestId: string) => void;
}

export const JoinRequestModal = ({
  isOpen,
  onClose,
  mode,
  trip,
  request,
  onApprove,
}: JoinRequestModalProps) => {
  const { createJoinRequest, acceptJoinRequest, rejectJoinRequest } =
    useNotificationStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmitRequest = async () => {
    if (!trip || !name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      createJoinRequest({
        tripId: trip.id,
        tripName: trip.name,
        tripDestination: trip.destination,
        tripDates: {
          start: trip.startDate,
          end: trip.endDate,
        },
        requesterName: name.trim(),
        requesterEmail: email.trim(),
        message: message.trim() || undefined,
      });

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
        // Reset form
        setName("");
        setEmail("");
        setMessage("");
      }, 2000);
    } catch (error) {
      // Silent fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = () => {
    if (!request) return;
    acceptJoinRequest(request.id);
    if (onApprove) {
      onApprove(request.id);
    }
    onClose();
  };

  const handleReject = () => {
    if (!request) return;
    rejectJoinRequest(request.id, "El organizador ha rechazado tu solicitud");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {mode === "request" && trip ? (
          // Solicitar unirse
          <>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-white">
                      Solicitar Unirse
                    </h3>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Completa el formulario para solicitar unirte a este viaje
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-2 p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-white"
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

            {/* Información del viaje */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">
                    {trip.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {trip.origin} → {trip.destination}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(trip.startDate).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {trip.travelers} viajero{trip.travelers > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {showSuccessMessage ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  ¡Solicitud Enviada!
                </h4>
                <p className="text-gray-600">
                  El organizador recibirá tu solicitud y te notificaremos su
                  respuesta
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {/* Formulario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre completo <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contacto <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje para el organizador (opcional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntale al organizador por qué quieres unirte..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-blue-800">
                      El organizador recibirá tu solicitud y podrá aprobarla o
                      rechazarla. Te notificaremos su decisión.
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitRequest}
                    disabled={isSubmitting || !name.trim() || !email.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar Solicitud"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : request ? (
          // Responder solicitud
          <>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-white">
                      Solicitud de Unión
                    </h3>
                  </div>
                  <p className="text-green-100 text-sm">
                    Revisa y responde a esta solicitud
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-2 p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-white"
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

            <div className="p-6 space-y-6">
              {/* Información del solicitante */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Solicitante
                </h4>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {request.requesterName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-lg mb-1">
                      {request.requesterName}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {request.requesterEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información del viaje */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Viaje
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">
                    {request.tripName}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(request.tripDates.start).toLocaleDateString(
                      "es-ES",
                      { month: "long", day: "numeric" }
                    )}{" "}
                    -{" "}
                    {new Date(request.tripDates.end).toLocaleDateString(
                      "es-ES",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {request.tripDestination}
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              {request.message && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Mensaje
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700 italic">
                      &quot;{request.message}&quot;
                    </p>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
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
                  Rechazar
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Aceptar
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

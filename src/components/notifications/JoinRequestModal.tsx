/**
 * Join Request Modal
 * Modal para solicitar o aprobar unirse a un viaje
 */

"use client";

import { useState } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { CompletedTrip } from "@/types/trip";
import { JoinRequest } from "@/types/notification";
import {
  ModalOverlay,
  RequestHeader,
  ResponseHeader,
  TripInfoCard,
  SuccessMessage,
  RequestForm,
  RequesterInfo,
  TripDetails,
  RequestMessage,
  ResponseActions,
} from "./modal";

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
      <ModalOverlay onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {mode === "request" && trip ? (
          <>
            <RequestHeader onClose={onClose} />
            <TripInfoCard trip={trip} />

            {showSuccessMessage ? (
              <SuccessMessage />
            ) : (
              <RequestForm
                name={name}
                email={email}
                message={message}
                onNameChange={setName}
                onEmailChange={setEmail}
                onMessageChange={setMessage}
                onSubmit={handleSubmitRequest}
                onCancel={onClose}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        ) : request ? (
          <>
            <ResponseHeader onClose={onClose} />

            <div className="p-6 space-y-6">
              <RequesterInfo request={request} />
              <TripDetails request={request} />
              {request.message && <RequestMessage message={request.message} />}
              <ResponseActions
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

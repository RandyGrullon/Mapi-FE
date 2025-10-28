"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWizard } from "../wizard/WizardProvider";
import { useSidebar } from "./SidebarContext";
import { DemoTripsInitializer } from "../data/DemoTripsInitializer";
import { useNavigation } from "../navigation/NavigationContext";
import { ConfirmModal } from "../modals/ConfirmModal";
import { EditTripNameModal } from "../modals/EditTripNameModal";
import { ShareModal } from "../modals/ShareModal";
import { Toast, ToastType } from "../ui/Toast";
import { useDrafts } from "../drafts/useDrafts";
import { useTrips } from "../trips/useTrips";
import { useSidebarState } from "./useSidebarState";
import { DraftsSection } from "../drafts/DraftsSection";
import { TripsSection } from "../trips/TripsSection";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { MobileSidebarToggle } from "./MobileSidebarToggle";
import { formatDate } from "../data/utils";

export const Sidebar = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<any>(null);
  const [isShareTripModalOpen, setIsShareTripModalOpen] = useState(false);
  const [tripToShare, setTripToShare] = useState<any>(null);
  const [isDeleteTripModalOpen, setIsDeleteTripModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<any>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Hooks personalizados
  const { drafts, deleteDraft } = useDrafts();
  const { trips, updateTripName, deleteTrip } = useTrips();
  const {
    isCollapsed,
    setIsCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    closeMobileSidebar,
  } = useSidebarState();

  const { resetWizard, loadDraft, currentDraftId } = useWizard();
  const { navigateToTripDetail, navigateToWizard } = useNavigation();
  const pathname = usePathname();

  // Determinar el viaje seleccionado basado en la URL
  const getSelectedTripId = (): string | null => {
    if (pathname.startsWith("/trip/")) {
      return pathname.split("/trip/")[1];
    }
    return null;
  };

  const selectedTripId = getSelectedTripId();

  // Inicializar viajes demo una sola vez
  useEffect(() => {
    DemoTripsInitializer.createDemoTrips();
  }, []);

  const handleNewWizard = () => {
    resetWizard();
    navigateToWizard();
    closeMobileSidebar();
  };

  const handleLoadDraft = (draftId: string) => {
    loadDraft(draftId);
    // Si no estamos en el wizard, navegar al wizard
    if (pathname !== "/plan") {
      navigateToWizard();
    }
    closeMobileSidebar();
  };

  const handleDeleteDraft = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftToDelete(draftId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDraft = () => {
    if (draftToDelete) {
      deleteDraft(draftToDelete);
      setDraftToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const cancelDeleteDraft = () => {
    setDraftToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Funciones para viajes
  const handleEditTripName = (trip: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setTripToEdit(trip);
    setIsEditTripModalOpen(true);
  };

  const handleSaveTripName = (tripId: string, newName: string) => {
    updateTripName(tripId, newName);
    showToast("Nombre del viaje actualizado", "success");
  };

  const handleShareTrip = (trip: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setTripToShare(trip);
    setIsShareTripModalOpen(true);
  };

  const handleDeleteTrip = (trip: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setTripToDelete(trip);
    setIsDeleteTripModalOpen(true);
  };

  const confirmDeleteTrip = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete.id);
      showToast("Viaje eliminado exitosamente", "success");
      setTripToDelete(null);
    }
    setIsDeleteTripModalOpen(false);
  };

  const cancelDeleteTrip = () => {
    setTripToDelete(null);
    setIsDeleteTripModalOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <MobileSidebarToggle
        isOpen={isMobileSidebarOpen}
        onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Sidebar overlay for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 h-full
          ${
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          ${isCollapsed ? "md:w-20" : "w-80"}
        `}
      >
        {/* Botón para colapsar - solo visible en desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-24 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-300"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          className={`flex flex-col h-full ${
            isCollapsed ? "px-2 py-5" : "p-6"
          }`}
        >
          <SidebarHeader
            onNewWizard={handleNewWizard}
            isCollapsed={isCollapsed}
          />

          {/* Content section - takes remaining space */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <DraftsSection
              drafts={drafts}
              currentDraftId={currentDraftId}
              pathname={pathname}
              onLoadDraft={handleLoadDraft}
              onDeleteDraft={handleDeleteDraft}
              formatDate={formatDate}
              isCollapsed={isCollapsed}
            />

            <TripsSection
              trips={trips}
              selectedTripId={selectedTripId}
              onNavigateToTripDetail={navigateToTripDetail}
              onEditTripName={handleEditTripName}
              onShareTrip={handleShareTrip}
              onDeleteTrip={handleDeleteTrip}
              isCollapsed={isCollapsed}
            />
          </div>

          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* Modal de confirmación de eliminación de draft */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Borrador"
        message={
          draftToDelete
            ? `¿Estás seguro de que deseas eliminar el borrador "${
                drafts.find((d) => d.id === draftToDelete)?.name ||
                "este borrador"
              }"? Esta acción no se puede deshacer.`
            : "¿Estás seguro de que deseas eliminar este borrador? Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteDraft}
        onCancel={cancelDeleteDraft}
        variant="danger"
      />

      {/* Modal de edición de nombre de viaje */}
      <EditTripNameModal
        isOpen={isEditTripModalOpen}
        trip={tripToEdit}
        onClose={() => setIsEditTripModalOpen(false)}
        onSave={handleSaveTripName}
      />

      {/* Modal de compartir viaje */}
      <ShareModal
        isOpen={isShareTripModalOpen}
        trip={tripToShare!}
        onClose={() => setIsShareTripModalOpen(false)}
      />

      {/* Modal de confirmación de eliminación de viaje */}
      <ConfirmModal
        isOpen={isDeleteTripModalOpen}
        title="Eliminar Viaje"
        message={
          tripToDelete
            ? `¿Estás seguro de que deseas eliminar el viaje "${tripToDelete.name}"? Esta acción no se puede deshacer.`
            : "¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteTrip}
        onCancel={cancelDeleteTrip}
        variant="danger"
      />

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

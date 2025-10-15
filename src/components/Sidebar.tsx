"use client";

import { useState, useEffect } from "react";
import { useWizard } from "./WizardProvider";
import { useSidebar } from "./SidebarContext";
import { DraftManager, Draft } from "./DraftManager";
import { CompletedTripsManager, CompletedTrip } from "./CompletedTripsManager";
import { DemoTripsInitializer } from "./DemoTripsInitializer";
import { useNavigation } from "./NavigationContext";
import { ConfirmModal } from "./ConfirmModal";

export const Sidebar = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDraftsExpanded, setIsDraftsExpanded] = useState(true);
  const [isTripsExpanded, setIsTripsExpanded] = useState(true);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [trips, setTrips] = useState<CompletedTrip[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { resetWizard, loadDraft, currentDraftId } = useWizard();
  const { navigateToTripDetail, navigateToWizard } = useNavigation();

  // Inicializar viajes demo una sola vez
  useEffect(() => {
    DemoTripsInitializer.createDemoTrips();
  }, []);

  // Cargar drafts y viajes al montar
  useEffect(() => {
    const loadData = () => {
      const allDrafts = DraftManager.getAllDrafts();
      const allTrips = CompletedTripsManager.getAllTrips();
      // Filtrar drafts que están siendo editados actualmente
      const filteredDrafts = allDrafts.filter(draft => draft.id !== currentDraftId);
      setDrafts(filteredDrafts);
      setTrips(allTrips);
    };

    loadData();

    // Actualizar cada 2 segundos para reflejar cambios
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [currentDraftId]);

  const travelCategories = [
    {
      icon: "🏖️",
      title: "Playa",
      description: "Relax y sol",
    },
    {
      icon: "🏔️",
      title: "Montaña",
      description: "Aventura y naturaleza",
    },
    {
      icon: "🏙️",
      title: "Ciudad",
      description: "Cultura y gastronomía",
    },
    {
      icon: "🏛️",
      title: "Histórico",
      description: "Monumentos y museos",
    },
  ];

  const handleNewWizard = () => {
    resetWizard();
    navigateToWizard();
    setIsMobileSidebarOpen(false);
  };

  const handleLoadDraft = (draftId: string) => {
    loadDraft(draftId);
    setIsMobileSidebarOpen(false);
  };

  const handleDeleteDraft = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftToDelete(draftId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDraft = () => {
    if (draftToDelete) {
      DraftManager.deleteDraft(draftToDelete);
      setDrafts(DraftManager.getAllDrafts());
      setDraftToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const cancelDeleteDraft = () => {
    setDraftToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-xl"
        aria-label="Toggle sidebar"
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
            d={
              isMobileSidebarOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Sidebar overlay for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
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

        <div className={`flex flex-col h-full ${isCollapsed ? "px-2 py-5" : "p-6"}`}>
          <h2
            className={`text-xl font-bold mb-6 flex ${
              isCollapsed ? "justify-center" : ""
            } items-center gap-2`}
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            {!isCollapsed && <span>Planifica Tu Viaje</span>}
          </h2>

          <button
            onClick={handleNewWizard}
            className={`w-full flex items-center justify-center gap-2 py-3 ${
              isCollapsed ? "px-2" : "px-4"
            } rounded-xl bg-black text-white hover:bg-black/90 transition-all duration-200 mb-6`}
            title="Nuevo Viaje"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {!isCollapsed && <span>Nuevo Viaje</span>}
          </button>

          {/* Content section - takes remaining space */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Drafts section */}
            {drafts.length > 0 && (
              <div className="flex-shrink-0 mb-6">
              {!isCollapsed ? (
                <>
                  <button
                    onClick={() => setIsDraftsExpanded(!isDraftsExpanded)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-500 mb-3 hover:text-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Borradores ({drafts.length})</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDraftsExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDraftsExpanded && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {drafts.map((draft) => (
                        <div
                          key={draft.id}
                          onClick={() => handleLoadDraft(draft.id)}
                          className={`w-full p-3 rounded-lg transition-all duration-200 text-left group relative cursor-pointer ${
                            draft.id === currentDraftId
                              ? "bg-blue-50 border-2 border-blue-300"
                              : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                          }`}
                          title={draft.name}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {draft.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                                    style={{ width: `${draft.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {draft.progress}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(draft.updatedAt)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleDeleteDraft(draft.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all flex-shrink-0"
                              title="Eliminar borrador"
                            >
                              <svg
                                className="w-4 h-4 text-red-600"
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Vista colapsada - Mostrar iconos de borradores */
                <div className="space-y-2">
                  {drafts.slice(0, 3).map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => handleLoadDraft(draft.id)}
                      className={`w-full p-2 rounded-lg transition-all duration-200 group relative ${
                        draft.id === currentDraftId
                          ? "bg-blue-100 border-2 border-blue-400"
                          : "bg-gray-100 hover:bg-gray-200 border-2 border-transparent"
                      }`}
                      title={`${draft.name} - ${draft.progress}% completado`}
                    >
                      <div className="relative">
                        <svg
                          className="w-6 h-6 mx-auto text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {/* Badge con progreso */}
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                          {draft.progress}
                        </span>
                      </div>

                      {/* Tooltip expandido al hacer hover */}
                      <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                        <p className="font-semibold">{draft.name}</p>
                        <p className="text-gray-300 text-[10px] mt-1">
                          {draft.progress}% completado
                        </p>
                        <p className="text-gray-400 text-[10px]">
                          {formatDate(draft.updatedAt)}
                        </p>
                        {/* Flecha del tooltip */}
                        <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
                      </div>
                    </button>
                  ))}
                  {drafts.length > 3 && (
                    <div className="text-center py-1">
                      <span
                        className="text-xs text-gray-500 font-medium"
                        title={`${drafts.length - 3} borradores más`}
                      >
                        +{drafts.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Viajes Completados - Takes remaining space */}
          {trips.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              {!isCollapsed ? (
                <>
                  <button
                    onClick={() => setIsTripsExpanded(!isTripsExpanded)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-500 mb-3 hover:text-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
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
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Mis Viajes ({trips.length})</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isTripsExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isTripsExpanded && (
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {trips.map((trip) => {
                        const startDate = new Date(trip.startDate);
                        const statusColors = {
                          progress: "border-blue-300 bg-blue-50",
                          ongoing: "border-green-300 bg-green-50",
                          completed: "border-gray-300 bg-gray-50",
                          cancelled: "border-red-300 bg-red-50",
                        };
                        const statusIcons = {
                          progress: "�",
                          ongoing: "✈️",
                          completed: "✅",
                          cancelled: "❌",
                        };
                        return (
                          <button
                            key={trip.id}
                            onClick={() => {
                              navigateToTripDetail(trip);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full p-3 rounded-lg transition-all duration-200 text-left group relative border-2 ${
                              statusColors[trip.status]
                            } hover:shadow-md`}
                            title={trip.name}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl flex-shrink-0">
                                {statusIcons[trip.status]}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                  {trip.destination}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                  {trip.origin} → {trip.destination}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {startDate.toLocaleDateString("es-ES", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                  {" • "}
                                  {trip.hotel.nights} noches
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                    ${trip.budget.total}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* Vista colapsada - Mostrar iconos de viajes */
                <div className="flex-1 overflow-y-auto space-y-2">
                  {trips.slice(0, 4).map((trip) => {
                    const statusIcons = {
                      progress: "�",
                      ongoing: "✈️",
                      completed: "✅",
                      cancelled: "❌",
                    };
                    const statusColors = {
                      progress: "bg-blue-100 border-blue-300",
                      ongoing: "bg-green-100 border-green-300",
                      completed: "bg-gray-100 border-gray-300",
                      cancelled: "bg-red-100 border-red-300",
                    };
                    const startDate = new Date(trip.startDate);

                    return (
                      <button
                        key={trip.id}
                        onClick={() => {
                          navigateToTripDetail(trip);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full p-2 rounded-lg transition-all duration-200 group relative border-2 ${
                          statusColors[trip.status]
                        } hover:shadow-md`}
                        title={`${trip.destination} - ${trip.status}`}
                      >
                        <div className="flex justify-center">
                          <span className="text-2xl">
                            {statusIcons[trip.status]}
                          </span>
                        </div>

                        {/* Tooltip expandido al hacer hover */}
                        <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl min-w-[180px]">
                          <p className="font-bold text-sm">
                            {trip.destination}
                          </p>
                          <p className="text-gray-300 text-[10px] mt-1">
                            {trip.origin} → {trip.destination}
                          </p>
                          <p className="text-gray-300 text-[10px] mt-1">
                            {startDate.toLocaleDateString("es-ES", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-gray-400 text-[10px]">
                            {trip.hotel.nights} noches • ${trip.budget.total}
                          </p>
                          {/* Flecha del tooltip */}
                          <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
                        </div>
                      </button>
                    );
                  })}
                  {trips.length > 4 && (
                    <div className="text-center py-1">
                      <span
                        className="text-xs text-gray-500 font-medium"
                        title={`${trips.length - 4} viajes más`}
                      >
                        +{trips.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          </div>

          {/* Footer section */}
          <div className="flex-shrink-0 mt-auto border-t border-gray-200 pt-4">
            <a
              href="/profile"
              className={`flex ${
                isCollapsed ? "justify-center" : "items-center gap-3 p-2"
              } rounded-lg hover:bg-gray-100 transition-all duration-200`}
              title={isCollapsed ? "Viajero - usuario@email.com" : ""}
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                U
              </div>
              {!isCollapsed && (
                <div>
                  <p className="font-medium">Viajero</p>
                  <p className="text-xs text-gray-500">usuario@email.com</p>
                </div>
              )}
            </a>
          </div>
        </div>
      </aside>

      {/* Modal de confirmación de eliminación */}
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
    </>
  );
};

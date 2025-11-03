/**
 * Componente que auto-guarda el estado del wizard como borrador
 */

"use client";

import { useEffect, useRef } from "react";
import { useWizardStore } from "@/stores/wizardStore";
import { DraftManager } from "../drafts/DraftManager";
import { ServiceType } from "@/types/wizard";

export const DraftAutoSaver = () => {
  const {
    selectedServices,
    activeModules,
    currentModuleIndex,
    completed,
    currentDraftId,
    setCurrentDraftId,
  } = useWizardStore();

  // Usar un ref para evitar guardar múltiples veces seguidas
  const lastSaveRef = useRef<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Guardar después de 1 segundo de inactividad (debounce)
    saveTimeoutRef.current = setTimeout(() => {
      // No guardar si el wizard está completado
      if (completed) return;

      // No guardar si no hay servicios seleccionados
      if (selectedServices.length === 0) return;

      // Convertir el estado de Zustand al formato del DraftManager
      // Por ahora creamos un formato compatible con el antiguo sistema
      const hasProgress = activeModules.some(
        (m) => m.currentStep > 0 || m.completed
      );

      if (!hasProgress) return;

      // Crear una "firma" del estado actual para evitar guardados duplicados
      const currentState = JSON.stringify({
        selectedServices,
        activeModules: activeModules.map((m) => ({
          type: m.type,
          currentStep: m.currentStep,
          completed: m.completed,
          data: m.data,
        })),
        currentModuleIndex,
      });

      // Si el estado no ha cambiado, no guardar
      if (lastSaveRef.current === currentState) return;
      lastSaveRef.current = currentState;

      // Crear información de viaje básica desde los módulos
      let travelInfo: any = {
        origin: "",
        destination: "",
        startDate: null,
        endDate: null,
        travelers: 1,
        travelType: "solo",
      };

      // Extraer información de los módulos
      activeModules.forEach((module) => {
        if (module.type === ServiceType.FLIGHTS && module.data) {
          const flightData = module.data as any;
          if (flightData.segments && flightData.segments.length > 0) {
            travelInfo.origin = flightData.segments[0]?.from || "";
            travelInfo.destination = flightData.segments[0]?.to || "";
          }
          travelInfo.travelers = flightData.travelers || 1;
        }

        if (module.type === ServiceType.HOTEL && module.data) {
          const hotelData = module.data as any;
          travelInfo.destination =
            hotelData.destination || travelInfo.destination;
          travelInfo.startDate = hotelData.checkIn || null;
          travelInfo.endDate = hotelData.checkOut || null;
        }
      });

      // Calcular progreso total basado en módulos
      let totalProgress = 0;
      activeModules.forEach((module) => {
        if (module.completed) {
          totalProgress += 100; // Módulo completado = 100%
        } else {
          // Calcular progreso del módulo actual basado en pasos completados
          // Si estamos en el paso X de N, consideramos que X pasos están completos
          const completedSteps = module.currentStep; // pasos completados
          const totalSteps = module.totalSteps;
          // Progreso = (pasos completados / total de pasos) * 100
          // Ejemplo: paso 1 de 3 = (1/3) * 100 = 33%
          const moduleProgress =
            totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
          totalProgress += moduleProgress;
        }
      });
      const overallProgress = Math.round(totalProgress / activeModules.length);

      // Crear steps en formato antiguo para compatibilidad
      const steps = selectedServices.map((service, index) => {
        const module = activeModules[index];
        return {
          id: service,
          title: getServiceTitle(service),
          completed: module?.completed || false,
          data: module?.data || {},
        };
      });

      // Guardar el borrador manualmente con el progreso correcto
      if (typeof window === "undefined") return;

      const drafts = DraftManager.getAllDrafts();
      const id =
        currentDraftId ||
        DraftManager.getCurrentDraftId() ||
        DraftManager.generateId();

      // Generar nombre automático
      let name = "Nuevo viaje";
      if (travelInfo.origin && travelInfo.destination) {
        name = `${travelInfo.origin} → ${travelInfo.destination}`;
      } else if (travelInfo.origin) {
        name = `Desde ${travelInfo.origin}`;
      } else if (travelInfo.destination) {
        name = `Hacia ${travelInfo.destination}`;
      }

      const existingDraftIndex = drafts.findIndex((d) => d.id === id);
      const now = new Date().toISOString();

      const draft: any = {
        id,
        name,
        createdAt:
          existingDraftIndex >= 0 ? drafts[existingDraftIndex].createdAt : now,
        updatedAt: now,
        steps,
        currentStepIndex: currentModuleIndex,
        travelInfo,
        progress: overallProgress, // Usar el progreso calculado
      };

      if (existingDraftIndex >= 0) {
        drafts[existingDraftIndex] = draft;
      } else {
        drafts.unshift(draft);
      }

      // Limitar a 10 drafts
      if (drafts.length > 10) {
        drafts.splice(10);
      }

      localStorage.setItem("mapi_travel_drafts", JSON.stringify(drafts));
      localStorage.setItem("mapi_current_draft_id", id);

      // Actualizar el ID del borrador actual en el store
      if (id !== currentDraftId) {
        setCurrentDraftId(id);
      }
    }, 1000); // Esperar 1 segundo antes de guardar

    // Cleanup: limpiar timeout cuando el componente se desmonte o cambien las dependencias
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    selectedServices,
    activeModules,
    currentModuleIndex,
    completed,
    currentDraftId,
    setCurrentDraftId,
  ]);

  // Este componente no renderiza nada
  return null;
};

// Helper para obtener títulos de servicios
const getServiceTitle = (service: ServiceType): string => {
  switch (service) {
    case ServiceType.FLIGHTS:
      return "Vuelos";
    case ServiceType.HOTEL:
      return "Hotel";
    case ServiceType.CAR:
      return "Renta de auto";
    case ServiceType.ACTIVITIES:
      return "Actividades";
    default:
      return "Servicio";
  }
};

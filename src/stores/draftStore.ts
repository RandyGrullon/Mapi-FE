/**
 * Draft Store - Manejo de borradores con Zustand
 * Permite guardar, cargar y gestionar borradores del wizard
 */

import { create } from "zustand";
import { Draft, DraftStore } from "@/types/draft";
import { useWizardStore } from "./wizardStore";
import { ServiceType, ModuleState } from "@/types/wizard";

const STORAGE_KEY = "mapi_drafts";
const AUTOSAVE_INTERVAL = 30000; // 30 segundos

// Helper para generar un nombre automático
const generateDraftName = (services: ServiceType[]): string => {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
  const time = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (services.length === 0) {
    return `Borrador ${date} ${time}`;
  }

  const serviceLabels: Record<ServiceType, string> = {
    [ServiceType.FLIGHTS]: "Vuelos",
    [ServiceType.HOTEL]: "Hotel",
    [ServiceType.CAR]: "Auto",
    [ServiceType.ACTIVITIES]: "Actividades",
  };

  const serviceNames = services.map((s) => serviceLabels[s]).join(" + ");

  return `${serviceNames} - ${date} ${time}`;
};

// Helper para calcular el progreso
const calculateProgress = (
  activeModules: ModuleState[],
  currentModuleIndex: number,
  isCompleted: boolean = false
): number => {
  // Si está completado, siempre retornar 100%
  if (isCompleted) {
    console.log("✅ Wizard completado - Progreso: 100%");
    return 100;
  }

  // Si no hay módulos, 0%
  if (activeModules.length === 0) {
    console.log("⚠️ No hay módulos - Progreso: 0%");
    return 0;
  }

  let totalSteps = 0;
  let completedSteps = 0;

  console.log("📊 Calculando progreso:");

  activeModules.forEach((module, index) => {
    const isCurrentModule = index === currentModuleIndex;
    const isBeforeCurrent = index < currentModuleIndex;

    totalSteps += module.totalSteps;

    let moduleStepsCompleted = 0;

    if (module.completed) {
      // Si el módulo está marcado como completado, contar todos sus pasos
      moduleStepsCompleted = module.totalSteps;
      completedSteps += module.totalSteps;
      console.log(
        `  ✅ ${module.type}: ${moduleStepsCompleted}/${module.totalSteps} pasos (COMPLETADO)`
      );
    } else if (isBeforeCurrent) {
      // Módulos anteriores al actual (asumimos completados)
      moduleStepsCompleted = module.totalSteps;
      completedSteps += module.totalSteps;
      console.log(
        `  ✅ ${module.type}: ${moduleStepsCompleted}/${module.totalSteps} pasos (anterior)`
      );
    } else if (isCurrentModule) {
      // Módulo actual - contar pasos completados
      moduleStepsCompleted = module.currentStep;
      completedSteps += module.currentStep;
      console.log(
        `  🔄 ${module.type}: ${moduleStepsCompleted}/${module.totalSteps} pasos (ACTUAL)`
      );
    } else {
      // Módulos futuros
      console.log(
        `  ⏳ ${module.type}: 0/${module.totalSteps} pasos (pendiente)`
      );
    }
  });

  // Asegurar que no exceda 100% y no sea menor que 0%
  const progress = Math.round((completedSteps / totalSteps) * 100);
  const finalProgress = Math.min(Math.max(progress, 0), 99); // Máximo 99% si no está completado

  console.log(
    `📈 Total: ${completedSteps}/${totalSteps} pasos = ${finalProgress}%`
  );

  return finalProgress;
};

// Helper para extraer info de preview
const extractPreviewInfo = (activeModules: ModuleState[]) => {
  let origin: string | undefined;
  let destination: string | undefined;
  let dates: string | undefined;
  let travelers: number | undefined;

  activeModules.forEach((module) => {
    if (module.type === ServiceType.FLIGHTS) {
      const flightData = module.data as any;
      if (flightData.segments && flightData.segments.length > 0) {
        origin = flightData.segments[0].from;
        destination = flightData.segments[flightData.segments.length - 1].to;
      }
      travelers = flightData.travelers;
    }

    if (module.type === ServiceType.HOTEL) {
      const hotelData = module.data as any;
      if (hotelData.checkIn && hotelData.checkOut) {
        dates = `${hotelData.checkIn} - ${hotelData.checkOut}`;
      }
    }
  });

  return { origin, destination, dates, travelers };
};

// Cargar drafts desde localStorage
const loadDraftsFromStorage = (): Draft[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const drafts = JSON.parse(stored);
    return Array.isArray(drafts) ? drafts : [];
  } catch (error) {
    console.error("Error loading drafts from storage:", error);
    return [];
  }
};

// Guardar drafts en localStorage
const saveDraftsToStorage = (drafts: Draft[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error("Error saving drafts to storage:", error);
  }
};

// ========== STORE ==========
export const useDraftStore = create<DraftStore>((set, get) => {
  let autoSaveTimer: NodeJS.Timeout | null = null;

  return {
    // ========== ESTADO INICIAL ==========
    drafts: loadDraftsFromStorage(),
    currentDraftId: null,
    isAutoSaveEnabled: false,
    lastSavedAt: null,

    // ========== GUARDAR BORRADOR ==========
    saveDraft: (name?: string): string => {
      const wizardState = useWizardStore.getState();
      const { drafts, currentDraftId } = get();

      console.log("saveDraft called:", {
        currentDraftId,
        selectedServices: wizardState.selectedServices,
        activeModules: wizardState.activeModules.length,
        currentModuleIndex: wizardState.currentModuleIndex,
      });

      const previewInfo = extractPreviewInfo(wizardState.activeModules);
      const progress = calculateProgress(
        wizardState.activeModules,
        wizardState.currentModuleIndex,
        wizardState.completed
      );

      const now = new Date().toISOString();

      console.log("Draft details:", {
        progress,
        previewInfo,
        isCompleted: wizardState.completed,
      });

      // Si ya existe un draft actual, actualizarlo
      if (currentDraftId) {
        const existingIndex = drafts.findIndex((d) => d.id === currentDraftId);
        if (existingIndex !== -1) {
          const updatedDrafts = [...drafts];
          updatedDrafts[existingIndex] = {
            ...updatedDrafts[existingIndex],
            name: name || updatedDrafts[existingIndex].name,
            progress,
            selectedServices: wizardState.selectedServices,
            activeModules: wizardState.activeModules,
            currentModuleIndex: wizardState.currentModuleIndex,
            completed: wizardState.completed,
            updatedAt: now,
            previewInfo,
          };

          set({
            drafts: updatedDrafts,
            lastSavedAt: now,
          });

          saveDraftsToStorage(updatedDrafts);
          console.log("Draft updated:", currentDraftId);
          return currentDraftId;
        }
      }

      // Crear nuevo draft
      const newDraft: Draft = {
        id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name || generateDraftName(wizardState.selectedServices),
        progress,
        selectedServices: wizardState.selectedServices,
        activeModules: wizardState.activeModules,
        currentModuleIndex: wizardState.currentModuleIndex,
        completed: wizardState.completed,
        createdAt: now,
        updatedAt: now,
        previewInfo,
      };

      const updatedDrafts = [newDraft, ...drafts];
      set({
        drafts: updatedDrafts,
        currentDraftId: newDraft.id,
        lastSavedAt: now,
      });

      saveDraftsToStorage(updatedDrafts);
      console.log("New draft created and saved:", newDraft.id, newDraft.name);
      console.log("Total drafts now:", updatedDrafts.length);
      return newDraft.id;
    },

    // ========== CARGAR BORRADOR ==========
    loadDraft: (draftId: string): boolean => {
      const { drafts } = get();
      const draft = drafts.find((d) => d.id === draftId);

      if (!draft) return false;

      // Cargar estado en el wizard
      useWizardStore.setState({
        selectedServices: draft.selectedServices,
        activeModules: draft.activeModules,
        currentModuleIndex: draft.currentModuleIndex,
        completed: draft.completed,
        canGoBack: draft.currentModuleIndex > -1,
        canGoNext: false,
      });

      set({ currentDraftId: draftId });
      return true;
    },

    // ========== ELIMINAR BORRADOR ==========
    deleteDraft: (draftId: string) => {
      const { drafts, currentDraftId } = get();
      const updatedDrafts = drafts.filter((d) => d.id !== draftId);

      set({
        drafts: updatedDrafts,
        currentDraftId: currentDraftId === draftId ? null : currentDraftId,
      });

      saveDraftsToStorage(updatedDrafts);
    },

    // ========== OBTENER TODOS LOS BORRADORES ==========
    getAllDrafts: (): Draft[] => {
      return get().drafts;
    },

    // ========== OBTENER UN BORRADOR ==========
    getDraft: (draftId: string): Draft | null => {
      const { drafts } = get();
      return drafts.find((d) => d.id === draftId) || null;
    },

    // ========== ACTUALIZAR NOMBRE DEL BORRADOR ==========
    updateDraftName: (draftId: string, newName: string) => {
      const { drafts } = get();
      const updatedDrafts = drafts.map((d) =>
        d.id === draftId
          ? { ...d, name: newName, updatedAt: new Date().toISOString() }
          : d
      );

      set({ drafts: updatedDrafts });
      saveDraftsToStorage(updatedDrafts);
    },

    // ========== HABILITAR AUTO-SAVE ==========
    enableAutoSave: () => {
      set({ isAutoSaveEnabled: true });

      // Iniciar timer de auto-save
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
      }

      autoSaveTimer = setInterval(() => {
        const { isAutoSaveEnabled, currentDraftId } = get();
        if (isAutoSaveEnabled) {
          get().autoSave();
        }
      }, AUTOSAVE_INTERVAL);
    },

    // ========== DESHABILITAR AUTO-SAVE ==========
    disableAutoSave: () => {
      set({ isAutoSaveEnabled: false });

      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
      }
    },

    // ========== AUTO-SAVE ==========
    autoSave: () => {
      const wizardState = useWizardStore.getState();

      // Solo auto-guardar si hay servicios seleccionados
      if (wizardState.selectedServices.length === 0) return;

      // No auto-guardar si el wizard está completado
      if (wizardState.completed) return;

      get().saveDraft();
    },

    // ========== ESTABLECER BORRADOR ACTUAL ==========
    setCurrentDraft: (draftId: string | null) => {
      set({ currentDraftId: draftId });
    },

    // ========== LIMPIAR BORRADOR ACTUAL ==========
    clearCurrentDraft: () => {
      set({ currentDraftId: null });
    },

    // ========== VERIFICAR SI HAY CAMBIOS ==========
    isDraftModified: (): boolean => {
      const { currentDraftId, drafts } = get();
      if (!currentDraftId) return false;

      const currentDraft = drafts.find((d) => d.id === currentDraftId);
      if (!currentDraft) return false;

      const wizardState = useWizardStore.getState();

      // Comparar estado actual con el guardado
      return (
        JSON.stringify(wizardState.selectedServices) !==
          JSON.stringify(currentDraft.selectedServices) ||
        JSON.stringify(wizardState.activeModules) !==
          JSON.stringify(currentDraft.activeModules) ||
        wizardState.currentModuleIndex !== currentDraft.currentModuleIndex
      );
    },
  };
});

// Cleanup al desmontar
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    const store = useDraftStore.getState();
    if (store.isAutoSaveEnabled) {
      store.disableAutoSave();
    }
  });
}

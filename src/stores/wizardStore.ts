/**
 * Store de Zustand para el Wizard Modular
 */

import { create } from "zustand";
import type { StateCreator } from "zustand";
import {
  ServiceType,
  WizardStore,
  ModuleState,
  FlightModuleData,
  HotelModuleData,
  CarModuleData,
  ActivitiesModuleData,
  ModuleData,
} from "@/types/wizard";

// ========== DATOS INICIALES DE CADA MÓDULO ==========
const getInitialModuleData = (type: ServiceType): ModuleData => {
  switch (type) {
    case ServiceType.FLIGHTS:
      return {
        flightType: null,
        segments: [{ id: "segment-1", from: "", to: "" }],
        travelers: 1,
      } as FlightModuleData;

    case ServiceType.HOTEL:
      return {
        destination: "",
        checkIn: "",
        checkOut: "",
        rooms: 1,
        guests: 1,
      } as HotelModuleData;

    case ServiceType.CAR:
      return {
        pickupLocation: "",
        dropoffLocation: "",
        pickupDate: "",
        dropoffDate: "",
      } as CarModuleData;

    case ServiceType.ACTIVITIES:
      return {
        citiesActivities: [],
      } as ActivitiesModuleData;

    default:
      return {} as ModuleData;
  }
};

// ========== CALCULAR PASOS TOTALES POR MÓDULO ==========
const getTotalSteps = (type: ServiceType): number => {
  switch (type) {
    case ServiceType.FLIGHTS:
      return 3; // 1: Tipo de vuelo, 2: Rutas, 3: Detalles
    case ServiceType.HOTEL:
      return 2; // 1: Destino y fechas, 2: Habitaciones
    case ServiceType.CAR:
      return 2; // 1: Ubicaciones, 2: Fechas
    case ServiceType.ACTIVITIES:
      return 2; // 1: Destino, 2: Intereses
    default:
      return 1;
  }
};

// ========== ESTADO INICIAL ==========
const initialState = {
  selectedServices: [],
  activeModules: [],
  currentModuleIndex: -1, // -1 significa que estamos en la selección de servicios
  completed: false,
  canGoBack: false,
  canGoNext: false,
  currentDraftId: null,
};

// ========== STORE ==========
export const useWizardStore = create<WizardStore>((set, get) => ({
  ...initialState,

  // ========== SELECCIONAR SERVICIOS ==========
  selectServices: (services: ServiceType[]) => {
    const modules: ModuleState[] = services.map((type) => ({
      type,
      currentStep: 0,
      totalSteps: getTotalSteps(type),
      data: getInitialModuleData(type),
      completed: false,
      validated: false,
    }));

    set({
      selectedServices: services,
      activeModules: modules,
      currentModuleIndex: services.length > 0 ? 0 : -1,
      canGoBack: false,
      canGoNext: false,
    });
  },

  // ========== NAVEGACIÓN: SIGUIENTE MÓDULO ==========
  nextModule: () => {
    const { currentModuleIndex, activeModules } = get();
    const currentModule = activeModules[currentModuleIndex];

    // Avanzar paso dentro del módulo actual
    if (
      currentModule &&
      currentModule.currentStep < currentModule.totalSteps - 1
    ) {
      const updatedModules = [...activeModules];
      updatedModules[currentModuleIndex] = {
        ...currentModule,
        currentStep: currentModule.currentStep + 1,
      };

      set({
        activeModules: updatedModules,
        canGoBack: true,
      });
      return;
    }

    // Si completó todos los pasos del módulo, pasar al siguiente módulo
    if (currentModuleIndex < activeModules.length - 1) {
      set({
        currentModuleIndex: currentModuleIndex + 1,
        canGoBack: true,
        canGoNext: false,
      });
    } else {
      // Último módulo completado
      set({
        completed: true,
        canGoNext: false,
      });
    }
  },

  // ========== NAVEGACIÓN: MÓDULO ANTERIOR ==========
  previousModule: () => {
    const { currentModuleIndex, activeModules } = get();
    const currentModule = activeModules[currentModuleIndex];

    // Retroceder paso dentro del módulo actual
    if (currentModule && currentModule.currentStep > 0) {
      const updatedModules = [...activeModules];
      updatedModules[currentModuleIndex] = {
        ...currentModule,
        currentStep: currentModule.currentStep - 1,
      };

      set({
        activeModules: updatedModules,
      });
      return;
    }

    // Volver al módulo anterior
    if (currentModuleIndex > 0) {
      const prevModuleIndex = currentModuleIndex - 1;
      const prevModule = activeModules[prevModuleIndex];

      const updatedModules = [...activeModules];
      updatedModules[prevModuleIndex] = {
        ...prevModule,
        currentStep: prevModule.totalSteps - 1, // Ir al último paso del módulo anterior
      };

      set({
        activeModules: updatedModules,
        currentModuleIndex: prevModuleIndex,
        completed: false,
      });
    } else {
      // Volver a la selección de servicios
      set({
        currentModuleIndex: -1,
        canGoBack: false,
      });
    }
  },

  // ========== IR A UN MÓDULO ESPECÍFICO ==========
  goToModule: (index: number) => {
    const { activeModules } = get();
    if (index >= -1 && index < activeModules.length) {
      set({
        currentModuleIndex: index,
        canGoBack: index > -1,
        completed: false,
      });
    }
  },

  // ========== ACTUALIZAR DATOS DEL MÓDULO ==========
  updateModuleData: <T = ModuleData>(
    moduleType: ServiceType,
    data: Partial<T>
  ) => {
    const { activeModules } = get();
    const moduleIndex = activeModules.findIndex(
      (m: ModuleState) => m.type === moduleType
    );

    if (moduleIndex !== -1) {
      const updatedModules = [...activeModules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        data: {
          ...updatedModules[moduleIndex].data,
          ...data,
        } as ModuleData,
      };

      set({
        activeModules: updatedModules,
        canGoNext: true, // Habilitar navegación cuando hay datos
      });
    }
  },

  // ========== COMPLETAR MÓDULO ==========
  completeModule: (moduleType: ServiceType) => {
    const { activeModules, currentModuleIndex } = get();
    const moduleIndex = activeModules.findIndex(
      (m: ModuleState) => m.type === moduleType
    );

    if (moduleIndex !== -1) {
      const updatedModules = [...activeModules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        completed: true,
        validated: true,
      };

      // Si es el último módulo, marcar wizard como completado
      const isLastModule = currentModuleIndex === activeModules.length - 1;

      if (isLastModule) {
        set({
          activeModules: updatedModules,
          completed: true,
          canGoNext: false,
        });
      } else {
        // Avanzar automáticamente al siguiente módulo
        set({
          activeModules: updatedModules,
          currentModuleIndex: currentModuleIndex + 1,
          canGoBack: true,
          canGoNext: false,
        });
      }
    }
  },

  // ========== OBTENER MÓDULO ACTUAL ==========
  getCurrentModule: () => {
    const { currentModuleIndex, activeModules } = get();
    if (currentModuleIndex >= 0 && currentModuleIndex < activeModules.length) {
      return activeModules[currentModuleIndex];
    }
    return null;
  },

  // ========== AGREGAR MÓDULO OPCIONAL ==========
  addModule: (serviceType: ServiceType) => {
    const { activeModules, selectedServices } = get();

    // Verificar que el módulo no exista ya
    const moduleExists = activeModules.some((m) => m.type === serviceType);
    if (moduleExists) return;

    // Crear el nuevo módulo
    const newModule: ModuleState = {
      type: serviceType,
      currentStep: 0,
      totalSteps: getTotalSteps(serviceType),
      data: getInitialModuleData(serviceType),
      completed: false,
      validated: false,
    };

    // Agregar el módulo a la lista
    set({
      selectedServices: [...selectedServices, serviceType],
      activeModules: [...activeModules, newModule],
      completed: false, // Volver a estado no completado
    });
  },

  // ========== AGREGAR MÓDULO YA COMPLETADO ==========
  addCompletedModule: (serviceType: ServiceType, data: ModuleData) => {
    const { activeModules, selectedServices } = get();

    // Verificar que el módulo no exista ya
    const moduleExists = activeModules.some((m) => m.type === serviceType);
    if (moduleExists) return;

    // Crear el nuevo módulo completado
    const newModule: ModuleState = {
      type: serviceType,
      currentStep: 0,
      totalSteps: getTotalSteps(serviceType),
      data: data,
      completed: true,
      validated: true,
    };

    // Agregar el módulo a la lista
    set({
      selectedServices: [...selectedServices, serviceType],
      activeModules: [...activeModules, newModule],
    });
  },

  // ========== RESETEAR WIZARD ==========
  resetWizard: () => {
    set(initialState);
  },

  // ========== MANEJAR DRAFTS ==========
  setCurrentDraftId: (draftId: string | null) => {
    set({ currentDraftId: draftId });
  },

  loadDraftState: (state: Partial<WizardStore>) => {
    set(state);
  },
}));

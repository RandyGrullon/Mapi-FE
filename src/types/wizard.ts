/**
 * Sistema de Wizard Modular - Tipos y Definiciones
 */

// ========== SERVICIOS DISPONIBLES ==========
export enum ServiceType {
  FLIGHTS = "flights",
  HOTEL = "hotel",
  CAR = "car",
  ACTIVITIES = "activities",
}

export interface ServiceOption {
  type: ServiceType;
  label: string;
  icon: string;
  enabled: boolean;
}

// ========== TIPOS DE VUELO ==========
export enum FlightType {
  ONE_WAY = "one-way",
  ROUND_TRIP = "round-trip",
  MULTI_CITY = "multi-city",
}

export interface FlightSegment {
  id: string;
  from: string;
  to: string;
  date?: string;
}

export interface FlightModuleData {
  flightType: FlightType | null;
  segments: FlightSegment[];
  travelers: number;
  cabinClass?: string;
}

// ========== DATOS DE HOTEL ==========
export interface HotelModuleData {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  hotelType?: string;
}

// ========== DATOS DE AUTO ==========
export interface CarModuleData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  carType?: string;
}

// ========== DATOS DE ACTIVIDADES ==========
export interface CityActivities {
  city: string;
  interests: string[];
}

export interface ActivitiesModuleData {
  citiesActivities: CityActivities[];
  dates?: string[];
}

// ========== DATOS DEL MÓDULO ==========
export type ModuleData =
  | FlightModuleData
  | HotelModuleData
  | CarModuleData
  | ActivitiesModuleData;

// ========== ESTADO DEL MÓDULO ==========
export interface ModuleState<T = ModuleData> {
  type: ServiceType;
  currentStep: number;
  totalSteps: number;
  data: T;
  completed: boolean;
  validated: boolean;
}

// ========== PASO DEL MÓDULO ==========
export interface ModuleStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  optional?: boolean;
}

// ========== CONFIGURACIÓN DEL MÓDULO ==========
export interface ModuleConfig {
  type: ServiceType;
  title: string;
  icon: string;
  steps: ModuleStep[];
  initialData: ModuleData;
  validate: (data: ModuleData) => boolean;
}

// ========== PROPS DEL COMPONENTE DE MÓDULO ==========
export interface ModuleComponentProps<T = ModuleData> {
  data: T;
  onUpdate: (data: Partial<T>) => void;
  onComplete: () => void;
  onBack: () => void;
  currentStep: number;
  isLastModule: boolean;
}

// ========== ESTADO GLOBAL DEL WIZARD ==========
export interface WizardState {
  // Servicios seleccionados
  selectedServices: ServiceType[];

  // Módulos activos
  activeModules: ModuleState[];

  // Índice del módulo actual
  currentModuleIndex: number;

  // Wizard completado
  completed: boolean;

  // Navegación
  canGoBack: boolean;
  canGoNext: boolean;
}

// ========== ACCIONES DEL WIZARD ==========
export interface WizardActions {
  // Inicializar servicios
  selectServices: (services: ServiceType[]) => void;

  // Navegación
  nextModule: () => void;
  previousModule: () => void;
  goToModule: (index: number) => void;

  // Actualizar datos del módulo
  updateModuleData: <T = ModuleData>(
    moduleType: ServiceType,
    data: Partial<T>
  ) => void;

  // Completar módulo
  completeModule: (moduleType: ServiceType) => void;

  // Reset
  resetWizard: () => void;

  // Obtener módulo actual
  getCurrentModule: () => ModuleState | null;

  // Agregar módulo opcional
  addModule: (serviceType: ServiceType) => void;

  // Agregar módulo ya completado
  addCompletedModule: (serviceType: ServiceType, data: ModuleData) => void;
}

// ========== STORE COMPLETO ==========
export type WizardStore = WizardState & WizardActions;

/**
 * Draft System Types
 * Tipos para el sistema de borradores (drafts) que permite guardar
 * el progreso del wizard antes de completar el viaje
 */

import { ServiceType, ModuleState } from "./wizard";

// ========== DRAFT (BORRADOR) ==========
export interface Draft {
  id: string;
  name: string; // Nombre del borrador generado automáticamente
  progress: number; // Progreso 0-100%

  // Estado del wizard guardado
  selectedServices: ServiceType[];
  activeModules: ModuleState[];
  currentModuleIndex: number;
  completed: boolean;

  // Metadatos
  createdAt: string;
  updatedAt: string;
  lastModifiedBy?: string; // Usuario que modificó (para futuro)

  // Preview info para mostrar en la lista
  previewInfo?: {
    origin?: string;
    destination?: string;
    dates?: string;
    travelers?: number;
  };
}

// ========== DRAFT STATE ==========
export interface DraftState {
  drafts: Draft[];
  currentDraftId: string | null;
  isAutoSaveEnabled: boolean;
  lastSavedAt: string | null;
}

// ========== DRAFT ACTIONS ==========
export interface DraftActions {
  // Inicialización
  initializeDrafts: () => void;

  // CRUD de borradores
  saveDraft: (name?: string) => string; // Retorna el ID del draft
  loadDraft: (draftId: string) => boolean;
  deleteDraft: (draftId: string) => void;
  getAllDrafts: () => Draft[];
  getDraft: (draftId: string) => Draft | null;
  updateDraftName: (draftId: string, newName: string) => void;

  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  autoSave: () => void;

  // Utilidades
  setCurrentDraft: (draftId: string | null) => void;
  clearCurrentDraft: () => void;
  isDraftModified: () => boolean;
}

// ========== DRAFT STORE ==========
export type DraftStore = DraftState & DraftActions;

// ========== DRAFT PREVIEW ==========
export interface DraftPreview {
  id: string;
  name: string;
  progress: number;
  updatedAt: string;
  previewInfo?: {
    origin?: string;
    destination?: string;
    dates?: string;
    travelers?: number;
  };
}

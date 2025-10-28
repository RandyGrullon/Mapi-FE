"use client";

import { WizardStep, TravelInfo } from "../wizard/WizardProvider";

export type Draft = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  steps: WizardStep[];
  currentStepIndex: number;
  travelInfo: TravelInfo;
  progress: number; // Porcentaje de completación
};

const DRAFTS_KEY = "mapi_travel_drafts";
const CURRENT_DRAFT_KEY = "mapi_current_draft_id";

export class DraftManager {
  // Guardar draft actual
  static saveDraft(
    steps: WizardStep[],
    currentStepIndex: number,
    travelInfo: TravelInfo,
    draftId?: string
  ): string {
    if (typeof window === "undefined") return "";

    const drafts = this.getAllDrafts();
    const id = draftId || this.getCurrentDraftId() || this.generateId();

    // Calcular progreso
    const completedSteps = steps.filter((s) => s.completed).length;
    const progress = Math.round((completedSteps / steps.length) * 100);

    // Generar nombre automático basado en origen y destino
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

    const draft: Draft = {
      id,
      name,
      createdAt:
        existingDraftIndex >= 0 ? drafts[existingDraftIndex].createdAt : now,
      updatedAt: now,
      steps,
      currentStepIndex,
      travelInfo,
      progress,
    };

    if (existingDraftIndex >= 0) {
      drafts[existingDraftIndex] = draft;
    } else {
      drafts.unshift(draft); // Agregar al inicio
    }

    // Limitar a 10 drafts
    if (drafts.length > 10) {
      drafts.splice(10);
    }

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    localStorage.setItem(CURRENT_DRAFT_KEY, id);

    return id;
  }

  // Obtener todos los drafts
  static getAllDrafts(): Draft[] {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem(DRAFTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading drafts:", error);
      return [];
    }
  }

  // Obtener un draft específico
  static getDraft(id: string): Draft | null {
    const drafts = this.getAllDrafts();
    return drafts.find((d) => d.id === id) || null;
  }

  // Eliminar un draft
  static deleteDraft(id: string): void {
    if (typeof window === "undefined") return;

    const drafts = this.getAllDrafts();
    const filtered = drafts.filter((d) => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered));

    // Si era el draft actual, limpiar
    if (this.getCurrentDraftId() === id) {
      localStorage.removeItem(CURRENT_DRAFT_KEY);
    }
  }

  // Obtener ID del draft actual
  static getCurrentDraftId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CURRENT_DRAFT_KEY);
  }

  // Establecer draft actual
  static setCurrentDraftId(id: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CURRENT_DRAFT_KEY, id);
  }

  // Limpiar draft actual
  static clearCurrentDraft(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CURRENT_DRAFT_KEY);
  }

  // Generar ID único
  static generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Verificar si hay cambios sin guardar
  static hasUnsavedChanges(
    steps: WizardStep[],
    currentStepIndex: number,
    travelInfo: TravelInfo
  ): boolean {
    const currentDraftId = this.getCurrentDraftId();
    if (!currentDraftId) return false;

    const savedDraft = this.getDraft(currentDraftId);
    if (!savedDraft) return false;

    // Comparar estado actual con el guardado
    return (
      JSON.stringify(steps) !== JSON.stringify(savedDraft.steps) ||
      currentStepIndex !== savedDraft.currentStepIndex ||
      JSON.stringify(travelInfo) !== JSON.stringify(savedDraft.travelInfo)
    );
  }
}

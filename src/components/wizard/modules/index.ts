/**
 * Índice de exportaciones del Wizard Modular
 */

export { ModularWizard } from "../ModularWizard";
export { ServiceSelectionStep } from "./ServiceSelectionStep";
export { FlightModule } from "./FlightModule";
export { HotelModule } from "./HotelModule";
export { CarModule } from "./CarModule";
export { ActivitiesModule } from "./ActivitiesModule";
export { SummaryView } from "../SummaryView";

// Re-export del store para facilitar el acceso
export { useWizardStore } from "@/stores/wizardStore";

// Re-export de tipos
export * from "@/types/wizard";

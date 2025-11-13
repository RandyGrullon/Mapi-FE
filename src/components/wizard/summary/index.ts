/**
 * Exportaciones de componentes de resumen
 */

// Layout components
export { SummaryHeader } from "./SummaryHeader";
export { SummaryActions } from "./SummaryActions";
export { ModuleCard } from "./ModuleCard";

// Summary components
export { FlightSummary } from "./FlightSummary";
export { HotelSummary } from "./HotelSummary";
export { CarSummary } from "./CarSummary";
export { ActivitiesSummary } from "./ActivitiesSummary";

// Optional forms
export {
  OptionalHotelForm,
  OptionalCarForm,
  OptionalActivitiesForm,
} from "./optional";

// Edit forms
export {
  EditHotelForm,
  EditCarForm,
  EditActivitiesForm,
  EditFlightForm,
} from "./edit";

// Utilities
export { buildPackageFromModules, getServiceName } from "./utils";

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { DraftManager } from "../drafts/DraftManager";

export type WizardStep = {
  id: string;
  title: string;
  completed: boolean;
  response?: string;
  locked?: boolean; // Indica si el paso está bloqueado para interacción
  conditional?: boolean; // Indica si el paso depende de una condición previa
  example?: string; // Ejemplo para guiar al usuario
  options?: string[]; // Opciones predefinidas para selección
  inputType?: "text" | "select" | "multiselect" | "number" | "date" | "dual"; // Tipo de input
  multiSelect?: boolean; // Permite selección múltiple en las opciones
};

export type TravelInfo = {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string | number;
  flightPreference: string;
  accommodationType: string;
  activities: string | string[];
  budget: string;
  organizedActivities: string | boolean;
  [key: string]: any;
};

interface WizardContextType {
  steps: WizardStep[];
  currentStepIndex: number;
  completeCurrentStep: (
    response: string,
    fieldUpdate?: { field: string; value: any }
  ) => void;
  completeCurrentStepWithMultipleFields: (
    response: string,
    fieldUpdates: { field: string; value: any }[]
  ) => void;
  goToStep: (index: number) => void;
  resetWizard: () => void;
  loadDraft: (draftId: string) => void;
  isLastStep: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
  travelInfo: TravelInfo;
  currentDraftId: string | null;
  allStepsCompleted: boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  // Predefinimos todos los pasos posibles del wizard desde el inicio
  const [steps, setSteps] = useState<WizardStep[]>([
    {
      id: "step-1",
      title: "¿Desde dónde viajas y cuál es tu destino?",
      completed: false,
      example: "Cuéntanos tu origen y destino",
      inputType: "dual", // Nuevo tipo para inputs duales
    },
    {
      id: "step-2",
      title: "¿Cuáles son tus fechas de viaje?",
      completed: false,
      locked: true,
      example: "Ej: 15 de enero - 22 de enero, 2025",
      inputType: "text",
    },
    {
      id: "step-3",
      title: "¿Cuántas personas viajarán en total?",
      completed: false,
      locked: true,
      example: "Ej: 2 personas",
      inputType: "number",
    },
    {
      id: "step-4",
      title: "¿Qué tipo de vuelo prefieres?",
      completed: false,
      locked: true,
      inputType: "select",
      options: [
        "Económico (más barato)",
        "Directo (sin escalas)",
        "Ejecutivo/Business",
        "Primera clase",
        "Flexible (cualquier opción disponible)",
      ],
    },
    {
      id: "step-5",
      title: "¿Qué tipo de hospedaje prefieres?",
      completed: false,
      locked: true,
      inputType: "select",
      options: [
        "Hotel económico (2-3 estrellas)",
        "Hotel confort (4 estrellas)",
        "Hotel de lujo (5 estrellas)",
        "Resort todo incluido",
        "Apartamento/Airbnb",
        "Hostel",
        "Boutique hotel",
      ],
    },
    {
      id: "step-6",
      title: "¿Qué tipo de actividades te interesan más?",
      completed: false,
      locked: true,
      inputType: "multiselect",
      multiSelect: true,
      example: "Puedes seleccionar múltiples opciones",
      options: [
        "Aventura y deportes extremos",
        "Cultura e historia",
        "Playas y relajación",
        "Gastronomía y restaurantes",
        "Vida nocturna y entretenimiento",
        "Naturaleza y senderismo",
        "Compras y shopping",
        "Fotografía y paisajes",
      ],
    },
    {
      id: "step-7",
      title: "¿Cuál es tu presupuesto aproximado para este viaje?",
      completed: false,
      locked: true,
      inputType: "select",
      options: [
        "Económico (menos de $1,000 USD)",
        "Moderado ($1,000 - $3,000 USD)",
        "Confortable ($3,000 - $5,000 USD)",
        "Premium ($5,000 - $10,000 USD)",
        "Lujo (más de $10,000 USD)",
      ],
    },
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  // Objeto para almacenar toda la información del viaje
  const [travelInfo, setTravelInfo] = useState<TravelInfo>({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 0,
    flightPreference: "",
    accommodationType: "",
    activities: [],
    budget: "",
    organizedActivities: false,
  });

  const pathname = usePathname();

  // Limpiar currentDraftId cuando no estamos en el wizard
  useEffect(() => {
    if (pathname !== "/plan" && currentDraftId) {
      setCurrentDraftId(null);
    }
  }, [pathname, currentDraftId]);

  // Auto-guardar draft cuando hay cambios
  useEffect(() => {
    // Solo auto-guardar si hay progreso (al menos un paso completado, datos ingresados, o input actual)
    const hasProgress =
      steps.some((s) => s.completed) ||
      travelInfo.origin ||
      travelInfo.destination ||
      travelInfo.startDate ||
      travelInfo.endDate ||
      userInput.trim().length > 0;

    if (hasProgress) {
      const draftId = DraftManager.saveDraft(
        steps,
        currentStepIndex,
        travelInfo,
        currentDraftId || undefined
      );
      setCurrentDraftId(draftId);
    }
  }, [steps, currentStepIndex, travelInfo, userInput]);

  // Cargar draft al iniciar si existe uno activo
  useEffect(() => {
    const activeDraftId = DraftManager.getCurrentDraftId();
    if (activeDraftId) {
      const draft = DraftManager.getDraft(activeDraftId);
      if (draft) {
        setSteps(draft.steps);
        setCurrentStepIndex(draft.currentStepIndex);
        setTravelInfo(draft.travelInfo);
        setCurrentDraftId(draft.id);
      }
    }
  }, []);

  // Ya no necesitamos addStep porque todos los pasos están predefinidos

  const completeCurrentStep = (
    response: string,
    fieldUpdate?: { field: string; value: any }
  ) => {
    const updatedSteps = [...steps];

    // Completar el paso actual
    updatedSteps[currentStepIndex] = {
      ...updatedSteps[currentStepIndex],
      completed: true,
      response,
    };

    // Determinar el próximo paso a desbloquear
    let nextStepIndex = currentStepIndex + 1;

    // No hay pasos condicionales en el nuevo flujo, simplemente desbloqueamos el siguiente paso
    if (nextStepIndex < updatedSteps.length) {
      updatedSteps[nextStepIndex] = {
        ...updatedSteps[nextStepIndex],
        locked: false,
      };
    }

    setSteps(updatedSteps);

    // Actualizar información de viaje si se proporciona
    if (fieldUpdate) {
      setTravelInfo((prev) => ({
        ...prev,
        [fieldUpdate.field]: fieldUpdate.value,
      }));
    }

    // Avanzar al siguiente paso
    if (currentStepIndex < updatedSteps.length - 1) {
      setCurrentStepIndex(nextStepIndex);
    }
  };

  const completeCurrentStepWithMultipleFields = (
    response: string,
    fieldUpdates: { field: string; value: any }[]
  ) => {
    const updatedSteps = [...steps];

    // Completar el paso actual
    updatedSteps[currentStepIndex] = {
      ...updatedSteps[currentStepIndex],
      completed: true,
      response,
    };

    // Desbloquear el siguiente paso
    let nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < updatedSteps.length) {
      updatedSteps[nextStepIndex] = {
        ...updatedSteps[nextStepIndex],
        locked: false,
      };
    }

    setSteps(updatedSteps);

    // Actualizar múltiples campos en travelInfo
    if (fieldUpdates && fieldUpdates.length > 0) {
      setTravelInfo((prev) => {
        const updated = { ...prev };
        fieldUpdates.forEach((update) => {
          updated[update.field] = update.value;
        });
        return updated;
      });
    }

    // Avanzar al siguiente paso
    if (currentStepIndex < updatedSteps.length - 1) {
      setCurrentStepIndex(nextStepIndex);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const resetWizard = () => {
    // Reiniciar todos los pasos predefinidos con la nueva estructura de 8 pasos
    setSteps([
      {
        id: "step-1",
        title: "¿Desde dónde viajas y cuál es tu destino?",
        completed: false,
        example: "Cuéntanos tu origen y destino",
        inputType: "dual", // Nuevo tipo para inputs duales
      },
      {
        id: "step-2",
        title: "¿Cuáles son tus fechas de viaje?",
        completed: false,
        locked: true,
        example: "Ej: 15 de enero - 22 de enero, 2025",
        inputType: "text",
      },
      {
        id: "step-3",
        title: "¿Cuántas personas viajarán en total?",
        completed: false,
        locked: true,
        example: "Ej: 2 personas",
        inputType: "number",
      },
      {
        id: "step-4",
        title: "¿Qué tipo de vuelo prefieres?",
        completed: false,
        locked: true,
        inputType: "select",
        options: [
          "Económico (más barato)",
          "Directo (sin escalas)",
          "Ejecutivo/Business",
          "Primera clase",
          "Flexible (cualquier opción disponible)",
        ],
      },
      {
        id: "step-5",
        title: "¿Qué tipo de hospedaje prefieres?",
        completed: false,
        locked: true,
        inputType: "select",
        options: [
          "Hotel económico (2-3 estrellas)",
          "Hotel confort (4 estrellas)",
          "Hotel de lujo (5 estrellas)",
          "Resort todo incluido",
          "Apartamento/Airbnb",
          "Hostel",
          "Boutique hotel",
        ],
      },
      {
        id: "step-6",
        title: "¿Qué tipo de actividades te interesan más?",
        completed: false,
        locked: true,
        inputType: "multiselect",
        multiSelect: true,
        example: "Puedes seleccionar múltiples opciones",
        options: [
          "Aventura y deportes extremos",
          "Cultura e historia",
          "Playas y relajación",
          "Gastronomía y restaurantes",
          "Vida nocturna y entretenimiento",
          "Naturaleza y senderismo",
          "Compras y shopping",
          "Fotografía y paisajes",
        ],
      },
      {
        id: "step-7",
        title: "¿Cuál es tu presupuesto aproximado para este viaje?",
        completed: false,
        locked: true,
        inputType: "select",
        options: [
          "Económico (menos de $1,000 USD)",
          "Moderado ($1,000 - $3,000 USD)",
          "Confortable ($3,000 - $5,000 USD)",
          "Premium ($5,000 - $10,000 USD)",
          "Lujo (más de $10,000 USD)",
        ],
      },
    ]);
    setCurrentStepIndex(0);
    setUserInput("");
    setTravelInfo({
      origin: "",
      destination: "",
      startDate: "",
      endDate: "",
      travelers: 0,
      flightPreference: "",
      accommodationType: "",
      activities: [],
      budget: "",
      organizedActivities: false,
    });
    // Limpiar draft actual
    DraftManager.clearCurrentDraft();
    setCurrentDraftId(null);
  };

  const loadDraft = (draftId: string) => {
    const draft = DraftManager.getDraft(draftId);
    if (draft) {
      setSteps(draft.steps);
      setCurrentStepIndex(draft.currentStepIndex);
      setTravelInfo(draft.travelInfo);
      setCurrentDraftId(draft.id);
      DraftManager.setCurrentDraftId(draft.id);
    }
  };

  return (
    <WizardContext.Provider
      value={{
        steps,
        currentStepIndex,
        completeCurrentStep,
        completeCurrentStepWithMultipleFields,
        goToStep,
        resetWizard,
        loadDraft,
        isLastStep: currentStepIndex === steps.length - 1,
        userInput,
        setUserInput,
        travelInfo,
        currentDraftId,
        allStepsCompleted: steps.every((step) => step.completed),
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

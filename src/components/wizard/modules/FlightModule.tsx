/**
 * Módulo de Vuelos
 * Maneja toda la lógica de vuelos: solo ida, ida y vuelta, varias ciudades
 */

"use client";

import { useState, useEffect } from "react";
import {
  ServiceType,
  FlightType,
  FlightModuleData,
  FlightSegment,
  ModuleComponentProps,
} from "@/types/wizard";
import { useWizardStore } from "@/stores/wizardStore";

export const FlightModule = ({
  data,
  onUpdate,
  onComplete,
  onBack,
  currentStep,
  isLastModule,
}: ModuleComponentProps<FlightModuleData>) => {
  // ========== PASO 1: TIPO DE VUELO ==========
  if (currentStep === 0) {
    return <FlightTypeStep data={data} onUpdate={onUpdate} />;
  }

  // ========== PASO 2: RUTAS/SEGMENTOS ==========
  if (currentStep === 1) {
    return <FlightRoutesStep data={data} onUpdate={onUpdate} />;
  }

  // ========== PASO 3: DETALLES ADICIONALES ==========
  if (currentStep === 2) {
    return (
      <FlightDetailsStep
        data={data}
        onUpdate={onUpdate}
        onComplete={onComplete}
        onBack={onBack}
        isLastModule={isLastModule}
      />
    );
  }

  return null;
};

// ========== PASO 1: SELECCIÓN DE TIPO DE VUELO ==========
const FlightTypeStep = ({
  data,
  onUpdate,
}: {
  data: FlightModuleData;
  onUpdate: (data: Partial<FlightModuleData>) => void;
}) => {
  const { nextModule, previousModule } = useWizardStore();
  const [selectedType, setSelectedType] = useState<FlightType | null>(
    data.flightType
  );

  const flightTypes = [
    {
      type: FlightType.ONE_WAY,
      label: "Solo ida",
      icon: "➡️",
      description: "Un vuelo en una sola dirección",
    },
    {
      type: FlightType.ROUND_TRIP,
      label: "Ida y vuelta",
      icon: "🔄",
      description: "Vuelo de ida y regreso",
    },
    {
      type: FlightType.MULTI_CITY,
      label: "Varias ciudades",
      icon: "🗺️",
      description: "Múltiples destinos en un viaje",
    },
  ];

  const handleSelect = (type: FlightType) => {
    setSelectedType(type);

    // Configurar segmentos iniciales según el tipo
    let initialSegments: FlightSegment[];

    if (type === FlightType.ONE_WAY) {
      initialSegments = [{ id: "segment-1", from: "", to: "" }];
    } else if (type === FlightType.ROUND_TRIP) {
      initialSegments = [
        { id: "segment-1", from: "", to: "" },
        { id: "segment-2", from: "", to: "" },
      ];
    } else {
      initialSegments = [
        { id: "segment-1", from: "", to: "" },
        { id: "segment-2", from: "", to: "" },
      ];
    }

    onUpdate({
      flightType: type,
      segments: initialSegments,
    });
  };

  const handleConfirm = () => {
    if (selectedType) {
      nextModule();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Qué tipo de vuelo deseas?
        </h2>
        <p className="text-gray-600">Selecciona una opción</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {flightTypes.map((flight) => {
          const isSelected = selectedType === flight.type;

          return (
            <button
              key={flight.type}
              onClick={() => handleSelect(flight.type)}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200 text-left
                ${
                  isSelected
                    ? "border-black bg-black text-white shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{flight.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{flight.label}</h3>
                  <p
                    className={`text-sm ${
                      isSelected ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {flight.description}
                  </p>
                </div>
                {isSelected && (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={previousModule}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedType}
          className={`
            flex-1 px-6 py-3 rounded-xl font-semibold transition-all
            ${
              selectedType
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// ========== PASO 2: RUTAS Y SEGMENTOS ==========
const FlightRoutesStep = ({
  data,
  onUpdate,
}: {
  data: FlightModuleData;
  onUpdate: (data: Partial<FlightModuleData>) => void;
}) => {
  const { nextModule, previousModule } = useWizardStore();
  const [segments, setSegments] = useState<FlightSegment[]>(data.segments);

  useEffect(() => {
    onUpdate({ segments });
  }, [segments]);

  const updateSegment = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], [field]: value };

    // Si es "Varias ciudades" y se completa el "to", autocompletar el siguiente "from"
    if (
      data.flightType === FlightType.MULTI_CITY &&
      field === "to" &&
      value &&
      index < segments.length - 1
    ) {
      newSegments[index + 1] = {
        ...newSegments[index + 1],
        from: value,
      };
    }

    setSegments(newSegments);
  };

  const addSegment = () => {
    const lastSegment = segments[segments.length - 1];
    setSegments([
      ...segments,
      {
        id: `segment-${segments.length + 1}`,
        from: lastSegment.to || "", // Autocompletar con el último destino
        to: "",
      },
    ]);
  };

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      const newSegments = segments.filter((_, i) => i !== index);
      setSegments(newSegments);
    }
  };

  const canContinue = segments.every((seg) => seg.from && seg.to);

  const getTitle = () => {
    if (data.flightType === FlightType.ONE_WAY)
      return "¿De dónde a dónde viajas?";
    if (data.flightType === FlightType.ROUND_TRIP)
      return "¿Cuál es tu ruta de ida y vuelta?";
    return "Agrega tus destinos";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
        {data.flightType === FlightType.MULTI_CITY && (
          <p className="text-gray-600">
            El destino de cada vuelo se convierte en el origen del siguiente
          </p>
        )}
      </div>

      <div className="space-y-6">
        {segments.map((segment, index) => (
          <div key={segment.id} className="relative">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              {/* Título del segmento */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">
                  {data.flightType === FlightType.ROUND_TRIP
                    ? index === 0
                      ? "Vuelo de ida"
                      : "Vuelo de regreso"
                    : `Vuelo ${index + 1}`}
                </h3>
                {data.flightType === FlightType.MULTI_CITY &&
                  segments.length > 2 &&
                  index > 0 && (
                    <button
                      onClick={() => removeSegment(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  )}
              </div>

              {/* Inputs de origen y destino */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desde
                  </label>
                  <input
                    type="text"
                    value={segment.from}
                    onChange={(e) =>
                      updateSegment(index, "from", e.target.value)
                    }
                    placeholder="Ej: Madrid"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hacia
                  </label>
                  <input
                    type="text"
                    value={segment.to}
                    onChange={(e) => updateSegment(index, "to", e.target.value)}
                    placeholder="Ej: París"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Botón para agregar más destinos (solo para varias ciudades) */}
        {data.flightType === FlightType.MULTI_CITY && (
          <button
            onClick={addSegment}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            + Agregar otro destino
          </button>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={previousModule}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={nextModule}
          disabled={!canContinue}
          className={`
            flex-1 px-6 py-3 rounded-xl font-semibold transition-all
            ${
              canContinue
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// ========== PASO 3: DETALLES ADICIONALES ==========
const FlightDetailsStep = ({
  data,
  onUpdate,
  onComplete,
  onBack,
  isLastModule,
}: {
  data: FlightModuleData;
  onUpdate: (data: Partial<FlightModuleData>) => void;
  onComplete: () => void;
  onBack: () => void;
  isLastModule: boolean;
}) => {
  const { completeModule, nextModule, previousModule } = useWizardStore();
  const [travelers, setTravelers] = useState(data.travelers || 1);
  const [cabinClass, setCabinClass] = useState(data.cabinClass || "economy");

  const cabinClasses = [
    { value: "economy", label: "Económica" },
    { value: "premium", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "Primera Clase" },
  ];

  const handleComplete = () => {
    onUpdate({ travelers, cabinClass });
    completeModule(ServiceType.FLIGHTS);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Detalles del vuelo
        </h2>
        <p className="text-gray-600">Información adicional para tu búsqueda</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
        {/* Número de viajeros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cuántas personas viajarán?
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold w-12 text-center">
              {travelers}
            </span>
            <button
              onClick={() => setTravelers(travelers + 1)}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Clase de cabina */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Clase de cabina
          </label>
          <div className="grid grid-cols-2 gap-3">
            {cabinClasses.map((cabin) => (
              <button
                key={cabin.value}
                onClick={() => setCabinClass(cabin.value)}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${
                    cabinClass === cabin.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {cabin.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={previousModule}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          {isLastModule ? "Finalizar" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

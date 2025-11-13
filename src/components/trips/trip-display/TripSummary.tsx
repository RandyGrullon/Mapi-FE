"use client";

import { useWizard } from "../../wizard/WizardProvider";

export const TripSummary = () => {
  const { travelInfo } = useWizard();

  // Solo mostrar el resumen cuando tengamos suficiente información
  if (!travelInfo.destination || !travelInfo.origin) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 animate-fade-in w-full">
      {/* Header con diseño mejorado */}
      <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <div className="bg-gray-900 p-2 md:p-3 rounded-xl flex-shrink-0">
            <span className="text-xl md:text-2xl">✈️</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
              Resumen de tu viaje
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Revisa los detalles de tu próxima aventura
            </p>
          </div>
        </div>
      </div>

      {/* Ruta del viaje - Destacada */}
      <div className="mb-4 md:mb-6 bg-gray-50 rounded-xl p-3 md:p-5 border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Origen
            </p>
            <p className="text-sm md:text-lg font-bold text-gray-900 truncate">
              {travelInfo.origin}
            </p>
          </div>
          <div className="px-2 md:px-4 flex-shrink-0">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="h-px w-4 md:w-8 bg-gray-300"></div>
              <span className="text-lg md:text-2xl">✈️</span>
              <div className="h-px w-4 md:w-8 bg-gray-300"></div>
            </div>
          </div>
          <div className="flex-1 text-right min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Destino
            </p>
            <p className="text-sm md:text-lg font-bold text-gray-900 truncate">
              {travelInfo.destination}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de detalles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {travelInfo.startDate && travelInfo.endDate && (
          <SummaryCard
            icon="📅"
            label="Fechas de viaje"
            value={`${new Date(
              travelInfo.startDate + "T00:00:00"
            ).toLocaleDateString("es-ES")} - ${new Date(
              travelInfo.endDate + "T00:00:00"
            ).toLocaleDateString("es-ES")}`}
            color="green"
          />
        )}

        <SummaryCard
          icon="👥"
          label="Viajeros"
          value={
            Number(travelInfo.travelers) > 0
              ? `${travelInfo.travelers} ${
                  Number(travelInfo.travelers) === 1 ? "persona" : "personas"
                }`
              : "No especificado"
          }
          color="purple"
        />

        {travelInfo.flightPreference && (
          <SummaryCard
            icon="🛫"
            label="Preferencia de vuelo"
            value={travelInfo.flightPreference}
            color="blue"
          />
        )}

        {travelInfo.accommodationType && (
          <SummaryCard
            icon="🏨"
            label="Tipo de alojamiento"
            value={travelInfo.accommodationType}
            color="orange"
          />
        )}

        {travelInfo.budget && (
          <SummaryCard
            icon="💰"
            label="Presupuesto"
            value={travelInfo.budget}
            color="emerald"
          />
        )}
      </div>

      {/* Actividades - Sección destacada */}
      {travelInfo.activities &&
        (Array.isArray(travelInfo.activities)
          ? travelInfo.activities.length > 0
          : travelInfo.activities !== "") && (
          <div className="mb-4 md:mb-6 bg-gray-50 rounded-xl p-3 md:p-5 border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎯</span>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Actividades de interés
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(travelInfo.activities) ? (
                travelInfo.activities.map((activity: string, i: number) => (
                  <span
                    key={i}
                    className="bg-white text-gray-900 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all"
                  >
                    {activity}
                  </span>
                ))
              ) : (
                <span className="bg-white text-gray-900 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold border border-gray-300">
                  {travelInfo.activities}
                </span>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

// Componente mejorado de tarjeta de resumen con iconos y colores
const SummaryCard = ({
  icon,
  label,
  value,
  color = "gray",
}: {
  icon: string;
  label: string;
  value: string | number;
  color?: "blue" | "green" | "purple" | "orange" | "emerald" | "gray";
}) => {
  // Todos los colores ahora son sutiles y grises
  const colorClasses = {
    blue: "bg-gray-50 border-gray-200",
    green: "bg-gray-50 border-gray-200",
    purple: "bg-gray-50 border-gray-200",
    orange: "bg-gray-50 border-gray-200",
    emerald: "bg-gray-50 border-gray-200",
    gray: "bg-gray-50 border-gray-200",
  };

  return (
    <div
      className={`${colorClasses[color]} rounded-xl p-3 md:p-4 border hover:border-gray-300 hover:shadow-sm transition-all overflow-hidden`}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <span className="text-xl md:text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 truncate">
            {label}
          </p>
          <p className="text-sm md:text-base font-bold text-gray-900 break-words line-clamp-2">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

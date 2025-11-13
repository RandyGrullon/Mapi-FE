/**
 * Header del resumen final
 */

"use client";

interface SummaryHeaderProps {
  onBack: () => void;
}

export const SummaryHeader = ({ onBack }: SummaryHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-2xl mb-6">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-4xl font-bold text-gray-900 mb-3">
        Configuración completada
      </h2>
      <p className="text-lg text-gray-500 mb-4">
        Revisa los detalles de tu viaje antes de buscar opciones
      </p>

      {/* Botón volver a editar */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
        Volver a editar
      </button>
    </div>
  );
};

"use client";

interface DraftsHeaderProps {
  onCreateNew: () => void;
}

export const DraftsHeader = ({ onCreateNew }: DraftsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Borradores
          </h1>
          <p className="text-gray-600">
            Continúa planificando tus viajes guardados
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-black/90 transition-all duration-200 flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Viaje
        </button>
      </div>
    </div>
  );
};

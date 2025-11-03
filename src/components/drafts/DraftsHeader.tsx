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
      </div>
    </div>
  );
};

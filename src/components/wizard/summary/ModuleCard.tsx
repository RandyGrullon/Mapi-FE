/**
 * Card de módulo en el resumen
 */

"use client";

import { ServiceType } from "@/types/wizard";

interface ModuleCardProps {
  module: any;
  index: number;
  isEditing: boolean;
  getServiceIcon: (type: ServiceType) => string;
  getServiceLabel: (type: ServiceType) => string;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (data: any) => void;
  renderSummary: () => React.ReactNode;
  renderEditForm: () => React.ReactNode;
}

export const ModuleCard = ({
  module,
  index,
  isEditing,
  getServiceIcon,
  getServiceLabel,
  onEdit,
  onCancelEdit,
  onSave,
  renderSummary,
  renderEditForm,
}: ModuleCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-black rounded-xl text-2xl">
              {getServiceIcon(module.type)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {getServiceLabel(module.type)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Configuración del servicio
              </p>
            </div>
          </div>
          {isEditing ? (
            <button
              onClick={onCancelEdit}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancelar
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 py-5">
        {isEditing ? renderEditForm() : renderSummary()}
      </div>
    </div>
  );
};

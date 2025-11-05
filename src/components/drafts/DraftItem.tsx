/**
 * Draft Item
 * Componente para mostrar un borrador individual
 */

"use client";

import { Draft } from "@/types/draft";
import { useState } from "react";

interface DraftItemProps {
  draft: Draft;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onEditName: (e: React.MouseEvent) => void;
}

export const DraftItem = ({
  draft,
  isSelected,
  isCollapsed,
  onClick,
  onDelete,
  onEditName,
}: DraftItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Formato de fecha corto
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  if (isCollapsed) {
    return (
      <div
        className="relative group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={onClick}
          className={`w-full p-2 rounded-lg transition-all duration-200 border-2 ${
            isSelected
              ? "border-blue-500 bg-blue-100 shadow-md"
              : "border-gray-200 bg-white hover:bg-gray-50"
          } hover:shadow-md relative`}
        >
          {/* Progress circle */}
          <div className="flex justify-center">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 14 * (1 - draft.progress / 100)
                  }`}
                  className={isSelected ? "text-blue-600" : "text-amber-500"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-700">
                  {draft.progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Badge de borrador */}
          <div className="absolute top-1 right-1">
            <div className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
              DRAFT
            </div>
          </div>
        </button>

        {/* Tooltip en collapsed */}
        {showTooltip && (
          <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-100 visible transition-all duration-200 z-50 shadow-xl min-w-[200px]">
            <p className="font-bold text-sm">{draft.name}</p>
            {draft.previewInfo?.origin && draft.previewInfo?.destination && (
              <p className="text-gray-300 text-[10px] mt-1">
                {draft.previewInfo.origin} → {draft.previewInfo.destination}
              </p>
            )}
            {draft.previewInfo?.dates && (
              <p className="text-gray-300 text-[10px]">
                {draft.previewInfo.dates}
              </p>
            )}
            <p className="text-gray-400 text-[10px] mt-1">
              Actualizado: {formatDate(draft.updatedAt)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">
                {draft.progress}% completado
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista expandida
  return (
    <div
      className={`w-full p-3 rounded-lg transition-all duration-200 group border-2 ${
        isSelected
          ? "border-blue-500 bg-blue-100 shadow-md"
          : "border-gray-200 bg-white hover:bg-gray-50"
      } hover:shadow-md cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-gray-900 truncate">
              {draft.name}
            </p>
            <div className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
              DRAFT
            </div>
          </div>

          {draft.previewInfo?.origin && draft.previewInfo?.destination && (
            <p className="text-xs text-gray-600 truncate">
              {draft.previewInfo.origin} → {draft.previewInfo.destination}
            </p>
          )}

          {draft.previewInfo?.dates && (
            <p className="text-xs text-gray-500 mt-0.5">
              {draft.previewInfo.dates}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {/* Progress bar */}
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all"
                style={{ width: `${draft.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-600 flex-shrink-0">
              {draft.progress}%
            </span>
          </div>

          <p className="text-[10px] text-gray-400 mt-1">
            {formatDate(draft.updatedAt)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onEditName}
            className="p-1.5 rounded-md hover:bg-white/80 transition-colors"
            title="Editar nombre"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 rounded-md hover:bg-white/80 transition-colors"
            title="Eliminar borrador"
          >
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

"use client";

import { Draft } from "./DraftManager";

interface DraftItemProps {
  draft: Draft;
  isSelected: boolean;
  onLoad: (draftId: string) => void;
  onDelete: (draftId: string, e: React.MouseEvent) => void;
  formatDate: (dateString: string) => string;
  isCollapsed: boolean;
}

export const DraftItem = ({
  draft,
  isSelected,
  onLoad,
  onDelete,
  formatDate,
  isCollapsed,
}: DraftItemProps) => {
  if (isCollapsed) {
    return (
      <button
        onClick={() => onLoad(draft.id)}
        className={`w-full p-2 rounded-lg transition-all duration-200 group relative ${
          isSelected
            ? "bg-blue-100 border-2 border-blue-400"
            : "bg-gray-100 hover:bg-gray-200 border-2 border-transparent"
        }`}
        title={`${draft.name} - ${draft.progress}% completado`}
      >
        <div className="relative">
          <svg
            className="w-6 h-6 mx-auto text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {/* Badge con progreso */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {draft.progress}
          </span>
        </div>

        {/* Tooltip expandido al hacer hover */}
        <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
          <p className="font-semibold">{draft.name}</p>
          <p className="text-gray-300 text-[10px] mt-1">
            {draft.progress}% completado
          </p>
          <p className="text-gray-400 text-[10px]">
            {formatDate(draft.updatedAt)}
          </p>
          {/* Flecha del tooltip */}
          <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={() => onLoad(draft.id)}
      className={`w-full p-3 rounded-lg transition-all duration-200 text-left group relative cursor-pointer ${
        isSelected
          ? "bg-blue-100 border-2 border-blue-500"
          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
      }`}
      title={draft.name}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {draft.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${draft.progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{draft.progress}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(draft.updatedAt)}
          </p>
        </div>
        <button
          onClick={(e) => onDelete(draft.id, e)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all flex-shrink-0"
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
  );
};

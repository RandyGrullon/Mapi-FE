"use client";

import { Draft } from "./DraftManager";

interface DraftCardProps {
  draft: Draft;
  onLoad: (draftId: string) => void;
  onDelete: (draftId: string, e: React.MouseEvent) => void;
  formatDate: (dateString: string) => string;
}

export const DraftCard = ({
  draft,
  onLoad,
  onDelete,
  formatDate,
}: DraftCardProps) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onLoad(draft.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
            {draft.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${draft.progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">{draft.progress}%</span>
          </div>
          <div className="space-y-1">
            {draft.travelInfo.origin && draft.travelInfo.destination && (
              <p className="text-sm text-gray-600">
                {draft.travelInfo.origin} → {draft.travelInfo.destination}
              </p>
            )}
            {draft.travelInfo.startDate && draft.travelInfo.endDate && (
              <p className="text-sm text-gray-600">
                {new Date(draft.travelInfo.startDate).toLocaleDateString('es-ES')} - {new Date(draft.travelInfo.endDate).toLocaleDateString('es-ES')}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {formatDate(draft.updatedAt)}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(draft.id, e);
          }}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all ml-2"
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
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {draft.steps.filter((s) => s.completed).length} de{" "}
          {draft.steps.length} pasos completados
        </span>
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
};

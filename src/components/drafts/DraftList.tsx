/**
 * Draft List
 * Componente para mostrar la lista de borradores
 */

"use client";

import { useState, useEffect } from "react";
import { useDraftStore } from "@/stores/draftStore";
import { DraftItem } from "./DraftItem";
import { Draft } from "@/types/draft";

interface DraftListProps {
  isCollapsed: boolean;
  onDraftClick: (draft: Draft) => void;
  onEditDraftName: (draft: Draft, e: React.MouseEvent) => void;
  onDeleteDraft: (draft: Draft, e: React.MouseEvent) => void;
  selectedDraftId: string | null;
}

export const DraftList = ({
  isCollapsed,
  onDraftClick,
  onEditDraftName,
  onDeleteDraft,
  selectedDraftId,
}: DraftListProps) => {
  const { drafts } = useDraftStore();
  const [isExpanded, setIsExpanded] = useState(true);

  // Debug: ver drafts en consola
  useEffect(() => {
    console.log("DraftList - Total drafts:", drafts.length);
    console.log("DraftList - Drafts:", drafts);
  }, [drafts]);

  // Mostrar sección incluso si no hay drafts (para debugging)
  // if (drafts.length === 0) return null;

  if (isCollapsed) {
    // En modo colapsado, no mostrar si no hay drafts
    if (drafts.length === 0) return null;

    return (
      <div className="flex-shrink-0">
        <div className="space-y-2">
          {drafts.slice(0, 3).map((draft) => (
            <DraftItem
              key={draft.id}
              draft={draft}
              isSelected={selectedDraftId === draft.id}
              isCollapsed={true}
              onClick={() => onDraftClick(draft)}
              onDelete={(e) => onDeleteDraft(draft, e)}
              onEditName={(e) => onEditDraftName(draft, e)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
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
          <span className="text-sm font-semibold text-gray-700">
            Borradores
          </span>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {drafts.length}
          </span>
        </div>
      </button>

      {/* Lista de borradores */}
      {isExpanded && (
        <div className="space-y-2 px-2 pb-3 max-h-[300px] overflow-y-auto">
          {drafts.map((draft) => (
            <DraftItem
              key={draft.id}
              draft={draft}
              isSelected={selectedDraftId === draft.id}
              isCollapsed={false}
              onClick={() => onDraftClick(draft)}
              onDelete={(e) => onDeleteDraft(draft, e)}
              onEditName={(e) => onEditDraftName(draft, e)}
            />
          ))}

          {drafts.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              No hay borradores guardados
            </div>
          )}
        </div>
      )}
    </div>
  );
};

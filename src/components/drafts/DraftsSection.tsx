"use client";

import { useState } from "react";
import { Draft } from "./DraftManager";
import { DraftItem } from "./DraftItem";

interface DraftsSectionProps {
  drafts: Draft[];
  currentDraftId: string | null;
  pathname: string;
  onLoadDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string, e: React.MouseEvent) => void;
  formatDate: (dateString: string) => string;
  isCollapsed: boolean;
}

export const DraftsSection = ({
  drafts,
  currentDraftId,
  pathname,
  onLoadDraft,
  onDeleteDraft,
  formatDate,
  isCollapsed,
}: DraftsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (drafts.length === 0) return null;

  if (isCollapsed) {
    return (
      <div className="flex-shrink-0 mb-6">
        <div className="space-y-2">
          {drafts.slice(0, 3).map((draft) => (
            <DraftItem
              key={draft.id}
              draft={draft}
              isSelected={pathname === "/plan" && draft.id === currentDraftId}
              onLoad={onLoadDraft}
              onDelete={onDeleteDraft}
              formatDate={formatDate}
              isCollapsed={isCollapsed}
            />
          ))}
          {drafts.length > 3 && (
            <div className="text-center py-1">
              <span
                className="text-xs text-gray-500 font-medium"
                title={`${drafts.length - 3} borradores más`}
              >
                +{drafts.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-500 mb-3 hover:text-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
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
          <span>Borradores ({drafts.length})</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {drafts.map((draft) => (
            <DraftItem
              key={draft.id}
              draft={draft}
              isSelected={pathname === "/plan" && draft.id === currentDraftId}
              onLoad={onLoadDraft}
              onDelete={onDeleteDraft}
              formatDate={formatDate}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

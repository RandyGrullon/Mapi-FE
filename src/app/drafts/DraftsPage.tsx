"use client";

import { useDraftsPage } from "@/components/useDraftsPage";
import { DraftCard } from "@/components/DraftCard";
import { EmptyDraftsState } from "@/components/EmptyDraftsState";
import { DraftsHeader } from "@/components/DraftsHeader";
import { DeleteDraftModal } from "@/components/DeleteDraftModal";

const DraftsPage = () => {
  const {
    drafts,
    isDeleteModalOpen,
    draftToDelete,
    handleLoadDraft,
    handleDeleteDraft,
    confirmDeleteDraft,
    cancelDeleteDraft,
    handleNewTrip,
    formatDate,
  } = useDraftsPage();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <DraftsHeader onCreateNew={handleNewTrip} />

          {drafts.length === 0 ? (
            <EmptyDraftsState onCreateNew={handleNewTrip} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {drafts.map((draft) => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  onLoad={handleLoadDraft}
                  onDelete={handleDeleteDraft}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteDraftModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDeleteDraft}
        onCancel={cancelDeleteDraft}
      />
    </div>
  );
};

export default DraftsPage;

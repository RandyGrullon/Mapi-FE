/**
 * Edit Draft Name Modal
 * Modal para editar el nombre de un borrador
 */

"use client";

import { useState, useEffect } from "react";
import { Draft } from "@/types/draft";

interface EditDraftNameModalProps {
  isOpen: boolean;
  draft: Draft | null;
  onClose: () => void;
  onSave: (draftId: string, newName: string) => void;
}

export const EditDraftNameModal = ({
  isOpen,
  draft,
  onClose,
  onSave,
}: EditDraftNameModalProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (draft) {
      setName(draft.name);
    }
  }, [draft]);

  if (!isOpen || !draft) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(draft.id, name.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Editar nombre del borrador
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del borrador"
          autoFocus
        />

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

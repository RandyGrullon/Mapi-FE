interface ResponseActionsProps {
  onAccept: () => void;
  onReject: () => void;
}

export const ResponseActions = ({
  onAccept,
  onReject,
}: ResponseActionsProps) => (
  <div className="flex gap-3 pt-4">
    <button
      onClick={onReject}
      className="flex-1 px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Rechazar
    </button>
    <button
      onClick={onAccept}
      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
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
          d="M5 13l4 4L19 7"
        />
      </svg>
      Aceptar
    </button>
  </div>
);

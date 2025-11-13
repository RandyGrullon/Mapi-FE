import { CloseButton } from "./CloseButton";

interface ResponseHeaderProps {
  onClose: () => void;
}

export const ResponseHeader = ({ onClose }: ResponseHeaderProps) => (
  <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <h3 className="text-xl font-bold text-white">Solicitud de Unión</h3>
        </div>
        <p className="text-green-100 text-sm">
          Revisa y responde a esta solicitud
        </p>
      </div>
      <CloseButton onClick={onClose} />
    </div>
  </div>
);

import { CloseButton } from "./CloseButton";

interface RequestHeaderProps {
  onClose: () => void;
}

export const RequestHeader = ({ onClose }: RequestHeaderProps) => (
  <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="text-xl font-bold text-white">Solicitar Unirse</h3>
        </div>
        <p className="text-blue-100 text-sm">
          Completa el formulario para solicitar unirte a este viaje
        </p>
      </div>
      <CloseButton onClick={onClose} />
    </div>
  </div>
);

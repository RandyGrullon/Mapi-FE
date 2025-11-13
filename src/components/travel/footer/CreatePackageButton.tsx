import { LoadingSpinner } from "./LoadingSpinner";

interface CreatePackageButtonProps {
  isCreating: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const CreatePackageButton = ({
  isCreating,
  isDisabled,
  onClick,
}: CreatePackageButtonProps) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className="w-full md:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-900 shadow-sm hover:shadow whitespace-nowrap flex items-center justify-center gap-2"
  >
    {isCreating ? (
      <>
        <LoadingSpinner />
        Creando paquete...
      </>
    ) : (
      "Crear Paquete Personalizado"
    )}
  </button>
);

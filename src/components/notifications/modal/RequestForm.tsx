interface RequestFormProps {
  name: string;
  email: string;
  message: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const RequestForm = ({
  name,
  email,
  message,
  onNameChange,
  onEmailChange,
  onMessageChange,
  onSubmit,
  onCancel,
  isSubmitting,
}: RequestFormProps) => (
  <div className="p-6 space-y-4">
    {/* Formulario */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tu nombre completo <span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Ej: Juan Pérez"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email de contacto <span className="text-red-600">*</span>
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="ejemplo@email.com"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Mensaje para el organizador (opcional)
      </label>
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Cuéntale al organizador por qué quieres unirte..."
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
      />
    </div>

    {/* Info */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex gap-3">
        <svg
          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-blue-800">
          El organizador recibirá tu solicitud y podrá aprobarla o rechazarla.
          Te notificaremos su decisión.
        </p>
      </div>
    </div>

    {/* Botones */}
    <div className="flex gap-3 pt-2">
      <button
        onClick={onCancel}
        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        disabled={isSubmitting}
      >
        Cancelar
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitting || !name.trim() || !email.trim()}
        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          "Enviar Solicitud"
        )}
      </button>
    </div>
  </div>
);

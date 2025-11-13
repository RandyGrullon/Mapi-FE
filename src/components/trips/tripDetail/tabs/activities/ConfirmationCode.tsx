interface ConfirmationCodeProps {
  code: string;
}

export const ConfirmationCode = ({ code }: ConfirmationCodeProps) => (
  <div className="bg-gray-50 rounded-lg p-2 mb-4">
    <p className="text-xs text-gray-500">Código de confirmación</p>
    <p className="text-sm font-bold text-gray-900 truncate">{code}</p>
  </div>
);

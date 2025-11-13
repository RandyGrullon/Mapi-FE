interface RequestMessageProps {
  message: string;
}

export const RequestMessage = ({ message }: RequestMessageProps) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
      Mensaje
    </h4>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-gray-700 italic">&quot;{message}&quot;</p>
    </div>
  </div>
);

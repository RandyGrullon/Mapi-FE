interface ActivityIncludesProps {
  included: string[];
}

export const ActivityIncludes = ({ included }: ActivityIncludesProps) => (
  <div className="bg-gray-50 rounded-lg p-3 mb-4">
    <p className="text-xs text-gray-600 mb-2">Incluye:</p>
    <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
      {included.slice(0, 4).map((item, index) => (
        <span
          key={index}
          className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200 truncate max-w-24"
        >
          {item}
        </span>
      ))}
      {included.length > 4 && (
        <span className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200">
          +{included.length - 4}
        </span>
      )}
    </div>
  </div>
);

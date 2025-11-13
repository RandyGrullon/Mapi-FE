interface PanelHeaderProps {
  onClose: () => void;
  unreadCount: number;
  pendingRequestsCount: number;
  activeTab: "all" | "requests";
  onTabChange: (tab: "all" | "requests") => void;
}

export const PanelHeader = ({
  onClose,
  unreadCount,
  pendingRequestsCount,
  activeTab,
  onTabChange,
}: PanelHeaderProps) => (
  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-bold text-white">Notificaciones</h2>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-blue-500 transition-colors text-white"
      >
        <svg
          className="w-6 h-6"
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
      </button>
    </div>

    {/* Tabs */}
    <div className="flex gap-2">
      <button
        onClick={() => onTabChange("all")}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "all"
            ? "bg-white text-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-400"
        }`}
      >
        Todas {unreadCount > 0 && `(${unreadCount})`}
      </button>
      <button
        onClick={() => onTabChange("requests")}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
          activeTab === "requests"
            ? "bg-white text-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-400"
        }`}
      >
        Solicitudes
        {pendingRequestsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {pendingRequestsCount}
          </span>
        )}
      </button>
    </div>
  </div>
);

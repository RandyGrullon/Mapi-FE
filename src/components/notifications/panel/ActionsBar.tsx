interface ActionsBarProps {
  hasNotifications: boolean;
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const ActionsBar = ({
  hasNotifications,
  unreadCount,
  onMarkAllAsRead,
  onClearAll,
}: ActionsBarProps) => {
  if (!hasNotifications) return null;

  return (
    <div className="p-3 border-b border-gray-200 bg-gray-50 flex gap-2">
      {unreadCount > 0 && (
        <button
          onClick={onMarkAllAsRead}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Marcar todo como leído
        </button>
      )}
      <button
        onClick={onClearAll}
        className="text-sm text-gray-600 hover:text-gray-700 font-medium ml-auto"
      >
        Limpiar todo
      </button>
    </div>
  );
};

import { Notification } from "@/types/notification";
import { NotificationIcon } from "./NotificationIcon";
import { formatDate } from "./utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onRequestClick: (requestId: string) => void;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onRequestClick,
}: NotificationItemProps) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.type === "join_request" && notification.data?.requestId) {
      onRequestClick(notification.data.requestId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.read ? "bg-blue-50" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <NotificationIcon type={notification.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-semibold text-gray-900 text-sm">
              {notification.title}
            </p>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
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
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {formatDate(notification.createdAt)}
            </span>
            {!notification.read && (
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

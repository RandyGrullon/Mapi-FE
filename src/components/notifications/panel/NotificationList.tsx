import { Notification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";
import { EmptyState } from "./EmptyState";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onRequestClick: (requestId: string) => void;
}

export const NotificationList = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onRequestClick,
}: NotificationListProps) => {
  if (notifications.length === 0) {
    return <EmptyState type="notifications" />;
  }

  return (
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          onRequestClick={onRequestClick}
        />
      ))}
    </div>
  );
};

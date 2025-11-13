import { JoinRequest } from "@/types/notification";
import { RequestItem } from "./RequestItem";
import { EmptyState } from "./EmptyState";

interface RequestListProps {
  requests: JoinRequest[];
  onRequestClick: (requestId: string) => void;
}

export const RequestList = ({ requests, onRequestClick }: RequestListProps) => {
  if (requests.length === 0) {
    return <EmptyState type="requests" />;
  }

  return (
    <div className="divide-y divide-gray-200">
      {requests.map((request) => (
        <RequestItem
          key={request.id}
          request={request}
          onClick={onRequestClick}
        />
      ))}
    </div>
  );
};

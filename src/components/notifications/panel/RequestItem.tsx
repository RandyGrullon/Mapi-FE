import { JoinRequest } from "@/types/notification";
import { formatDate } from "./utils";

interface RequestItemProps {
  request: JoinRequest;
  onClick: (requestId: string) => void;
}

export const RequestItem = ({ request, onClick }: RequestItemProps) => (
  <div
    onClick={() => onClick(request.id)}
    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {request.requesterName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm mb-1">
          {request.requesterName}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Quiere unirse a{" "}
          <span className="font-medium">{request.tripName}</span>
        </p>
        {request.message && (
          <p className="text-sm text-gray-500 italic mb-2">
            &quot;{request.message}&quot;
          </p>
        )}
        <span className="text-xs text-gray-400">
          {formatDate(request.createdAt)}
        </span>
      </div>
    </div>
  </div>
);

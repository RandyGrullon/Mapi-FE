import { JoinRequest } from "@/types/notification";

interface RequesterInfoProps {
  request: JoinRequest;
}

export const RequesterInfo = ({ request }: RequesterInfoProps) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
      Solicitante
    </h4>
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
        {request.requesterName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-lg mb-1">
          {request.requesterName}
        </p>
        <p className="text-gray-600 text-sm flex items-center gap-2">
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {request.requesterEmail}
        </p>
      </div>
    </div>
  </div>
);

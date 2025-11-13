interface EmptyStateProps {
  type: "notifications" | "requests";
}

export const EmptyState = ({ type }: EmptyStateProps) => {
  const content =
    type === "notifications"
      ? {
          icon: (
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          ),
          title: "No hay notificaciones",
          description: "Te notificaremos cuando algo suceda",
        }
      : {
          icon: (
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 4 0 014 0z"
              />
            </svg>
          ),
          title: "No hay solicitudes pendientes",
          description: "Las solicitudes para unirse aparecerán aquí",
        };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {content.icon}
      </div>
      <p className="text-gray-500 font-medium">{content.title}</p>
      <p className="text-gray-400 text-sm mt-1">{content.description}</p>
    </div>
  );
};

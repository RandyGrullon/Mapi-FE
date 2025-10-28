"use client";

interface SidebarHeaderProps {
  onNewWizard: () => void;
  isCollapsed: boolean;
}

export const SidebarHeader = ({
  onNewWizard,
  isCollapsed,
}: SidebarHeaderProps) => {
  return (
    <>
      <h2
        className={`text-xl font-bold mb-6 flex ${
          isCollapsed ? "justify-center" : ""
        } items-center gap-2`}
      >
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-white font-bold text-xs">M</span>
        </div>
        {!isCollapsed && <span>Planifica Tu Viaje</span>}
      </h2>

      <button
        onClick={onNewWizard}
        className={`w-full flex items-center justify-center gap-2 py-3 ${
          isCollapsed ? "px-2" : "px-4"
        } rounded-xl bg-black text-white hover:bg-black/90 transition-all duration-200 mb-6`}
        title="Nuevo Viaje"
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {!isCollapsed && <span>Nuevo Viaje</span>}
      </button>
    </>
  );
};

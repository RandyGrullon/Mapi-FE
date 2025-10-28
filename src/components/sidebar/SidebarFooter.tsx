"use client";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  return (
    <div className="flex-shrink-0 mt-auto border-t border-gray-200 pt-4">
      <a
        href="/profile"
        className={`flex ${
          isCollapsed ? "justify-center" : "items-center gap-3 p-2"
        } rounded-lg hover:bg-gray-100 transition-all duration-200`}
        title={isCollapsed ? "Viajero - usuario@email.com" : ""}
      >
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
          U
        </div>
        {!isCollapsed && (
          <div>
            <p className="font-medium">Viajero</p>
            <p className="text-xs text-gray-500">usuario@email.com</p>
          </div>
        )}
      </a>
    </div>
  );
};

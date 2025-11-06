"use client";

import { useAuth } from "../auth/AuthContext";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await authService.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  // Obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // Obtener el nombre del usuario (por ahora usar el email)
  const getUserName = () => {
    if (!user?.email) return "Viajero";
    return user.user_metadata?.full_name || user.email.split("@")[0];
  };

  return (
    <div className="flex-shrink-0 mt-auto border-t border-gray-200 pt-4">
      <div
        className={`flex ${
          isCollapsed ? "flex-col gap-2" : "items-center gap-3"
        }`}
      >
        <a
          href="/profile"
          className={`flex ${
            isCollapsed ? "justify-center" : "items-center gap-3 p-2 flex-1"
          } rounded-lg hover:bg-gray-100 transition-all duration-200`}
          title={isCollapsed ? `${getUserName()} - ${user?.email}` : ""}
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
            {getUserInitials()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{getUserName()}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </a>

        {!isCollapsed && (
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
            title="Cerrar sesión"
          >
            {isLoggingOut ? (
              <svg
                className="w-5 h-5 text-gray-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            )}
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group mx-auto"
            title="Cerrar sesión"
          >
            {isLoggingOut ? (
              <svg
                className="w-5 h-5 text-gray-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

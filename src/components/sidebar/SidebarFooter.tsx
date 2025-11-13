"use client";

import { useAuth } from "../auth/AuthContext";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { LogoutButton } from "./LogoutButton";
import { getUserInitials, getUserDisplayName } from "./userUtils";

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

  const userInitials = getUserInitials(user);
  const userName = getUserDisplayName(user);

  return (
    <div className="flex-shrink-0 mt-auto border-t border-gray-200 pt-4">
      <div
        className={`flex ${
          isCollapsed ? "flex-col gap-2" : "items-center gap-3"
        }`}
      >
        <UserAvatar
          initials={userInitials}
          name={userName}
          email={user?.email}
          isCollapsed={isCollapsed}
        />

        <div className={isCollapsed ? "mx-auto" : ""}>
          <LogoutButton onLogout={handleSignOut} isLoading={isLoggingOut} />
        </div>
      </div>
    </div>
  );
};

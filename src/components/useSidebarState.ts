"use client";

import { useState } from "react";

export const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleCollapsed = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return {
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
  };
};

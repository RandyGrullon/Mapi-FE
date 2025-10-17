"use client";

import { NavigationProvider } from "@/components/NavigationContext";
import { WizardProvider } from "@/components/WizardProvider";
import { SidebarProvider } from "@/components/SidebarContext";
import { Sidebar } from "@/components/Sidebar";
import DraftsPage from "./DraftsPage";

const DraftsLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <DraftsPage />
    </div>
  );
};

export default function Drafts() {
  return (
    <NavigationProvider>
      <WizardProvider>
        <SidebarProvider>
          <DraftsLayout />
        </SidebarProvider>
      </WizardProvider>
    </NavigationProvider>
  );
}

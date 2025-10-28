"use client";

import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { WizardProvider } from "@/components/wizard/WizardProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { Sidebar } from "@/components/sidebar/Sidebar";
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

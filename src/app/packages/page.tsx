"use client";

import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { WizardProvider } from "@/components/wizard/WizardProvider";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TravelPackagesPage } from "@/components/travel/TravelPackagesPage";
import { useNavigation } from "@/components/navigation/NavigationContext";
import { TravelInfo } from "@/components/wizard/WizardProvider";

const PackagesPageLayout = () => {
  const { travelInfo: navTravelInfo } = useNavigation();

  // Use navTravelInfo if available, otherwise use demo data
  const displayTravelInfo = navTravelInfo || {
    origin: "Madrid",
    destination: "Barcelona",
    startDate: "2025-11-15",
    endDate: "2025-11-20",
    travelers: 2,
    flightPreference: "Económico (más barato)",
    accommodationType: "Hotel confort (4 estrellas)",
    activities: ["Cultura e historia", "Gastronomía y restaurantes"],
    budget: "Moderado ($1,000 - $3,000 USD)",
    organizedActivities: false,
    duration: "5",
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TravelPackagesPage travelInfo={displayTravelInfo} />
      </div>
    </div>
  );
};

export default function PackagesPage() {
  return (
    <NavigationProvider>
      <WizardProvider>
        <SidebarProvider>
          <PackagesPageLayout />
        </SidebarProvider>
      </WizardProvider>
    </NavigationProvider>
  );
}

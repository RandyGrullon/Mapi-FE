"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavigationProvider } from "@/components/navigation/NavigationContext";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TravelPackage } from "@/components/data/travel-data";
import { PackageDetailsView } from "@/components/views/PackageDetailsView";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar el paquete del localStorage o estado
    const savedPackage = localStorage.getItem(`package-${params.id}`);

    if (savedPackage) {
      setPackageData(JSON.parse(savedPackage));
    } else {
      // Si no hay paquete guardado, redirigir a packages
      router.push("/packages");
    }

    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del paquete...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Paquete no encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            No pudimos encontrar el paquete que buscas
          </p>
          <button
            onClick={() => router.push("/packages")}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Volver a Paquetes
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <NavigationProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <main className="flex-1 ml-0 ">
            <PackageDetailsView packageData={packageData} />
          </main>
        </div>
      </NavigationProvider>
    </SidebarProvider>
  );
}

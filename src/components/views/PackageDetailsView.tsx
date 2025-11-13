"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TravelPackage } from "@/types/travel";
import { tripService } from "@/services/trips";
import { supabaseClient } from "@/lib/supabase/client";
import { useDraftStore } from "@/stores/draftStore";
import { useWizardStore } from "@/stores/wizardStore";

interface PackageDetailsViewProps {
  packageData: TravelPackage;
}

export const PackageDetailsView = ({
  packageData,
}: PackageDetailsViewProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "flight" | "hotel" | "car" | "activities"
  >("overview");
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  // Draft store para eliminar el draft cuando se reserva
  const { currentDraftId, deleteDraft, clearCurrentDraft } = useDraftStore();
  const { resetWizard } = useWizardStore();

  const handleReserve = async () => {
    try {
      setIsCreatingTrip(true);

      // Obtener información del viaje del sessionStorage
      const travelInfoStr = sessionStorage.getItem("travelInfo");
      const travelInfo = travelInfoStr ? JSON.parse(travelInfoStr) : {};

      // Crear el nombre del viaje basado en el destino
      const tripName = `Viaje a ${packageData.flight.arrival}`;

      // Crear descripción con los detalles del paquete
      const tripDescription =
        `${packageData.description}\n\n` +
        `✈️ Vuelo: ${packageData.flight.airline} ${packageData.flight.flightNumber}\n` +
        `🏨 Hotel: ${packageData.hotel.name} (${packageData.hotel.stars}⭐)\n` +
        (packageData.carRental
          ? `🚗 Auto: ${packageData.carRental.carModel}\n`
          : "") +
        `🎯 ${packageData.activities.length} actividades incluidas\n` +
        `💰 Precio total: $${packageData.totalPrice}`;

      // Obtener usuario actual
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        alert("Debes iniciar sesión para crear un viaje");
        router.push("/login");
        return;
      }

      // Crear el viaje en la base de datos
      const newTrip = (await tripService.createTrip({
        user_id: session.user.id,
        name: tripName,
        description: tripDescription,
        start_date:
          travelInfo.startDate || new Date().toISOString().split("T")[0],
        end_date:
          travelInfo.endDate ||
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        status: "planned",
      })) as {
        id: string;
        name: string;
        description: string | null;
        start_date: string | null;
        end_date: string | null;
      } | null;

      if (newTrip?.id) {
        console.log("✅ Viaje creado:", newTrip);

        // Guardar el paquete completo en localStorage para acceder desde la página del viaje
        localStorage.setItem(
          `trip-package-${newTrip.id}`,
          JSON.stringify(packageData)
        );

        // Eliminar el draft actual ya que se creó el viaje
        if (currentDraftId) {
          console.log(
            "🗑️ Eliminando draft al reservar paquete:",
            currentDraftId
          );
          deleteDraft(currentDraftId);
          clearCurrentDraft();
        }

        // Resetear el wizard para la próxima vez
        resetWizard();

        // Redirigir a la página del viaje
        router.push(`/trip/${newTrip.id}`);
      } else {
        console.error("❌ Error al crear el viaje");
        alert("Hubo un error al crear el viaje. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      console.error("❌ Error en handleReserve:", error);
      alert("Hubo un error al crear el viaje. Por favor, intenta de nuevo.");
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const tabs = [
    { id: "overview" as const, label: "Resumen", icon: "📋" },
    { id: "flight" as const, label: "Vuelo", icon: "✈️" },
    { id: "hotel" as const, label: "Hotel", icon: "🏨" },
    ...(packageData.carRental
      ? [{ id: "car" as const, label: "Auto", icon: "🚗" }]
      : []),
    { id: "activities" as const, label: "Actividades", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <button
            onClick={() => router.push("/packages")}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a Paquetes
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              {packageData.recommended && (
                <span className="inline-block px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                  ✨ Recomendado
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                {packageData.name}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                {packageData.description}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/20 md:min-w-[280px] lg:min-w-[300px] flex-shrink-0">
              <p className="text-xs sm:text-sm text-gray-300 mb-2">
                Precio total del paquete
              </p>
              <p className="text-3xl sm:text-4xl font-bold mb-2">
                ${packageData.totalPrice.toLocaleString()}
              </p>
              {packageData.savings > 0 && (
                <p className="text-green-400 font-semibold mb-4 text-sm sm:text-base">
                  ✓ Ahorras ${packageData.savings}
                </p>
              )}
              <button
                onClick={handleReserve}
                disabled={isCreatingTrip}
                className="w-full py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingTrip ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Creando viaje...
                  </>
                ) : (
                  "Reservar Ahora"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-5 lg:px-6 py-3 md:py-4 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === "overview" && <OverviewTab packageData={packageData} />}
        {activeTab === "flight" && <FlightTab flight={packageData.flight} />}
        {activeTab === "hotel" && <HotelTab hotel={packageData.hotel} />}
        {activeTab === "car" && packageData.carRental && (
          <CarTab car={packageData.carRental} />
        )}
        {activeTab === "activities" && (
          <ActivitiesTab activities={packageData.activities} />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ packageData }: { packageData: TravelPackage }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 lg:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Resumen del Paquete
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* Vuelo */}
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✈️</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-base">Vuelo</h3>
                <p className="text-sm text-gray-600 truncate">
                  {packageData.flight.airline}
                </p>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Número de vuelo:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {packageData.flight.flightNumber}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Salida:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {packageData.flight.departure}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Llegada:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {packageData.flight.arrival}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Duración:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {packageData.flight.duration}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Precio:</span>
                <span className="font-bold text-green-600">
                  ${packageData.flight.price}
                </span>
              </div>
            </div>
          </div>

          {/* Hotel */}
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏨</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-base">Hotel</h3>
                <p className="text-sm text-gray-600">
                  {"⭐".repeat(packageData.hotel.stars)}
                </p>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-semibold text-gray-900 text-right truncate">
                  {packageData.hotel.name}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-semibold text-gray-900 text-right truncate">
                  {packageData.hotel.location}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Rating:</span>
                <span className="font-semibold text-gray-900">
                  {packageData.hotel.rating}/5
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Por noche:</span>
                <span className="font-bold text-green-600">
                  ${packageData.hotel.pricePerNight}
                </span>
              </div>
            </div>
          </div>

          {/* Auto */}
          {packageData.carRental && (
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚗</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-base">
                    Auto de Renta
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {packageData.carRental.company}
                  </p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Modelo:</span>
                  <span className="font-semibold text-gray-900 text-right truncate">
                    {packageData.carRental.carModel}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {packageData.carRental.carType}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Días:</span>
                  <span className="font-semibold text-gray-900">
                    {packageData.carRental.totalDays}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-green-600">
                    ${packageData.carRental.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actividades */}
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Actividades
                </h3>
                <p className="text-sm text-gray-600">
                  {packageData.activities.length} incluidas
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {packageData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex justify-between gap-3 text-sm py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-600 truncate">
                    {activity.name}
                  </span>
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    ${activity.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de Precio */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl shadow-lg p-5 md:p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Desglose de Precio</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-700 text-base">
            <span className="text-gray-300">Vuelo</span>
            <span className="font-semibold">${packageData.flight.price}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700 text-base">
            <span className="text-gray-300">Hotel</span>
            <span className="font-semibold">
              ${packageData.hotel.pricePerNight * 5}
            </span>
          </div>
          {packageData.carRental && (
            <div className="flex justify-between py-2 border-b border-gray-700 text-base">
              <span className="text-gray-300">Auto de Renta</span>
              <span className="font-semibold">
                ${packageData.carRental.totalPrice}
              </span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-700 text-base">
            <span className="text-gray-300">Actividades</span>
            <span className="font-semibold">
              ${packageData.activities.reduce((sum, act) => sum + act.price, 0)}
            </span>
          </div>
          {packageData.savings > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-700 text-base">
              <span className="text-green-400 font-semibold">
                Descuento del paquete
              </span>
              <span className="text-green-400 font-semibold">
                -${packageData.savings}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-4 text-xl">
            <span className="font-bold">Total</span>
            <span className="font-bold">
              ${packageData.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Lo que incluye este paquete
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-gray-900 text-base">
                Cancelación Gratuita
              </p>
              <p className="text-sm text-gray-600">
                {packageData.benefits?.cancellation ||
                  "Hasta 48 horas antes del viaje"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-gray-900 text-base">
                Pago en Cuotas
              </p>
              <p className="text-sm text-gray-600">
                {packageData.benefits?.payment || "Sin interés hasta 12 meses"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-gray-900 text-base">
                Soporte 24/7
              </p>
              <p className="text-sm text-gray-600">
                {packageData.benefits?.support || "Durante todo tu viaje"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-gray-900 text-base">
                Mejor Precio Garantizado
              </p>
              <p className="text-sm text-gray-600">
                Reembolsamos la diferencia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Flight Tab Component
const FlightTab = ({ flight }: { flight: TravelPackage["flight"] }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl">✈️</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Detalles del Vuelo
            </h2>
            <p className="text-sm sm:text-base text-gray-600 truncate">
              {flight.airline}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Aerolínea
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {flight.airline}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Número de Vuelo
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {flight.flightNumber}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Clase
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {flight.class}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Precio
              </label>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                ${flight.price}
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Salida
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {flight.departure}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Llegada
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {flight.arrival}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Duración
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {flight.duration}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Escalas
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {flight.stops === 0
                  ? "Vuelo Directo"
                  : `${flight.stops} escala${flight.stops > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
            Incluido en tu vuelo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                Equipaje de mano
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                1 maleta facturada
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                Selección de asiento
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hotel Tab Component
const HotelTab = ({ hotel }: { hotel: TravelPackage["hotel"] }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl">🏨</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {hotel.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-sm sm:text-base">
                {"⭐".repeat(hotel.stars)}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                {hotel.rating}/5 ({hotel.reviews} reseñas)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Ubicación
              </label>
              <p className="text-base sm:text-lg text-gray-900 mt-1">
                {hotel.location}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Rating
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        star <= hotel.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {hotel.rating}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Precio por noche
              </label>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                ${hotel.pricePerNight}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 sm:mb-3 block">
              Servicios del Hotel
            </label>
            <div className="space-y-2">
              {hotel.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-purple-50 rounded-lg"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-900 font-medium text-sm sm:text-base">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
            Información Importante
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-base sm:text-lg">📅</span>
              <p>
                <strong>Check-in:</strong> A partir de las 15:00
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-base sm:text-lg">📅</span>
              <p>
                <strong>Check-out:</strong> Hasta las 12:00
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-base sm:text-lg">🚭</span>
              <p>
                <strong>Política:</strong> Habitaciones para no fumadores
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-base sm:text-lg">🐕</span>
              <p>
                <strong>Mascotas:</strong> No permitidas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Car Tab Component
const CarTab = ({ car }: { car: NonNullable<TravelPackage["carRental"]> }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl">🚗</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {car.carModel}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {car.company} • ⭐ {car.rating}/5
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Tipo de Auto
              </label>
              <p className="text-base sm:text-lg text-gray-900 mt-1 capitalize">
                {car.carType}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Transmisión
              </label>
              <p className="text-base sm:text-lg text-gray-900 mt-1 capitalize">
                {car.transmission === "automatic" ? "Automática" : "Manual"}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Capacidad
              </label>
              <p className="text-base sm:text-lg text-gray-900 mt-1">
                {car.seats} pasajeros
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Precio por día
              </label>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                ${car.pricePerDay}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total de días
              </label>
              <p className="text-base sm:text-lg text-gray-900 mt-1">
                {car.totalDays} días
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Precio Total
              </label>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                ${car.totalPrice}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
            Características del Vehículo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {car.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 rounded-lg"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Información de Renta
          </h4>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
            <li>
              • Combustible: Política de tanque lleno (devolver con tanque
              lleno)
            </li>
            <li>• Kilometraje: Ilimitado dentro del país</li>
            <li>• Conductor adicional: Disponible por $10/día</li>
            <li>• Seguro básico incluido en el precio</li>
            <li>• Edad mínima del conductor: 21 años</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Activities Tab Component
const ActivitiesTab = ({
  activities,
}: {
  activities: TravelPackage["activities"];
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Actividades Incluidas ({activities.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-orange-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    {activity.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {activity.category}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg flex-shrink-0">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {activity.rating}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <strong>Duración:</strong> {activity.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <strong>Precio:</strong> ${activity.price}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 sm:pt-4">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                  Incluye:
                </p>
                <ul className="space-y-1">
                  {activity.included.map((item, index) => (
                    <li
                      key={index}
                      className="text-xs sm:text-sm text-gray-600 flex items-start gap-2"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-orange-200">
        <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
          <span className="text-xl sm:text-2xl">💡</span>
          Nota Importante
        </h3>
        <p className="text-xs sm:text-sm text-gray-700">
          Todas las actividades están sujetas a disponibilidad. Te recomendamos
          confirmar las reservas con al menos 48 horas de anticipación. Algunas
          actividades pueden requerir nivel físico moderado o restricciones de
          edad.
        </p>
      </div>
    </div>
  );
};

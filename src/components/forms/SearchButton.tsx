"use client";

import { useState } from "react";
import { TravelInfo } from "../wizard/WizardProvider";
import { useNavigation } from "../navigation/NavigationContext";
import { useDraftStore } from "@/stores/draftStore";
import { useWizardStore } from "@/stores/wizardStore";
import { geminiService } from "@/services/gemini";

interface SearchButtonProps {
  travelInfo: TravelInfo;
}

export const SearchButton = ({ travelInfo }: SearchButtonProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<string>("");
  const { navigateToPackages } = useNavigation();
  const { currentDraftId, deleteDraft, clearCurrentDraft } = useDraftStore();
  const { selectedServices, resetWizard } = useWizardStore(); // Obtener selectedServices

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      // Etapa 1: Preparando búsqueda
      setSearchStage("Preparando búsqueda...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Etapa 2: Consultando Gemini AI
      setSearchStage("🤖 Consultando inteligencia artificial...");

      // Preparar parámetros para Gemini
      const searchParams = {
        origin: travelInfo.origin,
        destination: travelInfo.destination,
        startDate: travelInfo.startDate,
        endDate: travelInfo.endDate,
        travelers: Number(travelInfo.travelers) || 1,
        flightPreference: travelInfo.flightPreference,
        accommodationType: travelInfo.accommodationType,
        activities: Array.isArray(travelInfo.activities)
          ? travelInfo.activities
          : travelInfo.activities
          ? [travelInfo.activities]
          : [],
        budget: travelInfo.budget,
        selectedServices: selectedServices, // Pasar los servicios seleccionados
      };

      console.log("🔍 Iniciando búsqueda con Gemini AI:", searchParams);

      // Llamar a Gemini AI
      const searchResults = await geminiService.searchTravelOptions(
        searchParams
      );

      console.log("✅ Resultados obtenidos de Gemini:", searchResults);

      // Etapa 3: Procesando resultados
      setSearchStage("✨ Procesando las mejores opciones...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Guardar los resultados en sessionStorage
      sessionStorage.setItem(
        "geminiSearchResults",
        JSON.stringify(searchResults)
      );
      sessionStorage.setItem("travelInfo", JSON.stringify(travelInfo));

      // Etapa 4: Finalizando
      setSearchStage("✓ ¡Listo! Redirigiendo...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Eliminar el draft actual ya que el usuario va a crear un viaje
      if (currentDraftId) {
        deleteDraft(currentDraftId);
        clearCurrentDraft();
      }

      // Navegar a la página de paquetes con los resultados
      navigateToPackages(travelInfo);
    } catch (error) {
      console.error("❌ Error en la búsqueda:", error);

      // Mostrar error al usuario
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudieron obtener opciones de viaje. Por favor, intenta de nuevo.";

      setSearchStage(`❌ ${errorMessage}`);

      // Esperar para que el usuario vea el error
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // NO navegar, mantener al usuario en el wizard para que pueda intentar de nuevo
    } finally {
      setIsSearching(false);
      setSearchStage("");
    }
  };
  return (
    <div className="my-8 animate-fade-in">
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="text-center max-w-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Tu perfil de viaje está completo! 🎉
          </h3>
          <p className="text-gray-600 text-sm">
            Ahora buscaremos las mejores opciones de vuelos, hoteles y
            actividades basadas en tus preferencias. Esto puede tomar unos
            segundos.
          </p>
        </div>

        <button
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-semibold">
                {searchStage || "Buscando opciones..."}
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-lg font-semibold">
                Buscar Opciones de Viaje
              </span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center max-w-md">
          💡 Tip: Si deseas cambiar alguna respuesta, usa las flechas de
          navegación para volver atrás.
        </p>
      </div>
    </div>
  );
};

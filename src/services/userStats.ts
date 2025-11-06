import { supabaseClient } from "@/lib/supabase/index";
import type { Database } from "@/lib/supabase/types";

type Trip = Database["public"]["Tables"]["trips"]["Row"];
type BudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];

export interface UserStats {
  totalTrips: number;
  countriesVisited: number;
  upcomingTrips: number;
  completedTrips: number;
  savedAmount: number;
}

export interface TripHistory {
  id: string;
  destination: string;
  date: string;
  status: "completed" | "upcoming" | "cancelled";
  image: string;
  duration: string;
  price: number;
}

export const userStatsService = {
  /**
   * Obtiene las estadísticas del usuario actual
   */
  async getUserStats(userId: string): Promise<UserStats> {
    if (!userId) {
      console.warn("getUserStats called without userId");
      return {
        totalTrips: 0,
        countriesVisited: 0,
        upcomingTrips: 0,
        completedTrips: 0,
        savedAmount: 0,
      };
    }

    try {
      // Verificar sesión activa
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        console.warn("No active session in getUserStats");
        return {
          totalTrips: 0,
          countriesVisited: 0,
          upcomingTrips: 0,
          completedTrips: 0,
          savedAmount: 0,
        };
      }

      // Obtener todos los viajes del usuario
      const { data: trips, error } = await supabaseClient
        .from("trips")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.warn("Error fetching trips in getUserStats:", error.message);
        return {
          totalTrips: 0,
          countriesVisited: 0,
          upcomingTrips: 0,
          completedTrips: 0,
          savedAmount: 0,
        };
      }

      const allTrips: Trip[] = (trips as Trip[]) || [];
      const now = new Date();

      // Calcular estadísticas
      const totalTrips = allTrips.length;

      const upcomingTrips = allTrips.filter((trip) => {
        const startDate = trip.start_date ? new Date(trip.start_date) : null;
        return startDate && startDate > now && trip.status !== "cancelled";
      }).length;

      const completedTrips = allTrips.filter((trip) => {
        const endDate = trip.end_date ? new Date(trip.end_date) : null;
        return endDate && endDate < now && trip.status !== "cancelled";
      }).length;

      // Por ahora, estimar países basado en el número de viajes únicos
      // En el futuro, esto debería extraerse de un campo 'destination' o 'country'
      const countriesVisited = Math.min(
        totalTrips,
        Math.ceil(totalTrips * 0.7)
      );

      // Calcular monto total de los presupuestos
      const tripIds = allTrips.map((t) => t.id);
      let totalBudget = 0;

      if (tripIds.length > 0) {
        const { data: budgets, error: budgetError } = await supabaseClient
          .from("budget_items")
          .select("amount")
          .in("trip_id", tripIds);

        if (budgetError) {
          console.warn("Error fetching budgets:", budgetError.message);
        } else {
          const allBudgets: BudgetItem[] = (budgets as BudgetItem[]) || [];
          totalBudget = allBudgets.reduce(
            (sum, item) => sum + (item.amount || 0),
            0
          );
        }
      }

      // Simular ahorro (30% del presupuesto total)
      const savedAmount = Math.round(totalBudget * 0.3);

      return {
        totalTrips,
        countriesVisited,
        upcomingTrips,
        completedTrips,
        savedAmount,
      };
    } catch (error) {
      console.warn("Error getting user stats:", error);
      return {
        totalTrips: 0,
        countriesVisited: 0,
        upcomingTrips: 0,
        completedTrips: 0,
        savedAmount: 0,
      };
    }
  },

  /**
   * Obtiene el historial de viajes del usuario
   */
  async getTripHistory(userId: string): Promise<TripHistory[]> {
    if (!userId) {
      console.warn("getTripHistory called without userId");
      return [];
    }

    try {
      // Verificar sesión activa
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        console.warn("No active session in getTripHistory");
        return [];
      }

      const { data: trips, error } = await supabaseClient
        .from("trips")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });

      if (error) {
        console.warn("Error fetching trip history:", error.message);
        return []; // Retornar array vacío en lugar de lanzar error
      }

      const allTrips: Trip[] = (trips as Trip[]) || [];
      const now = new Date();

      return allTrips.map((trip) => {
        const startDate = trip.start_date ? new Date(trip.start_date) : null;
        const endDate = trip.end_date ? new Date(trip.end_date) : null;

        let status: "completed" | "upcoming" | "cancelled" = "upcoming";
        if (trip.status === "cancelled") {
          status = "cancelled";
        } else if (endDate && endDate < now) {
          status = "completed";
        }

        // Calcular duración
        let duration = "N/A";
        if (startDate && endDate) {
          const days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          duration = `${days} ${days === 1 ? "día" : "días"}`;
        }

        // Formato de fecha
        const date = startDate
          ? startDate.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Fecha no especificada";

        return {
          id: trip.id,
          destination: trip.name || "Destino desconocido", // Usar name como destination por ahora
          date,
          status,
          image: "", // TODO: Agregar imágenes cuando estén disponibles
          duration,
          price: 0, // Por ahora 0, luego calcularlo desde budget_items
        };
      });
    } catch (error) {
      console.warn("Error getting trip history:", error);
      return []; // Siempre retornar array vacío en lugar de lanzar
    }
  },

  /**
   * Obtiene el precio total de un viaje basado en sus budget_items
   */
  async getTripPrice(tripId: string): Promise<number> {
    try {
      const { data: budgets } = await supabaseClient
        .from("budget_items")
        .select("amount")
        .eq("trip_id", tripId);

      const allBudgets: BudgetItem[] = (budgets as BudgetItem[]) || [];
      return allBudgets.reduce((sum, item) => sum + (item.amount || 0), 0);
    } catch (error) {
      console.warn("Error getting trip price:", error);
      return 0;
    }
  },
};

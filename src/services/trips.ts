import { supabaseClient } from "@/lib/supabase/index";
import { type PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];
type Trip = Tables["trips"]["Row"];
type NewTrip = Tables["trips"]["Insert"];
type UpdateTrip = Tables["trips"]["Update"];

interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export const tripService = {
  async getTrips() {
    try {
      // Verificar que hay una sesión activa
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        console.warn("No active session found");
        return [];
      }

      const { data, error } = await supabaseClient
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Error fetching trips:", error.message);
        return []; // Retornar array vacío en lugar de lanzar error
      }

      return data as Trip[];
    } catch (error) {
      console.warn("Error in getTrips:", error);
      return []; // Retornar array vacío en lugar de lanzar error
    }
  },

  async getTrip(id: string) {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        console.warn("No active session in getTrip");
        return null;
      }

      const { data, error } = await supabaseClient
        .from("trips")
        .select(
          `
          *,
          trip_members (
            *,
            users (*)
          ),
          activities (*),
          accommodations (*),
          transportation (*),
          budget_items (*)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.warn("Error fetching trip:", error.message);
        return null; // Retornar null en lugar de lanzar error
      }

      return data as Trip & {
        trip_members: Array<
          Database["public"]["Tables"]["trip_members"]["Row"] & {
            users: Database["public"]["Tables"]["users"]["Row"];
          }
        >;
        activities: Array<Database["public"]["Tables"]["activities"]["Row"]>;
        accommodations: Array<
          Database["public"]["Tables"]["accommodations"]["Row"]
        >;
        transportation: Array<
          Database["public"]["Tables"]["transportation"]["Row"]
        >;
        budget_items: Array<
          Database["public"]["Tables"]["budget_items"]["Row"]
        >;
      };
    } catch (error) {
      console.warn("Error in getTrip:", error);
      return null; // Retornar null en lugar de lanzar error
    }
  },

  async createTrip(trip: NewTrip) {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        console.warn("No active session for creating trip");
        return null;
      }

      const { data, error } = await supabaseClient
        .from("trips")
        .insert(trip as any)
        .select()
        .single();

      if (error) {
        console.warn("Error creating trip:", error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.warn("Error in createTrip:", error);
      return null;
    }
  },

  async updateTrip(id: string, trip: UpdateTrip) {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        console.warn("No active session for updating trip");
        return null;
      }

      const { data, error } = await supabaseClient
        .from("trips")
        // @ts-ignore - Supabase SSR type inference issue with update
        .update(trip)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.warn("Error updating trip:", error.message);
        return null;
      }

      return data as Trip;
    } catch (error) {
      console.warn("Error in updateTrip:", error);
      return null;
    }
  },

  async deleteTrip(id: string) {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        console.warn("No active session for deleting trip");
        return false;
      }

      const { error } = await supabaseClient
        .from("trips")
        .delete()
        .eq("id", id);

      if (error) {
        console.warn("Error deleting trip:", error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.warn("Error in deleteTrip:", error);
      return false;
    }
  },

  subscribeToTrip(id: string, callback: (payload: any) => void) {
    return supabaseClient
      .channel(`trip:${id}`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "trips",
          filter: `id=eq.${id}`,
        },
        callback
      )
      .subscribe();
  },
};

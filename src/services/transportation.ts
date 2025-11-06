import { supabaseClient } from "@/lib/supabase/index";
import type { Database } from "@/lib/supabase/types";

type Transportation = Database["public"]["Tables"]["transportation"]["Row"];
type NewTransportation =
  Database["public"]["Tables"]["transportation"]["Insert"];
type UpdateTransportation =
  Database["public"]["Tables"]["transportation"]["Update"];

export const transportationService = {
  async getTransportations(tripId: string) {
    const { data, error } = await supabaseClient
      .from("transportation")
      .select("*")
      .eq("trip_id", tripId)
      .order("departure_time", { ascending: true });

    if (error) throw error;
    return data as Transportation[];
  },

  async getTransportation(id: string) {
    const { data, error } = await supabaseClient
      .from("transportation")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Transportation;
  },

  async createTransportation(transportation: NewTransportation) {
    const { data, error } = await supabaseClient
      .from("transportation")
      .insert([transportation] as any)
      .select()
      .single();

    if (error) throw error;
    return data as Transportation;
  },

  async updateTransportation(id: string, transportation: UpdateTransportation) {
    const { data, error } = await supabaseClient
      .from("transportation")
      // @ts-ignore - Supabase SSR type inference issue with update
      .update(transportation)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Transportation;
  },

  async deleteTransportation(id: string) {
    const { error } = await supabaseClient
      .from("transportation")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async bulkCreateTransportation(transportations: NewTransportation[]) {
    const { data, error } = await supabaseClient
      .from("transportation")
      .insert(transportations as any)
      .select();

    if (error) throw error;
    return data as Transportation[];
  },

  subscribeToTripTransportation(
    tripId: string,
    callback: (payload: any) => void
  ) {
    return supabaseClient
      .channel(`trip:${tripId}:transportation`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "transportation",
          filter: `trip_id=eq.${tripId}`,
        },
        callback
      )
      .subscribe();
  },

  // Métodos específicos para tipos de transporte
  async getFlights(tripId: string) {
    const { data, error } = await supabaseClient
      .from("transportation")
      .select("*")
      .eq("trip_id", tripId)
      .eq("type", "flight")
      .order("departure_time", { ascending: true });

    if (error) throw error;
    return data as Transportation[];
  },

  async getCarRentals(tripId: string) {
    const { data, error } = await supabaseClient
      .from("transportation")
      .select("*")
      .eq("trip_id", tripId)
      .eq("type", "car")
      .order("departure_time", { ascending: true });

    if (error) throw error;
    return data as Transportation[];
  },
};

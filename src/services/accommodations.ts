import { supabaseClient } from "@/lib/supabase/index";
import type { Database } from "@/lib/supabase/types";

type Accommodation = Database["public"]["Tables"]["accommodations"]["Row"];
type NewAccommodation =
  Database["public"]["Tables"]["accommodations"]["Insert"];
type UpdateAccommodation =
  Database["public"]["Tables"]["accommodations"]["Update"];

export const accommodationService = {
  async getAccommodations(tripId: string) {
    const { data, error } = await supabaseClient
      .from("accommodations")
      .select("*")
      .eq("trip_id", tripId)
      .order("check_in", { ascending: true });

    if (error) throw error;
    return data as Accommodation[];
  },

  async getAccommodation(id: string) {
    const { data, error } = await supabaseClient
      .from("accommodations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Accommodation;
  },

  async createAccommodation(accommodation: NewAccommodation) {
    const { data, error } = await supabaseClient
      .from("accommodations")
      .insert([accommodation] as any)
      .select()
      .single();

    if (error) throw error;
    return data as Accommodation;
  },

  async updateAccommodation(id: string, accommodation: UpdateAccommodation) {
    const { data, error } = await supabaseClient
      .from("accommodations")
      // @ts-ignore - Supabase SSR type inference issue with update
      .update(accommodation)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Accommodation;
  },

  async deleteAccommodation(id: string) {
    const { error } = await supabaseClient
      .from("accommodations")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  subscribeToTripAccommodations(
    tripId: string,
    callback: (payload: any) => void
  ) {
    return supabaseClient
      .channel(`trip:${tripId}:accommodations`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "accommodations",
          filter: `trip_id=eq.${tripId}`,
        },
        callback
      )
      .subscribe();
  },
};

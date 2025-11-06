import { supabaseClient } from "@/lib/supabase/index";
import type { Database } from "@/lib/supabase/types";

type Activity = Database["public"]["Tables"]["activities"]["Row"];
type NewActivity = Database["public"]["Tables"]["activities"]["Insert"];
type UpdateActivity = Database["public"]["Tables"]["activities"]["Update"];

export const activityService = {
  async getActivities(tripId: string) {
    const { data, error } = await supabaseClient
      .from("activities")
      .select("*")
      .eq("trip_id", tripId)
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data as Activity[];
  },

  async getActivity(id: string) {
    const { data, error } = await supabaseClient
      .from("activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Activity;
  },

  async createActivity(activity: NewActivity) {
    const { data, error } = await supabaseClient
      .from("activities")
      .insert([activity] as any)
      .select()
      .single();

    if (error) throw error;
    return data as Activity;
  },

  async updateActivity(id: string, activity: UpdateActivity) {
    const { data, error } = await supabaseClient
      .from("activities")
      // @ts-ignore - Supabase SSR type inference issue with update
      .update(activity)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Activity;
  },

  async deleteActivity(id: string) {
    const { error } = await supabaseClient
      .from("activities")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async bulkCreateActivities(activities: NewActivity[]) {
    const { data, error } = await supabaseClient
      .from("activities")
      .insert(activities as any)
      .select();

    if (error) throw error;
    return data as Activity[];
  },

  subscribeToTripActivities(tripId: string, callback: (payload: any) => void) {
    return supabaseClient
      .channel(`trip:${tripId}:activities`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `trip_id=eq.${tripId}`,
        },
        callback
      )
      .subscribe();
  },
};

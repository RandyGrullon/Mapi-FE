import { supabase } from "@/lib/supabase";
import { Draft } from "@/types/draft";

export interface DraftInsert {
  user_id: string;
  name: string;
  content: any;
  type: string;
}

export interface DraftUpdate {
  name?: string;
  content?: any;
  type?: string;
}

export const draftService = {
  /**
   * Get all drafts for a user
   */
  async getDrafts(userId: string): Promise<Draft[]> {
    try {
      const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching drafts:", error);
      throw error;
    }
  },

  /**
   * Get a single draft by ID
   */
  async getDraft(id: string): Promise<Draft | null> {
    try {
      const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Not found
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error fetching draft:", error);
      throw error;
    }
  },

  /**
   * Create a new draft
   */
  async createDraft(draft: DraftInsert): Promise<Draft> {
    try {
      const { data, error } = await supabase
        .from("drafts")
        // @ts-ignore
        .insert(draft)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating draft:", error);
      throw error;
    }
  },

  /**
   * Update an existing draft
   */
  async updateDraft(id: string, updates: DraftUpdate): Promise<Draft> {
    try {
      const { data, error } = await supabase
        .from("drafts")
        // @ts-ignore
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating draft:", error);
      throw error;
    }
  },

  /**
   * Delete a draft
   */
  async deleteDraft(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("drafts").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting draft:", error);
      throw error;
    }
  },

  /**
   * Subscribe to draft changes for a user
   */
  subscribeToDrafts(userId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(`drafts:user_id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drafts",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return subscription;
  },
};

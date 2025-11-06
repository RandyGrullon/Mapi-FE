import { supabaseClient } from "@/lib/supabase/index";
import type { Database } from "@/lib/supabase/types";

type BudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];
type NewBudgetItem = Database["public"]["Tables"]["budget_items"]["Insert"];
type UpdateBudgetItem = Database["public"]["Tables"]["budget_items"]["Update"];

export const budgetService = {
  async getBudgetItems(tripId: string) {
    const { data, error } = await supabaseClient
      .from("budget_items")
      .select("*, users(*)")
      .eq("trip_id", tripId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (BudgetItem & {
      users: Database["public"]["Tables"]["users"]["Row"] | null;
    })[];
  },

  async getBudgetItem(id: string) {
    const { data, error } = await supabaseClient
      .from("budget_items")
      .select("*, users(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as BudgetItem & {
      users: Database["public"]["Tables"]["users"]["Row"] | null;
    };
  },

  async createBudgetItem(budgetItem: NewBudgetItem) {
    const { data, error } = await supabaseClient
      .from("budget_items")
      .insert([budgetItem] as any)
      .select()
      .single();

    if (error) throw error;
    return data as BudgetItem;
  },

  async updateBudgetItem(id: string, budgetItem: UpdateBudgetItem) {
    const { data, error } = await supabaseClient
      .from("budget_items")
      // @ts-ignore - Supabase SSR type inference issue with update
      .update(budgetItem)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as BudgetItem;
  },

  async deleteBudgetItem(id: string) {
    const { error } = await supabaseClient
      .from("budget_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async bulkCreateBudgetItems(budgetItems: NewBudgetItem[]) {
    const { data, error } = await supabaseClient
      .from("budget_items")
      .insert(budgetItems as any)
      .select();

    if (error) throw error;
    return data as BudgetItem[];
  },

  // Análisis de presupuesto
  async getTripTotalBudget(tripId: string) {
    const { data, error } = await supabaseClient
      .from("budget_items")
      .select("amount")
      .eq("trip_id", tripId);

    if (error) throw error;
    return (data as BudgetItem[]).reduce(
      (total, item) => total + item.amount,
      0
    );
  },

  async getTripExpensesByCategory(tripId: string) {
    const { data, error } = await supabaseClient
      .from("budget_items")
      .select("category, amount")
      .eq("trip_id", tripId);

    if (error) throw error;
    return (data as BudgetItem[]).reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);
  },

  subscribeToTripBudget(tripId: string, callback: (payload: any) => void) {
    return supabaseClient
      .channel(`trip:${tripId}:budget`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "budget_items",
          filter: `trip_id=eq.${tripId}`,
        },
        callback
      )
      .subscribe();
  },
};

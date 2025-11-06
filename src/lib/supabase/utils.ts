import type { Database } from "./types";
import type { SupabaseClient } from "@supabase/supabase-js";

// Helper type to fix insert/update typing issues with @supabase/ssr
export type TypedSupabaseClient = SupabaseClient<Database>;

// Helper function to cast the client when needed for insert/update operations
export function getTypedClient(client: any): TypedSupabaseClient {
  return client as TypedSupabaseClient;
}

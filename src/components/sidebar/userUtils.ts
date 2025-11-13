import type { User } from "@supabase/supabase-js";

export const getUserInitials = (user: User | null): string => {
  if (!user?.email) return "U";
  return user.email.charAt(0).toUpperCase();
};

export const getUserDisplayName = (user: User | null): string => {
  if (!user?.email) return "Viajero";
  return user.user_metadata?.full_name || user.email.split("@")[0];
};

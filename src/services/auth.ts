import { supabaseClient } from "@/lib/supabase/index";

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async updatePassword(password: string) {
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) throw error;
  },
};

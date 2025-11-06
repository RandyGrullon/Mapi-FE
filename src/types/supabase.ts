export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          start_date: string | null;
          end_date: string | null;
          status: "draft" | "planned" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: "draft" | "planned" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: "draft" | "planned" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      trip_members: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          role: "owner" | "member" | "viewer";
          status: "pending" | "accepted" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id: string;
          role?: "owner" | "member" | "viewer";
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          user_id?: string;
          role?: "owner" | "member" | "viewer";
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          description: string | null;
          location: string | null;
          start_time: string | null;
          end_time: string | null;
          cost: number | null;
          status: "planned" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          name: string;
          description?: string | null;
          location?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          cost?: number | null;
          status?: "planned" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          name?: string;
          description?: string | null;
          location?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          cost?: number | null;
          status?: "planned" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      accommodations: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          address: string | null;
          check_in: string | null;
          check_out: string | null;
          cost: number | null;
          booking_reference: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          name: string;
          address?: string | null;
          check_in?: string | null;
          check_out?: string | null;
          cost?: number | null;
          booking_reference?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          name?: string;
          address?: string | null;
          check_in?: string | null;
          check_out?: string | null;
          cost?: number | null;
          booking_reference?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transportation: {
        Row: {
          id: string;
          trip_id: string;
          type: "flight" | "car" | "train" | "bus" | "other";
          departure_location: string | null;
          arrival_location: string | null;
          departure_time: string | null;
          arrival_time: string | null;
          booking_reference: string | null;
          cost: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          type: "flight" | "car" | "train" | "bus" | "other";
          departure_location?: string | null;
          arrival_location?: string | null;
          departure_time?: string | null;
          arrival_time?: string | null;
          booking_reference?: string | null;
          cost?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          type?: "flight" | "car" | "train" | "bus" | "other";
          departure_location?: string | null;
          arrival_location?: string | null;
          departure_time?: string | null;
          arrival_time?: string | null;
          booking_reference?: string | null;
          cost?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_items: {
        Row: {
          id: string;
          trip_id: string;
          category: string;
          description: string;
          amount: number;
          paid: boolean;
          paid_by: string | null;
          split_method: "equal" | "percentage" | "fixed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          category: string;
          description: string;
          amount: number;
          paid?: boolean;
          paid_by?: string | null;
          split_method?: "equal" | "percentage" | "fixed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          category?: string;
          description?: string;
          amount?: number;
          paid?: boolean;
          paid_by?: string | null;
          split_method?: "equal" | "percentage" | "fixed";
          created_at?: string;
          updated_at?: string;
        };
      };
      drafts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          content: any;
          type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          content: any;
          type: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          content?: any;
          type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

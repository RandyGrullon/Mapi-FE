import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  user_id: string;
  type: "trip_invite" | "trip_update" | "join_request" | "system" | "other";
  title: string;
  message: string;
  read: boolean;
  related_trip_id?: string | null;
  related_user_id?: string | null;
  action_url?: string | null;
  metadata?: any;
  created_at: string;
}

export interface NotificationInsert {
  user_id: string;
  type: "trip_invite" | "trip_update" | "join_request" | "system" | "other";
  title: string;
  message: string;
  related_trip_id?: string;
  related_user_id?: string;
  action_url?: string;
  metadata?: any;
}

export const notificationService = {
  /**
   * Get all notifications for a user
   */
  async getNotifications(
    userId: string,
    unreadOnly = false
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (unreadOnly) {
        query = query.eq("read", false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  },

  /**
   * Create a new notification
   */
  async createNotification(
    notification: NotificationInsert
  ): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        // @ts-ignore
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        // @ts-ignore
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        // @ts-ignore
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  /**
   * Delete all read notifications for a user
   */
  async deleteReadNotifications(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId)
        .eq("read", true);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting read notifications:", error);
      throw error;
    }
  },

  /**
   * Subscribe to new notifications for a user
   */
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(`notifications:user_id=eq.${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return subscription;
  },

  /**
   * Send a trip invitation notification
   */
  async sendTripInvitation(
    recipientUserId: string,
    tripId: string,
    tripName: string,
    senderName: string
  ): Promise<void> {
    await this.createNotification({
      user_id: recipientUserId,
      type: "trip_invite",
      title: "Trip Invitation",
      message: `${senderName} invited you to join "${tripName}"`,
      related_trip_id: tripId,
      action_url: `/trip/${tripId}`,
    });
  },

  /**
   * Send a join request notification
   */
  async sendJoinRequest(
    tripOwnerId: string,
    tripId: string,
    tripName: string,
    requesterName: string,
    requesterId: string
  ): Promise<void> {
    await this.createNotification({
      user_id: tripOwnerId,
      type: "join_request",
      title: "New Join Request",
      message: `${requesterName} wants to join your trip "${tripName}"`,
      related_trip_id: tripId,
      related_user_id: requesterId,
      action_url: `/trip/${tripId}`,
    });
  },

  /**
   * Send a trip update notification to all members
   */
  async sendTripUpdateToMembers(
    tripId: string,
    tripName: string,
    updateMessage: string,
    excludeUserId?: string
  ): Promise<void> {
    try {
      // Get all trip members
      const { data: members, error } = await supabase
        .from("trip_members")
        .select("user_id")
        .eq("trip_id", tripId)
        .eq("status", "accepted");

      if (error) throw error;

      // Create notifications for all members (except the user who made the update)
      const notifications = (members as any[])
        ?.filter((member: any) => member.user_id !== excludeUserId)
        .map((member: any) => ({
          user_id: member.user_id,
          type: "trip_update" as const,
          title: "Trip Updated",
          message: `"${tripName}" has been updated: ${updateMessage}`,
          related_trip_id: tripId,
          action_url: `/trip/${tripId}`,
        }));

      if (notifications && notifications.length > 0) {
        const { error: insertError } = await supabase
          .from("notifications")
          // @ts-ignore
          .insert(notifications);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error sending trip update notifications:", error);
      throw error;
    }
  },
};

import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  userIds: string[];
  notification: {
    title: string;
    body: string;
    type?: 'message' | 'prayer_request' | 'event' | 'announcement';
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  };
  checkPreferences?: boolean;
}

export const sendPushNotification = async (params: SendNotificationParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: params,
    });

    if (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error };
    }

    console.log('Push notification sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error invoking push notification function:', error);
    return { success: false, error };
  }
};

// Helper functions for specific notification types

export const notifyNewMessage = async (recipientId: string, senderName: string) => {
  return sendPushNotification({
    userIds: [recipientId],
    notification: {
      title: 'New Message',
      body: `${senderName} sent you a message`,
      type: 'message',
      tag: 'new-message',
      data: { url: '/messages' },
    },
  });
};

export const notifyPrayerRequestUpdate = async (userIds: string[], requestTitle: string, status: string) => {
  return sendPushNotification({
    userIds,
    notification: {
      title: 'Prayer Request Update',
      body: `"${requestTitle}" status changed to ${status}`,
      type: 'prayer_request',
      tag: 'prayer-update',
      data: { url: '/prayer-requests' },
    },
  });
};

export const notifyNewPrayerRequest = async (userIds: string[], requestTitle: string, requesterName: string) => {
  return sendPushNotification({
    userIds,
    notification: {
      title: 'New Prayer Request',
      body: `${requesterName} requested prayer for: ${requestTitle}`,
      type: 'prayer_request',
      tag: 'new-prayer-request',
      data: { url: '/prayer-requests' },
    },
  });
};

export const notifyUpcomingEvent = async (userIds: string[], eventTitle: string, eventDate: string) => {
  return sendPushNotification({
    userIds,
    notification: {
      title: 'Upcoming Event',
      body: `${eventTitle} is happening on ${eventDate}`,
      type: 'event',
      tag: 'upcoming-event',
      data: { url: '/dashboard#events' },
    },
  });
};

export const notifyNewAnnouncement = async (userIds: string[], announcementTitle: string, priority: string) => {
  return sendPushNotification({
    userIds,
    notification: {
      title: priority === 'high' ? '🔔 Important Announcement' : 'Church Announcement',
      body: announcementTitle,
      type: 'announcement',
      tag: 'new-announcement',
      data: { url: '/dashboard' },
    },
  });
};
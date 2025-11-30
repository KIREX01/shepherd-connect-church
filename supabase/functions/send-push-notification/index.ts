import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

async function sendWebPush(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<boolean> {
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error('VAPID keys not configured');
    return false;
  }

  try {
    // Import web-push library
    const webpush = await import('https://esm.sh/web-push@3.6.7');
    
    webpush.setVapidDetails(
      'mailto:contact@shepherdconnect.app',
      vapidPublicKey,
      vapidPrivateKey
    );

    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );

    console.log('Push notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userIds, notification, checkPreferences = true } = await req.json();

    if (!userIds || !notification) {
      return new Response(
        JSON.stringify({ error: 'Missing userIds or notification' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending notifications to users:', userIds);

    // Get subscriptions for these users
    let query = supabaseClient
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    const { data: subscriptions, error: subsError } = await query;

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check preferences if required
    let filteredSubscriptions = subscriptions;
    if (checkPreferences && notification.type) {
      const { data: preferences } = await supabaseClient
        .from('notification_preferences')
        .select('*')
        .in('user_id', userIds);

      if (preferences) {
        const enabledUserIds = new Set(
          preferences
            .filter(pref => {
              switch (notification.type) {
                case 'message': return pref.messages_enabled;
                case 'prayer_request': return pref.prayer_requests_enabled;
                case 'event': return pref.events_enabled;
                case 'announcement': return pref.announcements_enabled;
                default: return true;
              }
            })
            .map(pref => pref.user_id)
        );

        filteredSubscriptions = subscriptions.filter(sub => 
          enabledUserIds.has(sub.user_id)
        );
      }
    }

    // Send notifications
    const results = await Promise.all(
      filteredSubscriptions.map(sub => 
        sendWebPush(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          {
            title: notification.title,
            body: notification.body,
            icon: notification.icon || '/pwa-192x192.png',
            badge: notification.badge || '/pwa-192x192.png',
            tag: notification.tag,
            data: notification.data,
          }
        )
      )
    );

    const successCount = results.filter(r => r).length;

    console.log(`Sent ${successCount} out of ${filteredSubscriptions.length} notifications`);

    return new Response(
      JSON.stringify({ 
        sent: successCount, 
        total: filteredSubscriptions.length 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-push-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
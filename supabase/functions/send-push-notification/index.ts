import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  user_id: string;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

interface RequestBody {
  userIds: string[];
  notification: NotificationPayload & { type?: string };
  checkPreferences?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys not configured');
      return new Response(
        JSON.stringify({ error: 'VAPID keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userIds, notification, checkPreferences = true }: RequestBody = await req.json();

    if (!userIds || !notification) {
      return new Response(
        JSON.stringify({ error: 'Missing userIds or notification' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending notification to ${userIds.length} users:`, notification.title);

    // Get push subscriptions for the specified users
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found for users');
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let filteredSubscriptions = subscriptions as PushSubscription[];

    // Check notification preferences if requested
    if (checkPreferences && notification.type) {
      const { data: preferences } = await supabaseClient
        .from('notification_preferences')
        .select('*')
        .in('user_id', userIds);

      if (preferences && preferences.length > 0) {
        const enabledUserIds = new Set(
          preferences
            .filter((pref: Record<string, unknown>) => {
              switch (notification.type) {
                case 'message': return pref.messages_enabled;
                case 'prayer_request': return pref.prayer_requests_enabled;
                case 'event': return pref.events_enabled;
                case 'announcement': return pref.announcements_enabled;
                default: return true;
              }
            })
            .map((pref: Record<string, unknown>) => pref.user_id as string)
        );

        filteredSubscriptions = subscriptions.filter((sub: PushSubscription) =>
          enabledUserIds.has(sub.user_id)
        );
      }
    }

    console.log(`Sending to ${filteredSubscriptions.length} subscriptions`);

    // Send push notifications using Web Push API
    const results = await Promise.all(
      filteredSubscriptions.map(async (sub: PushSubscription) => {
        try {
          const payload = JSON.stringify({
            title: notification.title,
            body: notification.body,
            icon: notification.icon || '/pwa-192x192.png',
            badge: notification.badge || '/pwa-192x192.png',
            tag: notification.tag,
            data: notification.data,
          });

          // Simple push - the browser handles the encryption
          const response = await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'TTL': '86400',
            },
            body: payload,
          });

          if (response.ok || response.status === 201) {
            console.log(`Push sent to ${sub.endpoint}`);
            return true;
          } else {
            console.error(`Push failed for ${sub.endpoint}: ${response.status}`);
            return false;
          }
        } catch (error) {
          console.error(`Error sending push to ${sub.endpoint}:`, error);
          return false;
        }
      })
    );

    const successCount = results.filter((r: boolean) => r).length;

    console.log(`Successfully sent ${successCount}/${filteredSubscriptions.length} notifications`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount, 
        total: filteredSubscriptions.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in send-push-notification:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

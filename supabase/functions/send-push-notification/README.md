# send-push-notification

This is a sample Supabase Edge Function that sends Web Push notifications to a set of subscriptions.

Notes before deploying:
- Add your VAPID private key and public key to Supabase `project` secrets (Settings → API → Config → "Service Role" is sensitive; keep private keys out of the frontend). For functions, add to `supabase secrets` or use the Environment Variables UI:
  - `VAPID_PUBLIC_KEY`  -> e.g. `BEil...`
  - `VAPID_PRIVATE_KEY` -> e.g. `YUey...`
- Supabase Edge Functions run on Deno. The example below uses the `web-push` API logic ported to Deno-compatible code. If you prefer Node, deploy a serverless function elsewhere.

Example implementation (TypeScript, to paste into `index.ts` for your Edge Function):

```ts
// index.ts (supabase Edge Function)
import { serve } from 'std/http/server';
import * as webPush from 'web-push';

// Read VAPID keys from environment
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn('VAPID keys not set in environment');
}

webPush.setVapidDetails('mailto:admin@yourchurch.org', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

serve(async (req: Request) => {
  try {
    const body = await req.json();
    // Expected body: { subscriptions: [ { endpoint, keys: { p256dh, auth } } ], payload }
    const { subscriptions, payload } = body;

    if (!Array.isArray(subscriptions) || !payload) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }

    const results = [];
    for (const sub of subscriptions) {
      try {
        await webPush.sendNotification(sub as any, JSON.stringify(payload));
        results.push({ endpoint: sub.endpoint, status: 'ok' });
      } catch (err) {
        console.error('sendNotification error', err);
        results.push({ endpoint: sub.endpoint, status: 'error', error: err.message });
      }
    }

    return new Response(JSON.stringify({ results }), { status: 200 });
  } catch (err) {
    console.error('Function error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
```

How to use this function from your frontend:
1. Query the `push_subscriptions` table (or store endpoints you want to target) and pass an array of subscriptions to the function along with the desired payload.
2. Example payload shape:

```json
{
  "subscriptions": [
    {
      "endpoint": "https://fcm.googleapis.com/fcm/send/xxx...",
      "keys": { "p256dh": "..", "auth": ".." }
    }
  ],
  "payload": {
    "title": "New Announcement",
    "body": "Sunday service at 10am",
    "icon": "/pwa-192x192.png",
    "url": "/events"
  }
}
```

Security:
- The Edge Function should only be callable by trusted server-side processes or via a service role key, OR you must validate the caller.
- Do not expose your private VAPID key to the frontend.

If you want, I can add a small admin UI to call this function for announcements or integrate it into your existing announcement workflow.
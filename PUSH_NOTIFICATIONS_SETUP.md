# Push Notifications Setup Guide

This guide will help you complete the push notifications setup for Shepherd Connect.

## Step 1: Generate VAPID Keys

You've already added the VAPID keys to Supabase secrets. If you need to generate new ones or verify the existing ones, you can use the web-push library:

### Option A: Using Node.js

```bash
npm install -g web-push
web-push generate-vapid-keys
```

### Option B: Using npx (no installation needed)

```bash
npx web-push generate-vapid-keys
```

This will output:
```
=======================================
Public Key:
BEL_YOUR_PUBLIC_KEY_HERE...

Private Key:
YOUR_PRIVATE_KEY_HERE...
=======================================
```

## Step 2: Configure VAPID Public Key in Frontend

The VAPID public key needs to be accessible in the frontend code. Update the `getVapidPublicKey` function in `src/hooks/usePushNotifications.tsx`:

Replace:
```typescript
const getVapidPublicKey = async (): Promise<string> => {
  return 'BEL_YOUR_VAPID_PUBLIC_KEY_HERE';
};
```

With your actual public key:
```typescript
const getVapidPublicKey = async (): Promise<string> => {
  return 'YOUR_ACTUAL_PUBLIC_KEY_FROM_STEP_1';
};
```

**Note:** The public VAPID key is safe to expose in frontend code. Only the private key must remain secret in Supabase.

## Step 3: Test Push Notifications

1. Navigate to the Dashboard or Settings page
2. You'll see a "Push Notifications" card
3. Click "Enable" to request notification permission
4. Once enabled, you can configure which types of notifications you want to receive

## Step 4: Verify Notifications Work

Test each notification type:

### Messages
- Have another user send you a message
- You should receive a push notification

### Prayer Requests
- When a prayer request status changes or a new one is created
- Configured users will receive notifications

### Events
- Upcoming events will trigger notifications
- Based on user preferences

### Announcements
- New church announcements trigger notifications
- High-priority announcements are marked specially

## Notification Preferences

Users can manage their notification preferences in:
- Dashboard (right sidebar)
- Settings page (`/settings`)

Each notification type can be individually enabled/disabled:
- New Messages
- Prayer Request Updates
- Upcoming Events
- Church Announcements

## Database Tables

The push notification system uses two tables:

### `push_subscriptions`
Stores user push notification subscriptions with:
- endpoint (unique per device/browser)
- encryption keys (p256dh and auth)

### `notification_preferences`
Stores user preferences for each notification type

## Edge Function

The `send-push-notification` edge function handles:
- Sending notifications to multiple users
- Checking user preferences before sending
- Managing failed deliveries

## Troubleshooting

### Notifications not working?

1. **Check browser support**: Push notifications require HTTPS and a modern browser
2. **Verify VAPID keys**: Ensure both public and private keys are correctly configured
3. **Check permissions**: Make sure notification permission is granted in browser settings
4. **Review logs**: Check Supabase edge function logs for errors
5. **Test service worker**: Verify `/sw.js` is loading correctly

### Testing in development

- Use a tool like `ngrok` to test with HTTPS locally
- Or deploy to your staging environment for testing

## Production Considerations

1. **HTTPS Required**: Push notifications only work over HTTPS
2. **Browser Compatibility**: Check caniuse.com for browser support
3. **User Consent**: Always request permission before subscribing users
4. **Unsubscribe Option**: Provide clear way to disable notifications
5. **Rate Limiting**: Consider implementing rate limits on the edge function

## Additional Resources

- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

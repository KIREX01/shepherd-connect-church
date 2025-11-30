import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// This will be provided by your backend or environment
// For now, you'll need to get this from your Supabase secrets
const getVapidPublicKey = async (): Promise<string> => {
  // In production, fetch this from your backend/config
  // For now, return a placeholder that users will need to replace
  return 'BEL_YOUR_VAPID_PUBLIC_KEY_HERE';
};

interface PushSubscriptionState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  permission: NotificationPermission;
}

export const usePushNotifications = () => {
  const { toast } = useToast();
  const [state, setState] = useState<PushSubscriptionState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    permission: 'default',
  });

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    const permission = isSupported ? Notification.permission : 'denied';
    
    if (isSupported) {
      const isSubscribed = await checkSubscription();
      setState({ isSupported, isSubscribed, isLoading: false, permission });
    } else {
      setState({ isSupported: false, isSubscribed: false, isLoading: false, permission });
    }
  };

  const checkSubscription = async (): Promise<boolean> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  };

  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    if (!state.isSupported) {
      toast({
        title: 'Not Supported',
        description: 'Push notifications are not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        toast({
          title: 'Permission Denied',
          description: 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        });
        setState(prev => ({ ...prev, isLoading: false, permission }));
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Get VAPID public key
      const vapidPublicKey = await getVapidPublicKey();

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      // Save subscription to database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const subscriptionJSON = subscription.toJSON();
      
      const { error } = await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscriptionJSON.keys?.p256dh || '',
        auth: subscriptionJSON.keys?.auth || '',
      });

      if (error) throw error;

      toast({
        title: 'Notifications Enabled',
        description: 'You will now receive push notifications.',
      });

      setState(prev => ({ ...prev, isSubscribed: true, isLoading: false, permission }));
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Could not enable push notifications.',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const unsubscribe = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Remove from database
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', subscription.endpoint);
        }
      }

      toast({
        title: 'Notifications Disabled',
        description: 'You will no longer receive push notifications.',
      });

      setState(prev => ({ ...prev, isSubscribed: false, isLoading: false }));
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: 'Error',
        description: 'Could not disable push notifications.',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    subscribe,
    unsubscribe,
  };
};
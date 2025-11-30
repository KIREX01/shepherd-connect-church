import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface NotificationPreferences {
  messages_enabled: boolean;
  prayer_requests_enabled: boolean;
  events_enabled: boolean;
  announcements_enabled: boolean;
}

export const NotificationSettings = () => {
  const { toast } = useToast();
  const { isSupported, isSubscribed, isLoading, permission, subscribe, unsubscribe } = usePushNotifications();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    messages_enabled: true,
    prayer_requests_enabled: true,
    events_enabled: true,
    announcements_enabled: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPreferences({
        messages_enabled: data.messages_enabled,
        prayer_requests_enabled: data.prayer_requests_enabled,
        events_enabled: data.events_enabled,
        announcements_enabled: data.announcements_enabled,
      });
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...newPreferences,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Saved',
        description: 'Notification preferences updated.',
      });
    }
    setSaving(false);
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
          {isSubscribed && <Badge variant="outline">Enabled</Badge>}
        </CardTitle>
        <CardDescription>
          Manage your notification preferences for the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-toggle" className="flex-1">
              Enable Push Notifications
            </Label>
            <Button
              id="push-toggle"
              onClick={isSubscribed ? unsubscribe : subscribe}
              disabled={isLoading}
              variant={isSubscribed ? 'destructive' : 'default'}
              size="sm"
            >
              {isLoading ? 'Loading...' : isSubscribed ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {permission === 'denied' && (
            <p className="text-sm text-muted-foreground">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </div>

        {isSubscribed && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">Notification Types</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="messages" className="flex-1">
                New Messages
              </Label>
              <Switch
                id="messages"
                checked={preferences.messages_enabled}
                onCheckedChange={() => handleToggle('messages_enabled')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="prayer" className="flex-1">
                Prayer Request Updates
              </Label>
              <Switch
                id="prayer"
                checked={preferences.prayer_requests_enabled}
                onCheckedChange={() => handleToggle('prayer_requests_enabled')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="events" className="flex-1">
                Upcoming Events
              </Label>
              <Switch
                id="events"
                checked={preferences.events_enabled}
                onCheckedChange={() => handleToggle('events_enabled')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="announcements" className="flex-1">
                Church Announcements
              </Label>
              <Switch
                id="announcements"
                checked={preferences.announcements_enabled}
                onCheckedChange={() => handleToggle('announcements_enabled')}
                disabled={saving}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
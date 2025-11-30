-- Create push subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own subscriptions
CREATE POLICY "Users can insert their own subscriptions"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions"
ON public.push_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
ON public.push_subscriptions
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all subscriptions (for sending notifications)
CREATE POLICY "Admins can view all subscriptions"
ON public.push_subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  messages_enabled BOOLEAN NOT NULL DEFAULT true,
  prayer_requests_enabled BOOLEAN NOT NULL DEFAULT true,
  events_enabled BOOLEAN NOT NULL DEFAULT true,
  announcements_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can manage their own preferences
CREATE POLICY "Users can insert their own preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences"
ON public.notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for notification preferences
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_notification_preferences_updated_at();

-- Create trigger for push subscriptions
CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_notification_preferences_updated_at();
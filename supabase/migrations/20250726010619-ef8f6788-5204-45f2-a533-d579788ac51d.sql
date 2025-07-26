
-- Create prayer_requests table
CREATE TABLE public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_private BOOLEAN NOT NULL DEFAULT false,
  requester_name TEXT,
  requester_email TEXT,
  requester_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prayer_responses table
CREATE TABLE public.prayer_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_request_id UUID NOT NULL,
  user_id UUID NOT NULL,
  response_type TEXT NOT NULL DEFAULT 'prayed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT 'general',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for prayer_requests
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view non-private prayer requests" ON public.prayer_requests
  FOR SELECT USING (is_private = false OR auth.uid() = user_id);

CREATE POLICY "Admins and pastors can view all prayer requests" ON public.prayer_requests
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Users can create prayer requests" ON public.prayer_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own prayer requests" ON public.prayer_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins and pastors can manage prayer requests" ON public.prayer_requests
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Add RLS policies for prayer_responses
ALTER TABLE public.prayer_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view prayer responses" ON public.prayer_responses
  FOR SELECT USING (true);

CREATE POLICY "Users can create prayer responses" ON public.prayer_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer responses" ON public.prayer_responses
  FOR UPDATE USING (auth.uid() = user_id);

-- Add RLS policies for event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own event registrations" ON public.event_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins and pastors can view all event registrations" ON public.event_registrations
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Users can create event registrations" ON public.event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event registrations" ON public.event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event registrations" ON public.event_registrations
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view announcements" ON public.announcements
  FOR SELECT USING (true);

CREATE POLICY "Admins and pastors can manage announcements" ON public.announcements
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Add foreign key constraints
ALTER TABLE public.prayer_responses 
  ADD CONSTRAINT fk_prayer_responses_prayer_request 
  FOREIGN KEY (prayer_request_id) REFERENCES public.prayer_requests(id) ON DELETE CASCADE;

ALTER TABLE public.event_registrations 
  ADD CONSTRAINT fk_event_registrations_event 
  FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- Add triggers for updated_at
CREATE TRIGGER update_prayer_requests_updated_at
  BEFORE UPDATE ON public.prayer_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

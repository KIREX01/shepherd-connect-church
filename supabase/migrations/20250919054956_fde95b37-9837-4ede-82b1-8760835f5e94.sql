-- Create volunteer_registrations table
CREATE TABLE public.volunteer_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  availability text[] NOT NULL DEFAULT '{}',
  ministry_areas text[] NOT NULL DEFAULT '{}',
  skills text,
  experience text,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  background_check_consent boolean NOT NULL DEFAULT false,
  additional_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.volunteer_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for volunteer registrations
CREATE POLICY "Admins and pastors can manage volunteer registrations" 
ON public.volunteer_registrations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Admins and pastors can view all volunteer registrations" 
ON public.volunteer_registrations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Anyone can submit volunteer registrations" 
ON public.volunteer_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_volunteer_registrations_updated_at
BEFORE UPDATE ON public.volunteer_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create member_registrations table based on the form fields
CREATE TABLE public.member_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('member', 'visitor', 'regular_attendee')),
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  notes TEXT,
  recorded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for member registrations
CREATE POLICY "Admins and pastors can view all member registrations" 
  ON public.member_registrations 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Admins and pastors can manage member registrations" 
  ON public.member_registrations 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_member_registrations_updated_at 
  BEFORE UPDATE ON public.member_registrations 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
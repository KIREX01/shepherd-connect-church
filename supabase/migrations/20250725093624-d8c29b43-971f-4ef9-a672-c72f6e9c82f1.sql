-- Update events table to match the EventCreationForm fields
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS start_time text,
ADD COLUMN IF NOT EXISTS end_time text,
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other',
ADD COLUMN IF NOT EXISTS max_attendees integer,
ADD COLUMN IF NOT EXISTS registration_required boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS cost numeric(10,2),
ADD COLUMN IF NOT EXISTS contact_person text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS requires_childcare boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS notes text;

-- Create attendance_records table based on AttendanceEntryForm
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_date date NOT NULL,
  service_type text NOT NULL,
  total_attendance integer NOT NULL,
  adult_count integer NOT NULL DEFAULT 0,
  child_count integer NOT NULL DEFAULT 0,
  visitor_count integer NOT NULL DEFAULT 0,
  first_time_visitors integer NOT NULL DEFAULT 0,
  special_notes text,
  recorded_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on attendance_records
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance_records
CREATE POLICY "Admins and pastors can view all attendance records" 
ON public.attendance_records 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Admins and pastors can manage attendance records" 
ON public.attendance_records 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Create donation_records table based on DonationEntryForm  
CREATE TABLE IF NOT EXISTS public.donation_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name text,
  donor_email text,
  donor_phone text,
  amount numeric(10,2) NOT NULL,
  donation_date date NOT NULL,
  payment_method text NOT NULL,
  check_number text,
  category text NOT NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  is_recurring boolean NOT NULL DEFAULT false,
  tax_deductible boolean NOT NULL DEFAULT true,
  notes text,
  recorded_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on donation_records
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;

-- Create policies for donation_records
CREATE POLICY "Admins and pastors can view all donation records" 
ON public.donation_records 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Admins and pastors can manage donation records" 
ON public.donation_records 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Create triggers for updated_at columns
CREATE TRIGGER update_attendance_records_updated_at
BEFORE UPDATE ON public.attendance_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donation_records_updated_at
BEFORE UPDATE ON public.donation_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Volunteer Registrations Table
CREATE TABLE IF NOT EXISTS public.volunteer_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    availability text[] NOT NULL,
    ministry_areas text[] NOT NULL,
    skills text,
    experience text,
    emergency_contact_name text NOT NULL,
    emergency_contact_phone text NOT NULL,
    background_check_consent boolean NOT NULL,
    additional_notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Church Finances Table
CREATE TABLE IF NOT EXISTS public.church_finances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    amount numeric(12,2) NOT NULL,
    date date NOT NULL,
    description text,
    category text,
    recorded_by text,
    created_at timestamptz NOT NULL DEFAULT now()
);
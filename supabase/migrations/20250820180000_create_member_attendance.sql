-- Create member_attendance table
CREATE TABLE public.member_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_type text NOT NULL, -- e.g. 'church', 'bible_study', 'choir', 'devotion', 'outreach', 'workshop', 'other'
  event_date date NOT NULL,
  check_in_time timestamp with time zone,
  check_out_time timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_attendance ENABLE ROW LEVEL SECURITY;

-- Members can view and add their own attendance
CREATE POLICY "Members can view their own attendance"
ON public.member_attendance
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can add their own attendance"
ON public.member_attendance
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins and pastors can view and manage all attendance
CREATE POLICY "Admins and pastors can view all attendance"
ON public.member_attendance
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Admins and pastors can manage attendance"
ON public.member_attendance
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_member_attendance_updated_at
BEFORE UPDATE ON public.member_attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
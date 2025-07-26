-- Create member_attendance table
CREATE TABLE IF NOT EXISTS public.member_attendance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL,
    member_name text NOT NULL,
    activity_type text NOT NULL,
    activity_name text NOT NULL,
    attendance_date date NOT NULL,
    check_in_time time,
    check_out_time time,
    duration_minutes integer,
    status text NOT NULL DEFAULT 'present', -- present, absent, late, excused
    notes text,
    recorded_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on member_attendance
ALTER TABLE public.member_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for member_attendance
CREATE POLICY "Members can view their own attendance" 
ON public.member_attendance 
FOR SELECT 
USING (auth.uid() = member_id);

CREATE POLICY "Admins and pastors can view all attendance" 
ON public.member_attendance 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Members can create their own attendance" 
ON public.member_attendance 
FOR INSERT 
WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Admins and pastors can create attendance for any member" 
ON public.member_attendance 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Members can update their own attendance" 
ON public.member_attendance 
FOR UPDATE 
USING (auth.uid() = member_id);

CREATE POLICY "Admins and pastors can update any attendance" 
ON public.member_attendance 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Admins and pastors can delete attendance" 
ON public.member_attendance 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Create trigger for updated_at column
CREATE TRIGGER update_member_attendance_updated_at
BEFORE UPDATE ON public.member_attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint to profiles table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        ALTER TABLE public.member_attendance 
        ADD CONSTRAINT fk_member_attendance_member 
        FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create activity_types enum table for reference
CREATE TABLE IF NOT EXISTS public.activity_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    color text DEFAULT '#3b82f6',
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default activity types
INSERT INTO public.activity_types (name, description, color) VALUES
    ('church_events', 'Church Events and Services', '#3b82f6'),
    ('bible_study', 'Bible Study Sessions', '#10b981'),
    ('choir_practice', 'Choir Practice and Music Ministry', '#f59e0b'),
    ('evening_devotions', 'Evening Devotions and Prayer', '#8b5cf6'),
    ('outreaches', 'Outreach and Mission Activities', '#ef4444'),
    ('workshops', 'Workshops and Training Sessions', '#06b6d4'),
    ('youth_group', 'Youth Group Activities', '#ec4899'),
    ('prayer_meeting', 'Prayer Meetings', '#84cc16'),
    ('fellowship', 'Fellowship and Social Events', '#f97316'),
    ('other', 'Other Activities', '#6b7280')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on activity_types
ALTER TABLE public.activity_types ENABLE ROW LEVEL SECURITY;

-- Create policies for activity_types (read-only for all users)
CREATE POLICY "Everyone can view activity types" 
ON public.activity_types 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage activity types" 
ON public.activity_types 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role)); 
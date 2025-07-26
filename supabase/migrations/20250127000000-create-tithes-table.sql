-- Create tithes table
CREATE TABLE IF NOT EXISTS public.tithes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL,
    member_name text NOT NULL,
    amount numeric(10,2) NOT NULL,
    tithe_date date NOT NULL,
    payment_method text NOT NULL DEFAULT 'cash',
    check_number text,
    category text NOT NULL DEFAULT 'tithe',
    is_anonymous boolean NOT NULL DEFAULT false,
    notes text,
    recorded_by uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on tithes
ALTER TABLE public.tithes ENABLE ROW LEVEL SECURITY;

-- Create policies for tithes
CREATE POLICY "Members can view their own tithes" 
ON public.tithes 
FOR SELECT 
USING (auth.uid() = member_id);

CREATE POLICY "Admins and pastors can view all tithes" 
ON public.tithes 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Members can create their own tithes" 
ON public.tithes 
FOR INSERT 
WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Admins and pastors can create tithes for any member" 
ON public.tithes 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Members can update their own tithes" 
ON public.tithes 
FOR UPDATE 
USING (auth.uid() = member_id);

CREATE POLICY "Admins and pastors can update any tithes" 
ON public.tithes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

CREATE POLICY "Admins and pastors can delete tithes" 
ON public.tithes 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Create trigger for updated_at column
CREATE TRIGGER update_tithes_updated_at
BEFORE UPDATE ON public.tithes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint to profiles table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        ALTER TABLE public.tithes 
        ADD CONSTRAINT fk_tithes_member 
        FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$; 
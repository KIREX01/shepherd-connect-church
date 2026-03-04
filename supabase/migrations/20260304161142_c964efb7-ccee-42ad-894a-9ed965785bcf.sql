-- Create church_finances table with RLS from the start
CREATE TABLE IF NOT EXISTS public.church_finances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL,
  date date NOT NULL,
  description text,
  category text,
  recorded_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.church_finances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage church finances"
ON public.church_finances FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Pastors can view church finances"
ON public.church_finances FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'pastor'::app_role));
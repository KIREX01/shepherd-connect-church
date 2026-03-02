CREATE TABLE public.daily_bible_verses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verse_reference text NOT NULL,
  verse_text text NOT NULL,
  reflection text,
  posted_by uuid NOT NULL,
  verse_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (verse_date)
);

ALTER TABLE public.daily_bible_verses ENABLE ROW LEVEL SECURITY;

-- Everyone can view verses
CREATE POLICY "Everyone can view daily bible verses"
  ON public.daily_bible_verses FOR SELECT
  USING (true);

-- Admins and pastors can manage verses
CREATE POLICY "Admins and pastors can manage bible verses"
  ON public.daily_bible_verses FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pastor'::app_role));

-- Members can insert verses (for assigned members)
CREATE POLICY "Members can post bible verses"
  ON public.daily_bible_verses FOR INSERT
  WITH CHECK (auth.uid() = posted_by);

-- Trigger for updated_at
CREATE TRIGGER update_daily_bible_verses_updated_at
  BEFORE UPDATE ON public.daily_bible_verses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
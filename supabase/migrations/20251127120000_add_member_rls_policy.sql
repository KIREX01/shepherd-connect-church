CREATE POLICY "Members can insert their own registration"
  ON public.member_registrations
  FOR INSERT
  WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Members can view their own registration"
  ON public.member_registrations
  FOR SELECT
  USING (auth.uid() = recorded_by);

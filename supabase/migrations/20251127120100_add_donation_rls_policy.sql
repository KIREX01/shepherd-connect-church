CREATE POLICY "Members can insert their own donation"
  ON public.donation_records
  FOR INSERT
  WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Members can view their own donation"
  ON public.donation_records
  FOR SELECT
  USING (auth.uid() = recorded_by);

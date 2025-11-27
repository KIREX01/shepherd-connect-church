CREATE POLICY "Members can insert their own attendance"
  ON public.attendance_records
  FOR INSERT
  WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Members can view their own attendance"
  ON public.attendance_records
  FOR SELECT
  USING (auth.uid() = recorded_by);

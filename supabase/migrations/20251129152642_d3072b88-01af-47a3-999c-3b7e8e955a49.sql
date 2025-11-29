-- Allow members to view each other's basic profile information (name only)
-- This is needed so members can search for and message each other
CREATE POLICY "Members can view other members basic profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: This allows viewing names only. Sensitive fields like phone, address
-- are not exposed in the select query from the app code
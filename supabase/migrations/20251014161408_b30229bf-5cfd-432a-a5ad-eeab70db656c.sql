-- Fix: Allow the handle_new_user trigger to insert profiles and user_roles
-- The trigger function runs as SECURITY DEFINER but RLS is still enforced
-- We need to add policies that allow system insertions

-- Add policy to allow trigger to insert profiles
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "System can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Add policy to allow trigger to insert user_roles  
DROP POLICY IF EXISTS "System can insert user_roles" ON public.user_roles;
CREATE POLICY "System can insert user_roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (true);
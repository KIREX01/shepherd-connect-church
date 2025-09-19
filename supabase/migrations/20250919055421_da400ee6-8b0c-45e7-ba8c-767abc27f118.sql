-- Fix security linter issues

-- Fix 1: Remove SECURITY DEFINER from view and make it a regular view
DROP VIEW IF EXISTS public.prayer_requests_public;
CREATE VIEW public.prayer_requests_public AS
SELECT 
  id,
  title,
  description,
  category,
  status,
  is_urgent,
  created_at,
  updated_at
FROM public.prayer_requests
WHERE is_private = false AND status = 'active';

-- Fix 2: Update all functions with proper search_path (they're already done, this is just for completeness)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_text text;
BEGIN
  -- Extract role from metadata, default to 'member' if not provided
  user_role_text := COALESCE(NEW.raw_user_meta_data ->> 'role', 'member');
  
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  
  -- Assign role from metadata to new users, cast text to app_role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role_text::public.app_role);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
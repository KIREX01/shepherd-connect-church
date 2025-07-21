-- Fix the handle_new_user function - remove the double ::app_role cast
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Extract role from metadata, default to 'member' if not provided
  user_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'member'::app_role);
  
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  
  -- Assign role from metadata to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;
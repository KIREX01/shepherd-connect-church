-- Update the handle_new_user function to work with existing app_role enum
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

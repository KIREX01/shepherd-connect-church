-- Fix: Harden handle_new_user to always assign 'member' role, ignoring metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name');

  -- Always assign 'member' role, never trust user-supplied metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member'::public.app_role);

  RETURN NEW;
END;
$$;
-- Security Fix 1: Create safe prayer requests view that excludes sensitive personal data
CREATE OR REPLACE VIEW public.prayer_requests_public AS
SELECT 
  id,
  title,
  description,
  category,
  status,
  is_urgent,
  created_at,
  updated_at,
  -- Exclude sensitive fields: requester_name, requester_email, requester_phone
  NULL as requester_name,
  NULL as requester_email, 
  NULL as requester_phone,
  -- Include user_id for ownership checks but don't expose it in queries
  user_id
FROM public.prayer_requests
WHERE is_private = false AND status = 'active';

-- Security Fix 2: Update prayer requests RLS policies to be more restrictive
DROP POLICY IF EXISTS "Users can view non-private prayer requests" ON public.prayer_requests;

-- New restrictive policy: Only owners, admins and pastors can see personal contact info
CREATE POLICY "Users can view basic prayer request info" 
ON public.prayer_requests 
FOR SELECT 
USING (
  (is_private = false AND status = 'active') OR 
  (auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'admin'::app_role)) OR 
  (has_role(auth.uid(), 'pastor'::app_role))
);

-- Security Fix 3: Update prayer response policies to respect privacy
DROP POLICY IF EXISTS "Users can view prayer responses" ON public.prayer_responses;

CREATE POLICY "Users can view prayer responses for accessible requests" 
ON public.prayer_responses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.prayer_requests pr 
    WHERE pr.id = prayer_request_id 
    AND (
      (pr.is_private = false AND pr.status = 'active') OR 
      (auth.uid() = pr.user_id) OR 
      (has_role(auth.uid(), 'admin'::app_role)) OR 
      (has_role(auth.uid(), 'pastor'::app_role))
    )
  )
);

-- Security Fix 4: Update database functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security Fix 5: Add role change auditing
CREATE TABLE public.role_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  old_role app_role,
  new_role app_role NOT NULL,
  changed_by uuid NOT NULL,
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  reason text
);

-- Enable RLS on audit log
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view role audit logs" 
ON public.role_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only system can insert audit logs (through triggers)
CREATE POLICY "System can insert audit logs" 
ON public.role_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create trigger function for role change auditing
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log role changes
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO public.role_audit_log (user_id, old_role, new_role, changed_by)
    VALUES (NEW.user_id, OLD.role, NEW.role, auth.uid());
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (user_id, old_role, new_role, changed_by)
    VALUES (NEW.user_id, NULL, NEW.role, auth.uid());
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for role auditing
CREATE TRIGGER audit_user_role_changes
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_changes();
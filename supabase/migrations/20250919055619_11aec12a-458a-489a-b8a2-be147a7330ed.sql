-- Security Fix: Update RLS policies and functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view basic prayer request info" ON public.prayer_requests;
DROP POLICY IF EXISTS "Users can view non-private prayer requests" ON public.prayer_requests;

-- Create restrictive RLS policy for prayer requests
CREATE POLICY "Secure prayer request access" 
ON public.prayer_requests 
FOR SELECT 
USING (
  -- Own requests: can see everything
  (auth.uid() = user_id) OR 
  -- Admins/pastors: can see everything  
  (has_role(auth.uid(), 'admin'::app_role)) OR 
  (has_role(auth.uid(), 'pastor'::app_role)) OR
  -- Regular users: only non-private active requests (contact info will be filtered in frontend)
  (auth.uid() IS NOT NULL AND is_private = false AND status = 'active')
);

-- Update prayer response policies to respect privacy
DROP POLICY IF EXISTS "Users can view prayer responses" ON public.prayer_responses;
DROP POLICY IF EXISTS "Users can view prayer responses for accessible requests" ON public.prayer_responses;

CREATE POLICY "Secure prayer response access" 
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

-- Update database functions with proper search_path
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

-- Add role change auditing
CREATE TABLE IF NOT EXISTS public.role_audit_log (
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

-- Create policies for audit log
DROP POLICY IF EXISTS "Admins can view role audit logs" ON public.role_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.role_audit_log;

CREATE POLICY "Admins can view role audit logs" 
ON public.role_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs" 
ON public.role_audit_log 
FOR INSERT 
WITH CHECK (true);
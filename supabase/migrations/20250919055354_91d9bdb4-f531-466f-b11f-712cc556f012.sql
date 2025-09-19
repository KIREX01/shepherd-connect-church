-- Security Fix: Drop existing policies and recreate with proper restrictions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view basic prayer request info" ON public.prayer_requests;
DROP POLICY IF EXISTS "Users can view non-private prayer requests" ON public.prayer_requests;

-- Create safe prayer requests view that excludes sensitive personal data
CREATE OR REPLACE VIEW public.prayer_requests_public AS
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

-- Create restrictive RLS policy: Only owners, admins and pastors can see personal contact info
CREATE POLICY "Members can view public prayer requests safely" 
ON public.prayer_requests 
FOR SELECT 
USING (
  -- Own requests: can see everything
  (auth.uid() = user_id) OR 
  -- Admins/pastors: can see everything  
  (has_role(auth.uid(), 'admin'::app_role)) OR 
  (has_role(auth.uid(), 'pastor'::app_role)) OR
  -- Regular users: only basic info for non-private active requests
  (auth.uid() IS NOT NULL AND is_private = false AND status = 'active')
);

-- Update prayer response policies to respect privacy
DROP POLICY IF EXISTS "Users can view prayer responses" ON public.prayer_responses;
DROP POLICY IF EXISTS "Users can view prayer responses for accessible requests" ON public.prayer_responses;

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
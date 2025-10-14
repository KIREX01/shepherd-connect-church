-- Remove insecure prayer_requests_public view
-- This view has no RLS policies and could expose sensitive data
-- All access should go through the main prayer_requests table which has proper RLS

DROP VIEW IF EXISTS public.prayer_requests_public CASCADE;

-- Fix search_path on helper functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.products_tsv_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$;

-- Lock down SECURITY DEFINER functions: only triggers / explicit callers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.products_tsv_trigger() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten notify_requests insert policy to require a plausible email
DROP POLICY "Anyone can create notify request" ON public.notify_requests;
CREATE POLICY "Anyone can create notify request" ON public.notify_requests
  FOR INSERT
  WITH CHECK (
    char_length(email) BETWEEN 5 AND 254
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

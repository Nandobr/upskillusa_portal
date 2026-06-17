CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  enrichment jsonb,
  audit jsonb,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "No direct read access to leads" ON public.leads;

CREATE POLICY "No direct read access to leads"
  ON public.leads
  FOR SELECT
  USING (false);

CREATE OR REPLACE FUNCTION public.create_pending_lead(_website text, _email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
  _w text := btrim(coalesce(_website, ''));
  _e text := lower(btrim(coalesce(_email, '')));
BEGIN
  IF length(_w) = 0 OR length(_w) > 255 THEN
    RAISE EXCEPTION 'Invalid website';
  END IF;

  IF length(_e) = 0 OR length(_e) > 255 OR _e !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;

  INSERT INTO public.leads (website, email, status)
  VALUES (_w, _e, 'pending')
  RETURNING id INTO _id;

  RETURN _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_lead(
  _lead_id uuid,
  _status text,
  _audit jsonb,
  _enrichment jsonb,
  _error text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _lead_id IS NULL THEN
    RAISE EXCEPTION 'lead_id required';
  END IF;

  IF _status NOT IN ('pending', 'completed', 'failed') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE public.leads
    SET status = _status,
        audit = COALESCE(_audit, audit),
        enrichment = COALESCE(_enrichment, enrichment),
        error = _error,
        updated_at = now()
  WHERE id = _lead_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_pending_lead(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.finalize_lead(uuid, text, jsonb, jsonb, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_pending_lead(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_lead(uuid, text, jsonb, jsonb, text) TO anon, authenticated;

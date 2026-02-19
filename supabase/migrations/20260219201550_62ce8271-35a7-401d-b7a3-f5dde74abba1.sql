
CREATE TABLE public.email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'lead_magnet',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON public.email_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.email_subscribers FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

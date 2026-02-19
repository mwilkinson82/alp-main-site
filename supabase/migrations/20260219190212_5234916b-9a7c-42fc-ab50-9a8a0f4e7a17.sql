
-- Create advisory_applications table
CREATE TABLE public.advisory_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  company_name text NOT NULL,
  annual_revenue text NOT NULL,
  biggest_challenge text NOT NULL,
  already_tried text NOT NULL,
  service_applying_for text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.advisory_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (public lead capture form — no auth required)
CREATE POLICY "Anyone can submit an application"
  ON public.advisory_applications
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read applications
CREATE POLICY "Admins can view applications"
  ON public.advisory_applications
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON public.advisory_applications
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

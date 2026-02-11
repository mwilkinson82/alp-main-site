
-- Create ask_marshall_submissions table
CREATE TABLE public.ask_marshall_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  question TEXT NOT NULL,
  context TEXT,
  file_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ask_marshall_submissions ENABLE ROW LEVEL SECURITY;

-- Public insert (no auth required - customers have already paid)
CREATE POLICY "Anyone can submit a question"
ON public.ask_marshall_submissions
FOR INSERT
WITH CHECK (true);

-- Admin-only select
CREATE POLICY "Admins can view submissions"
ON public.ask_marshall_submissions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admin-only update
CREATE POLICY "Admins can update submissions"
ON public.ask_marshall_submissions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admin-only delete
CREATE POLICY "Admins can delete submissions"
ON public.ask_marshall_submissions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for uploaded files
INSERT INTO storage.buckets (id, name, public)
VALUES ('ask-marshall-files', 'ask-marshall-files', true);

-- Anyone can upload files to this bucket
CREATE POLICY "Anyone can upload ask-marshall files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'ask-marshall-files');

-- Public read access so Marshall can view files from email
CREATE POLICY "Anyone can view ask-marshall files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'ask-marshall-files');

ALTER TABLE public.recordings
  ADD COLUMN IF NOT EXISTS thumbnail_url text;
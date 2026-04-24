-- Create enum for video source
DO $$ BEGIN
  CREATE TYPE public.video_source AS ENUM ('cloudflare', 'zoom_clip');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns
ALTER TABLE public.recordings
  ADD COLUMN IF NOT EXISTS video_source public.video_source NOT NULL DEFAULT 'cloudflare',
  ADD COLUMN IF NOT EXISTS video_ref text;

-- Backfill video_ref from existing cloudflare_video_id values
UPDATE public.recordings
SET video_ref = cloudflare_video_id
WHERE video_ref IS NULL AND cloudflare_video_id IS NOT NULL;
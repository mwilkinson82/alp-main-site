
ALTER TABLE public.recordings
  ADD COLUMN IF NOT EXISTS transcript_doc_id text,
  ADD COLUMN IF NOT EXISTS transcript_content text,
  ADD COLUMN IF NOT EXISTS part_number smallint,
  ADD COLUMN IF NOT EXISTS part_total smallint;

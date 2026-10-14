CREATE TABLE public.recording_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text NOT NULL,
  status text NOT NULL DEFAULT 'running',
  triggered_by text NOT NULL,
  date_from date,
  date_to date,
  scanned integer NOT NULL DEFAULT 0,
  planned integer NOT NULL DEFAULT 0,
  inserted integer NOT NULL DEFAULT 0,
  verified integer NOT NULL DEFAULT 0,
  held integer NOT NULL DEFAULT 0,
  skipped integer NOT NULL DEFAULT 0,
  remaining integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  heartbeat_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  CONSTRAINT recording_sync_runs_status_chk CHECK (status IN ('running','completed','partial','failed','abandoned','skipped_disabled'))
);
-- Only one writing run at a time (concurrency lock).
CREATE UNIQUE INDEX recording_sync_runs_one_running ON public.recording_sync_runs ((true)) WHERE status = 'running';
GRANT SELECT ON public.recording_sync_runs TO authenticated;
GRANT ALL ON public.recording_sync_runs TO service_role;
ALTER TABLE public.recording_sync_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view sync runs" ON public.recording_sync_runs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.recording_sync_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  scheduled_import_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.recording_sync_settings TO authenticated;
GRANT ALL ON public.recording_sync_settings TO service_role;
ALTER TABLE public.recording_sync_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view sync settings" ON public.recording_sync_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
INSERT INTO public.recording_sync_settings (id, scheduled_import_enabled) VALUES (true, false);
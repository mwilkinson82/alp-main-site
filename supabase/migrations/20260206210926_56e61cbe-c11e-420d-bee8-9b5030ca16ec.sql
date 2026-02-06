
CREATE TABLE public.purchase_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  product_name TEXT,
  stripe_session_id TEXT NOT NULL,
  amount_cents INTEGER,
  welcome_email_sent BOOLEAN DEFAULT false,
  kajabi_provisioned BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchase_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view
CREATE POLICY "Admins can view purchase log"
  ON public.purchase_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Edge functions insert via service role (bypasses RLS)

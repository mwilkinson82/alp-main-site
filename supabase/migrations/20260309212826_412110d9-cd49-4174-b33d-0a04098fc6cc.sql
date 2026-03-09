
-- Allow admins to update purchase_log records (for manual retry)
CREATE POLICY "Admins can update purchase log"
ON public.purchase_log
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

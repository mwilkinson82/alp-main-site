CREATE OR REPLACE FUNCTION public.admin_get_last_sign_ins()
RETURNS TABLE(user_id uuid, last_sign_in_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.last_sign_in_at
  FROM auth.users u
  WHERE public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_last_sign_ins() TO authenticated;
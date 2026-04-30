insert into storage.buckets (id, name, public)
values ('recording-thumbnails', 'recording-thumbnails', true)
on conflict (id) do nothing;

create policy "Public can read recording thumbnails"
on storage.objects for select
using (bucket_id = 'recording-thumbnails');

create policy "Admins can upload recording thumbnails"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'recording-thumbnails'
  and public.has_role(auth.uid(), 'admin'::public.app_role)
);

create policy "Admins can update recording thumbnails"
on storage.objects for update
to authenticated
using (
  bucket_id = 'recording-thumbnails'
  and public.has_role(auth.uid(), 'admin'::public.app_role)
);

create policy "Admins can delete recording thumbnails"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'recording-thumbnails'
  and public.has_role(auth.uid(), 'admin'::public.app_role)
);
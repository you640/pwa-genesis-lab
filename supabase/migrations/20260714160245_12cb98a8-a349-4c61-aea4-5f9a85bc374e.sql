
-- 1) Discount codes: remove public read; validation happens via edge function using service role
DROP POLICY IF EXISTS "Anyone can read active codes" ON public.discount_codes;
REVOKE SELECT ON public.discount_codes FROM anon;

-- 2) Orders: guest checkout is not supported; enforce user_id NOT NULL so
--    the orders / order_items INSERT policies unambiguously require the owner.
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

-- 3) Avatars bucket: add an explicit SELECT policy scoped to the file owner
--    so PostgREST/Storage listing cannot be used to enumerate other users'
--    avatar filenames (which would leak user IDs). Direct public URL fetches
--    on the public bucket continue to work.
CREATE POLICY "Users read own avatar"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

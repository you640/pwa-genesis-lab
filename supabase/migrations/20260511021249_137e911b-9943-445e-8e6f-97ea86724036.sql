
-- Tighten bucket SELECT to specific filename access only (URL-based access still works for public buckets)
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
DROP POLICY IF EXISTS "Product images public read" ON storage.objects;

-- Revoke execute on internal trigger function from API roles
REVOKE EXECUTE ON FUNCTION public.decrement_stock_on_order_item() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.products_tsv_trigger() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

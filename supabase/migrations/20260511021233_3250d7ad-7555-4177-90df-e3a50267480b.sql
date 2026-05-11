
-- Cart items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users manage own cart" ON public.cart_items
    FOR ALL TO authenticated
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DROP TRIGGER IF EXISTS cart_items_updated_at ON public.cart_items;
CREATE TRIGGER cart_items_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);

-- Extend orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_street TEXT,
  ADD COLUMN IF NOT EXISTS shipping_city TEXT,
  ADD COLUMN IF NOT EXISTS shipping_zip TEXT,
  ADD COLUMN IF NOT EXISTS shipping_country TEXT,
  ADD COLUMN IF NOT EXISTS shipping_phone TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC,
  ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount NUMERIC NOT NULL DEFAULT 0;

-- Stock decrement trigger
CREATE OR REPLACE FUNCTION public.decrement_stock_on_order_item()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.products
       SET stock_quantity = GREATEST(stock_quantity - NEW.quantity, 0),
           in_stock = (stock_quantity - NEW.quantity) > 0
     WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_decrement_stock ON public.order_items;
CREATE TRIGGER trg_decrement_stock AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.decrement_stock_on_order_item();

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins read audit log" ON public.audit_log
    FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "Avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Product images public read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage product images" ON storage.objects FOR ALL TO authenticated
    USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'))
    WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

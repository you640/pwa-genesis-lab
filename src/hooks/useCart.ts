import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { eShopService } from '@/services/eShopService';
import type { CartItem, Product } from '@/types';

const LS_KEY = 'shoppingCart';

const readLocal = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((i: any) => i.product && typeof i.quantity === 'number') : [];
  } catch {
    return [];
  }
};

const writeLocal = (cart: CartItem[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  } catch {}
};

interface DbCartRow {
  product_id: string;
  quantity: number;
}

/** Resolve real product UUIDs from legacy_id strings (cart uses legacy_id externally) */
async function resolveProductUuids(legacyIds: string[]): Promise<Record<string, string>> {
  if (!legacyIds.length) return {};
  const { data } = await supabase.from('products').select('id, legacy_id').in('legacy_id', legacyIds);
  const map: Record<string, string> = {};
  (data || []).forEach((r: any) => {
    if (r.legacy_id) map[r.legacy_id] = r.id;
  });
  return map;
}

export function useCart() {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const mergedRef = useRef(false);

  // Load cart depending on auth
  const loadFromDb = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('cart_items')
      .select('quantity, products(legacy_id)')
      .eq('user_id', uid);
    if (!data) return [] as CartItem[];
    const legacyIds = (data as any[]).map((r) => r.products?.legacy_id).filter(Boolean);
    if (!legacyIds.length) return [];
    const products = await eShopService.fetchProductsByIds(legacyIds);
    const byId: Record<string, Product> = {};
    products.forEach((p) => (byId[p.id] = p));
    return (data as any[])
      .filter((r) => r.products?.legacy_id && byId[r.products.legacy_id])
      .map((r) => ({ product: byId[r.products.legacy_id], quantity: r.quantity }));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    (async () => {
      setLoading(true);
      if (!user) {
        if (active) {
          setCart(readLocal());
          setLoading(false);
        }
        return;
      }
      // Logged in: merge local into DB once, then read DB
      const local = readLocal();
      if (local.length && !mergedRef.current) {
        const legacyIds = local.map((i) => i.product.id);
        const uuidMap = await resolveProductUuids(legacyIds);
        const rows = local
          .map((i) => uuidMap[i.product.id] ? { user_id: user.id, product_id: uuidMap[i.product.id], quantity: i.quantity } : null)
          .filter(Boolean) as { user_id: string; product_id: string; quantity: number }[];
        if (rows.length) {
          await supabase.from('cart_items').upsert(rows, { onConflict: 'user_id,product_id' });
        }
        localStorage.removeItem(LS_KEY);
        mergedRef.current = true;
      }
      const dbCart = await loadFromDb(user.id);
      if (active) {
        setCart(dbCart);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, authLoading, loadFromDb]);

  // Persist guest cart
  useEffect(() => {
    if (!user && !loading) writeLocal(cart);
  }, [cart, user, loading]);

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { product, quantity }];
    });
    if (user) {
      const uuidMap = await resolveProductUuids([product.id]);
      const productUuid = uuidMap[product.id];
      if (!productUuid) return;
      const { data: existing } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('product_id', productUuid)
        .maybeSingle();
      const newQty = (existing?.quantity || 0) + quantity;
      await supabase
        .from('cart_items')
        .upsert({ user_id: user.id, product_id: productUuid, quantity: newQty }, { onConflict: 'user_id,product_id' });
    }
  }, [user]);

  const updateQuantity = useCallback(async (productLegacyId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setCart((prev) => prev.filter((i) => i.product.id !== productLegacyId));
    } else {
      setCart((prev) => prev.map((i) => (i.product.id === productLegacyId ? { ...i, quantity: newQuantity } : i)));
    }
    if (user) {
      const uuidMap = await resolveProductUuids([productLegacyId]);
      const productUuid = uuidMap[productLegacyId];
      if (!productUuid) return;
      if (newQuantity < 1) {
        await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productUuid);
      } else {
        await supabase
          .from('cart_items')
          .upsert({ user_id: user.id, product_id: productUuid, quantity: newQuantity }, { onConflict: 'user_id,product_id' });
      }
    }
  }, [user]);

  const removeFromCart = useCallback((productLegacyId: string) => updateQuantity(productLegacyId, 0), [updateQuantity]);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [user]);

  return { cart, loading, addToCart, updateQuantity, removeFromCart, clearCart };
}

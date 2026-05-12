import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Syncs a localStorage wishlist (array of legacy product IDs) to the `wishlist` table
 * for logged-in users. Resolves legacy_id → products.id before writing.
 */
export function useWishlistSync(localKey = 'wishlist') {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(localKey);
    if (!raw) return;
    try {
      const ids: string[] = JSON.parse(raw);
      if (!Array.isArray(ids) || ids.length === 0) return;
      (async () => {
        const { data: products } = await supabase
          .from('products')
          .select('id, legacy_id')
          .in('legacy_id', ids);
        if (!products?.length) return;
        const rows = products.map(p => ({ user_id: user.id, product_id: p.id }));
        await supabase.from('wishlist').upsert(rows, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
      })();
    } catch {}
  }, [user, localKey]);
}

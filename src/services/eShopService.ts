import { Product, CartItem, Order, Discount } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { productDescriptions } from './productDescriptions';

// Helper: turn any string into url-friendly slug
export const slugify = (text: string) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Derive manufacturer from product name (catalog has no manufacturer column yet)
const deriveManufacturer = (name: string): string => {
  const tags: Array<[string, string]> = [
    ['LA Pharma', 'LA Pharma'],
    ['Balkan Pharma', 'Balkan Pharma'],
    ['Genesis', 'Genesis'],
    ['British Dragon', 'British Dragon'],
    ['Thaiger Pharma', 'Thaiger Pharma'],
    ['European Pharmaceutical', 'European Pharmaceutical'],
    ['Elite Pharm', 'Elite Pharm'],
    ['Magnus', 'Magnus'],
    ['March', 'March'],
    ['MAX PRO', 'MAX PRO'],
    ['Hubei', 'Hubei'],
    ['Bayer', 'Bayer'],
    ['Pfizer', 'Pfizer'],
    ['Hilma Biocare', 'Hilma Biocare'],
    ['Eurochem', 'Eurochem'],
  ];
  for (const [needle, label] of tags) {
    if (name.includes(needle)) return label;
  }
  return 'Generic Labs';
};

// Map a DB row to the FE Product shape (keeping legacy_id as id for cart/wishlist compatibility)
type ProductRow = {
  legacy_id: string | null;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  in_stock: boolean;
  categories?: { name: string } | null;
};

const mapRow = (row: ProductRow): Product => {
  const id = row.legacy_id || '';
  const description =
    row.description ||
    productDescriptions[id] ||
    `A high-quality ${row.categories?.name || 'product'} for elite performance.`;
  return {
    id,
    name: row.name,
    price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
    category: row.categories?.name || 'Uncategorized',
    description,
    imageUrl: row.image_url || '',
    inStock: row.in_stock,
    manufacturer: deriveManufacturer(row.name),
  };
};

const PRODUCT_SELECT = 'legacy_id,name,description,price,image_url,in_stock,categories(name)';

// In-memory caches for category/manufacturer lookup
let _categoryCache: { name: string; slug: string }[] | null = null;
let _manufacturerCache: string[] | null = null;

const getCategoryList = async () => {
  if (_categoryCache) return _categoryCache;
  const { data } = await supabase.from('categories').select('name,slug').order('name');
  _categoryCache = data || [];
  return _categoryCache;
};

const getManufacturerList = async (): Promise<string[]> => {
  if (_manufacturerCache) return _manufacturerCache;
  // Derive from product names
  const { data } = await supabase.from('products').select('name').eq('is_active', true).limit(1000);
  const set = new Set<string>();
  (data || []).forEach((p) => set.add(deriveManufacturer(p.name)));
  _manufacturerCache = Array.from(set).sort();
  return _manufacturerCache;
};

export const eShopService = {
  async fetchProductsByFilter({ type, value }: { type?: string; value?: string }): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .limit(1000);

    if (type === 'category' && value && value !== 'all') {
      const cats = await getCategoryList();
      const cat = cats.find((c) => c.slug === slugify(value));
      if (cat) {
        // Filter via inner relation
        const { data, error } = await supabase
          .from('products')
          .select(`${PRODUCT_SELECT}`)
          .eq('is_active', true)
          .eq('categories.slug', cat.slug)
          .limit(1000);
        if (error) console.error(error);
        return (data || [])
          .filter((p: any) => p.categories) // remove unmatched joins
          .map((p: any) => mapRow(p));
      }
      return [];
    }

    const { data, error } = await query;
    if (error) console.error(error);
    let products = (data || []).map((p: any) => mapRow(p));

    if (type === 'manufacturer' && value && value !== 'all') {
      const slug = slugify(value);
      products = products.filter((p) => slugify(p.manufacturer || '') === slug);
    }
    return products;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.trim();
    if (!q) return [];
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .limit(50);
    if (error) {
      console.error(error);
      return [];
    }
    return (data || []).map((p: any) => mapRow(p));
  },

  async findProduct(productName: string): Promise<Product | undefined> {
    if (!productName) return undefined;
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .ilike('name', productName)
      .maybeSingle();
    return data ? mapRow(data as any) : undefined;
  },

  async fetchProductById(id: string): Promise<Product | undefined> {
    if (!id) return undefined;
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('legacy_id', id)
      .maybeSingle();
    return data ? mapRow(data as any) : undefined;
  },

  async fetchProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .in('legacy_id', ids);
    return (data || []).map((p: any) => mapRow(p));
  },

  async fetchRelatedProducts(product: Product): Promise<Product[]> {
    const cats = await getCategoryList();
    const cat = cats.find((c) => c.name === product.category);
    if (!cat) return [];
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .eq('categories.slug', cat.slug)
      .neq('legacy_id', product.id)
      .limit(4);
    return (data || []).filter((p: any) => p.categories).map((p: any) => mapRow(p));
  },

  getDisplayTitle(type: 'category' | 'manufacturer', slug: string): string {
    // Synchronous fallback — list is loaded into cache asynchronously
    if (type === 'category' && _categoryCache) {
      const found = _categoryCache.find((c) => c.slug === slug);
      if (found) return found.name;
    }
    if (type === 'manufacturer' && _manufacturerCache) {
      const found = _manufacturerCache.find((m) => slugify(m) === slug);
      if (found) return found;
    }
    return slug;
  },

  async preloadDisplayLists() {
    await Promise.all([getCategoryList(), getManufacturerList()]);
  },

  async getCategories(): Promise<string[]> {
    const cats = await getCategoryList();
    return cats.map((c) => c.name);
  },

  async getManufacturers(): Promise<string[]> {
    return getManufacturerList();
  },

  async validateDiscountCode(
    code: string,
  ): Promise<{ success: boolean; message: string; discount?: Discount | null }> {
    const upper = code.trim().toUpperCase();
    if (!upper) return { success: false, message: 'Please enter a discount code.' };

    const { data, error } = await supabase
      .from('discount_codes')
      .select('code,percentage,active,expires_at,max_uses,uses_count')
      .eq('code', upper)
      .eq('active', true)
      .maybeSingle();

    if (error || !data) return { success: false, message: 'Invalid discount code.' };
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { success: false, message: 'This code has expired.' };
    }
    if (data.max_uses != null && data.uses_count >= data.max_uses) {
      return { success: false, message: 'This code has reached its usage limit.' };
    }
    return {
      success: true,
      message: `Discount ${upper} applied! (${data.percentage}% off)`,
      discount: { code: upper, percentage: Number(data.percentage) },
    };
  },

  async placeOrderInPrestaShop(
    cart: CartItem[],
    shippingAddress: string,
    discount: Discount | null,
  ): Promise<Order> {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) {
      throw new Error('You must be signed in to place an order.');
    }

    const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const total = discount ? subtotal * (1 - discount.percentage / 100) : subtotal;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        email: user.email || '',
        total,
        shipping_address: { raw: shippingAddress },
        discount_code: discount?.code ?? null,
        discount_percentage: discount?.percentage ?? null,
      })
      .select('id, order_number, created_at, status')
      .single();
    if (error || !order) throw new Error(error?.message || 'Failed to create order');

    const items = cart.map((i) => ({
      order_id: order.id,
      product_name: i.product.name,
      product_image: i.product.imageUrl,
      unit_price: i.product.price,
      quantity: i.quantity,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) console.error(itemsError);

    return {
      id: order.order_number,
      items: cart,
      total,
      shippingAddress,
      status: order.status as Order['status'],
      date: order.created_at,
      discountApplied: discount || undefined,
    };
  },

  async checkOrderStatus(orderId: string): Promise<Order | undefined> {
    const { data } = await supabase
      .from('orders')
      .select('id,order_number,total,status,created_at,shipping_address,discount_code,discount_percentage,order_items(*)')
      .ilike('order_number', `%${orderId}%`)
      .maybeSingle();
    if (!data) return undefined;
    return {
      id: data.order_number,
      items: (data.order_items || []).map((it: any) => ({
        product: {
          id: it.product_id || '',
          name: it.product_name,
          price: Number(it.unit_price),
          category: '',
          description: '',
          imageUrl: it.product_image || '',
          inStock: true,
        },
        quantity: it.quantity,
      })),
      total: Number(data.total),
      shippingAddress: (data.shipping_address as any)?.raw || '',
      status: data.status as Order['status'],
      date: data.created_at,
      discountApplied:
        data.discount_code && data.discount_percentage
          ? { code: data.discount_code, percentage: Number(data.discount_percentage) }
          : undefined,
    };
  },

  async fetchOrderHistory(): Promise<Order[]> {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return [];
    const { data } = await supabase
      .from('orders')
      .select('id,order_number,total,status,created_at,shipping_address,discount_code,discount_percentage,order_items(*)')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false });
    return (data || []).map((o: any) => ({
      id: o.order_number,
      items: (o.order_items || []).map((it: any) => ({
        product: {
          id: it.product_id || '',
          name: it.product_name,
          price: Number(it.unit_price),
          category: '',
          description: '',
          imageUrl: it.product_image || '',
          inStock: true,
        },
        quantity: it.quantity,
      })),
      total: Number(o.total),
      shippingAddress: (o.shipping_address as any)?.raw || '',
      status: o.status as Order['status'],
      date: o.created_at,
      discountApplied:
        o.discount_code && o.discount_percentage
          ? { code: o.discount_code, percentage: Number(o.discount_percentage) }
          : undefined,
    }));
  },

  async compareProductsFromPrestaShop(productNames: string[]): Promise<Product[]> {
    if (!productNames.length) return [];
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .in('name', productNames);
    return (data || []).map((p: any) => mapRow(p));
  },

  async modifyOrderInPrestaShop(
    _orderId: string,
    _action: 'cancel' | 'changeAddress',
    _newAddress?: string,
  ): Promise<{ success: boolean; message: string }> {
    return {
      success: false,
      message: 'Order modification from chat is temporarily disabled. Please contact support.',
    };
  },
};

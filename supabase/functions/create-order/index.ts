import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface OrderItemInput { legacy_id?: string; product_id?: string; quantity: number; }
interface Body {
  items: OrderItemInput[];
  shipping: { name: string; street: string; city: string; zip: string; country: string; phone?: string };
  shipping_method: string;
  shipping_cost: number;
  payment_method: "stripe" | "cod";
  discount_code?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
    const user = userData.user;

    const body = (await req.json()) as Body;
    if (!body?.items?.length) return json({ error: "Cart is empty" }, 400);

    const admin = createClient(supabaseUrl, service);

    // Resolve products
    const legacyIds = body.items.filter(i => i.legacy_id).map(i => i.legacy_id!);
    const productIds = body.items.filter(i => i.product_id).map(i => i.product_id!);
    const { data: products, error: prodErr } = await admin
      .from("products")
      .select("id, legacy_id, name, price, image_url, stock_quantity, in_stock")
      .or([
        legacyIds.length ? `legacy_id.in.(${legacyIds.map(s => `"${s}"`).join(",")})` : "",
        productIds.length ? `id.in.(${productIds.join(",")})` : "",
      ].filter(Boolean).join(","));
    if (prodErr) return json({ error: prodErr.message }, 500);

    let subtotal = 0;
    const orderItems: any[] = [];
    for (const it of body.items) {
      const p = products?.find(p => (it.product_id && p.id === it.product_id) || (it.legacy_id && p.legacy_id === it.legacy_id));
      if (!p) return json({ error: `Product not found: ${it.legacy_id || it.product_id}` }, 400);
      if (!p.in_stock || p.stock_quantity < it.quantity) return json({ error: `Out of stock: ${p.name}` }, 400);
      subtotal += Number(p.price) * it.quantity;
      orderItems.push({ product_id: p.id, product_name: p.name, product_image: p.image_url, unit_price: p.price, quantity: it.quantity });
    }

    // Validate discount
    let discountPct = 0;
    let discountCode: string | null = null;
    if (body.discount_code) {
      const { data: dc } = await admin.from("discount_codes").select("*").eq("code", body.discount_code).eq("active", true).maybeSingle();
      if (dc) {
        const expired = dc.expires_at && new Date(dc.expires_at) < new Date();
        const used = dc.max_uses && dc.uses_count >= dc.max_uses;
        if (!expired && !used) { discountPct = Number(dc.percentage); discountCode = dc.code; }
      }
    }
    const discountAmount = subtotal * (discountPct / 100);
    const total = subtotal - discountAmount + Number(body.shipping_cost || 0);

    const { data: order, error: orderErr } = await admin.from("orders").insert({
      user_id: user.id,
      email: user.email,
      total,
      subtotal,
      shipping_cost: body.shipping_cost,
      tax_amount: 0,
      currency: "EUR",
      status: "Pending",
      payment_method: body.payment_method,
      payment_status: body.payment_method === "cod" ? "pending" : "pending",
      shipping_address: body.shipping,
      shipping_name: body.shipping.name,
      shipping_street: body.shipping.street,
      shipping_city: body.shipping.city,
      shipping_zip: body.shipping.zip,
      shipping_country: body.shipping.country,
      shipping_phone: body.shipping.phone,
      shipping_method: body.shipping_method,
      discount_code: discountCode,
      discount_percentage: discountPct || null,
    }).select().single();
    if (orderErr) return json({ error: orderErr.message }, 500);

    const itemsToInsert = orderItems.map(o => ({ ...o, order_id: order.id }));
    const { error: itemsErr } = await admin.from("order_items").insert(itemsToInsert);
    if (itemsErr) return json({ error: itemsErr.message }, 500);

    if (discountCode) {
      const { data: cur } = await admin.from("discount_codes").select("uses_count").eq("code", discountCode).single();
      await admin.from("discount_codes").update({ uses_count: (cur?.uses_count || 0) + 1 }).eq("code", discountCode);
    }

    // Clear cart
    await admin.from("cart_items").delete().eq("user_id", user.id);

    return json({ order_id: order.id, total });
  } catch (e: any) {
    return json({ error: e.message || "Internal error" }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

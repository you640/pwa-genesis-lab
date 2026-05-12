import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") return json({ success: false, message: "Missing code" }, 400);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: dc } = await supabase.from("discount_codes").select("*").eq("code", code.toUpperCase()).eq("active", true).maybeSingle();
    if (!dc) return json({ success: false, message: "Invalid code" });
    if (dc.expires_at && new Date(dc.expires_at) < new Date()) return json({ success: false, message: "Code expired" });
    if (dc.max_uses && dc.uses_count >= dc.max_uses) return json({ success: false, message: "Code usage limit reached" });
    return json({ success: true, message: `${dc.percentage}% discount applied`, discount: { code: dc.code, percentage: Number(dc.percentage) } });
  } catch (e: any) {
    return json({ success: false, message: e.message }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

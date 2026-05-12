// Placeholder until Lovable Stripe payments are enabled.
// Once enabled, this will be replaced with a real Stripe Checkout Session creator.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return new Response(
    JSON.stringify({ error: "Stripe payments are not enabled yet. Please choose Cash on delivery or contact the admin." }),
    { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

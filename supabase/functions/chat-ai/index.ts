// Chat AI proxy via Lovable AI Gateway. Keeps the Gemini/tool-calling API
// key server-side so it is never bundled into the client.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface GeminiPart { text?: string }
interface GeminiContent { role: "user" | "model"; parts: GeminiPart[] }
interface FunctionDeclaration {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}
interface Body {
  prompt: string;
  history: GeminiContent[];
  tools: FunctionDeclaration[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI not configured" }, 500);

    const { prompt, history, tools } = (await req.json()) as Body;
    if (typeof prompt !== "string") return json({ error: "Invalid prompt" }, 400);

    const messages = [
      ...(history || []).map((h) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: (h.parts || []).map((p) => p.text || "").join(""),
      })),
      { role: "user", content: prompt },
    ];

    const openaiTools = (tools || []).map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description || "",
        parameters: t.parameters || { type: "object", properties: {} },
      },
    }));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: openaiTools.length ? openaiTools : undefined,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return json({ error: `AI upstream error: ${res.status}`, detail: txt.slice(0, 500) }, 502);
    }
    const data = await res.json();
    const choice = data?.choices?.[0]?.message;
    const text: string | null = choice?.content ? String(choice.content).trim() : null;
    const toolCalls = Array.isArray(choice?.tool_calls) ? choice.tool_calls : [];
    const functionCalls = toolCalls
      .filter((c: any) => c?.function?.name)
      .map((c: any) => {
        let args: any = {};
        try { args = c.function.arguments ? JSON.parse(c.function.arguments) : {}; } catch { args = {}; }
        return { name: c.function.name, args };
      });

    return json({ text, functionCalls: functionCalls.length ? functionCalls : null });
  } catch (e) {
    return json({ error: "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

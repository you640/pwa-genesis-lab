import { supabase } from "@/integrations/supabase/client";
import type { FunctionDeclaration, Content } from "@google/genai";

// All model calls run server-side via the `chat-ai` edge function so that the
// AI provider credentials are never exposed to the browser bundle.
export const geminiService = {
  generateFunctionCall: async (
    prompt: string,
    history: Content[],
    tools: FunctionDeclaration[],
  ): Promise<{ text: string | null; functionCalls: { name: string; args: any }[] | null }> => {
    try {
      const { data, error } = await supabase.functions.invoke("chat-ai", {
        body: { prompt, history, tools },
      });
      if (error) throw error;
      if (!data || (data as any).error) throw new Error((data as any)?.error || "AI error");
      return {
        text: (data as any).text ?? null,
        functionCalls: (data as any).functionCalls ?? null,
      };
    } catch (err) {
      console.error("Error calling chat-ai function:", err);
      throw new Error("The AI service failed to respond. Please try again.");
    }
  },
};

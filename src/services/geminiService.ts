import { GoogleGenAI, FunctionDeclaration, GenerateContentResponse, Content } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Lazily initialize the AI client to prevent app crash on load if API_KEY is missing.
// The key will be checked only when an API call is made.
let ai: GoogleGenAI | null = null;
const getAiClient = () => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

export const geminiService = {
  generateFunctionCall: async (
    prompt: string, 
    history: Content[],
    tools: FunctionDeclaration[]
  ): Promise<{ text: string | null, functionCalls: { name: string, args: any }[] | null }> => {
    
    const contents: Content[] = [...history, { role: 'user', parts: [{ text: prompt }] }];
    
    try {
      const client = getAiClient();
      const response: GenerateContentResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          tools: [{ functionDeclarations: tools }],
        },
      });

      const functionCalls = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        // Fix: The `FunctionCall` type from the SDK has an optional `name`, while our internal type requires it.
        // We filter out any function calls that are missing a name and map to the expected structure.
        // We also ensure `args` is an object to prevent crashes in consumer functions.
        const sanitizedFunctionCalls = functionCalls
          .filter(fc => fc.name)
          .map(fc => ({
            name: fc.name!,
            args: fc.args || {},
          }));

        if (sanitizedFunctionCalls.length > 0) {
          return { text: null, functionCalls: sanitizedFunctionCalls };
        }
      }
      
      const text = response.text ? response.text.trim() : null;
      return { text: text, functionCalls: null };

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Re-throw a standardized error to be caught by the UI layer
      throw new Error("The AI service failed to respond. Please try again.");
    }
  },
};

import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, PersonaType, Language } from "../types";

const processEnvApiKey = process.env.API_KEY;

// Schema definition for the response
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    associations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: {
            type: Type.STRING,
            description: "The creative associated word or concept in the target language.",
          },
          translation: {
            type: Type.STRING,
            description: "The English translation of the word (or original string if target is English).",
          },
        },
        required: ["word", "translation"],
      },
    },
  },
  required: ["associations"],
};

const getSystemInstruction = (persona: PersonaType, language: Language): string => {
  const langMap: Record<Language, string> = {
    'zh': 'Chinese (Simplified)',
    'en': 'English',
    'ja': 'Japanese'
  };
  const targetLang = langMap[language];

  let baseInstruction = "";
  switch (persona) {
    case 'creative': baseInstruction = "You are a surrealist artist. Provide abstract, wild, and non-obvious associations."; break;
    case 'logic': baseInstruction = "You are a scientist. Provide logical, structural, and causal associations."; break;
    case 'business': baseInstruction = "You are a product manager. Provide associations related to market, value, user needs, and monetization."; break;
    case 'poetic': baseInstruction = "You are a poet. Provide metaphorical, emotional, and sensory associations."; break;
    default: baseInstruction = "You are a brainstorming tool. Generate creative, divergent associations."; break;
  }

  return `${baseInstruction} IMPORTANT: All generated 'word' values MUST be in ${targetLang}.`;
};

export const fetchAssociations = async (word: string, persona: PersonaType = 'standard', language: Language = 'en', apiKey?: string): Promise<GeminiResponse> => {
  const key = apiKey || processEnvApiKey;
  if (!key) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey: key });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 6 to 8 associations for the word "${word}". 
      The output must include the word (in the target language defined in system instructions) and its English translation.`,
      config: {
        systemInstruction: getSystemInstruction(persona, language),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: persona === 'logic' ? 0.3 : 0.9,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text) as GeminiResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateCreativeProposal = async (keywords: string[], language: Language = 'en', apiKey?: string): Promise<string> => {
  const key = apiKey || processEnvApiKey;
  if (!key) return "API Key Missing";

  const ai = new GoogleGenAI({ apiKey: key });

  const langMap: Record<Language, string> = {
    'zh': 'Chinese',
    'en': 'English',
    'ja': 'Japanese'
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Combine these concepts into a unique creative concept: ${keywords.join(', ')}.
      Output Requirement: Language must be ${langMap[language]}. Format: "**Title**: Description". Tone: Insightful.`,
    });
    return response.text || "Unable to generate proposal.";
  } catch (error) {
    console.error("Proposal Generation Error:", error);
    return "Error generating proposal.";
  }
};

export const generateThumbnail = async (keyword: string, apiKey?: string): Promise<string | null> => {
  const key = apiKey || processEnvApiKey;
  if (!key) return null;
  const ai = new GoogleGenAI({ apiKey: key });

  try {
    // Using gemini-2.5-flash-image for image generation as per instructions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Minimalist, vector art style icon or illustration for the concept: ${keyword}. High contrast, clean lines, white background.` },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image Gen Error", e);
    return null;
  }
};

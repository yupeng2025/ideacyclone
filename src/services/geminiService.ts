import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { GeminiResponse, PersonaType, Language } from "../types";
import { AI_MODELS } from "../components/Modals/SettingsPanel";

const processEnvApiKey = process.env.API_KEY;

/**
 * API 响应 Schema 定义
 */
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
                    explanation: {
                        type: Type.STRING,
                        description: "A concise definition or explanation of the word in the target language (max 10 words). NO English translation.",
                    },
                },
                required: ["word", "explanation"],
            },
        },
    },
    required: ["associations"],
};

/**
 * 根据人格模式和语言生成系统指令
 * @param persona 人格模式
 * @param language 目标语言
 * @returns 系统指令字符串
 */
const getSystemInstruction = (persona: PersonaType, language: Language): string => {
    const langMap: Record<Language, string> = {
        'zh': 'Chinese (Simplified)',
        'en': 'English',
        'ja': 'Japanese'
    };
    const targetLang = langMap[language];

    let baseInstruction = "";
    switch (persona) {
        case 'creative':
            baseInstruction = "You are a Visionary Creative Director. Focus on lateral thinking, unexpected cross-domain connections, and disruptive innovation. Avoid clichés. Dig deeper into sub-genres, artistic movements, and avant-garde concepts.";
            break;
        case 'logic':
            baseInstruction = "You are a Chief Architect / Scientist. Deconstruct the concept using First Principles thinking. Focus on underlying mechanisms, structural dependencies, taxonomies, and theoretical frameworks. Avoid surface-level descriptions.";
            break;
        case 'business':
            baseInstruction = "You are a Strategy Consultant (MBB style). Focus on business models, competitive moats, value chains, go-to-market strategies, and economic levers. Use precise industry terminology. Avoid generic words like 'money' or 'sell'.";
            break;
        case 'poetic':
            baseInstruction = "You are a Literary Critic. Focus on nuanced imagery, emotional resonance, sensory details, and rhetorical devices. Explore the subtext and symbolic meaning. Avoid simple adjectives.";
            break;
        default:
            baseInstruction = "You are an Expert Domain Consultant. Your goal is to expand the user's thinking with high-value, professional, and specific associations. Avoid common, generic, or broad terms. Prioritize depth, specificity, and expert-level concepts.";
            break;
    }

    return `${baseInstruction} 
            CRITICAL INSTRUCTION: You MUST strictly output in ${targetLang}. 
            If the target language is NOT English, translate ALL concepts, terms, and explanations into ${targetLang}.
            Do NOT mix languages. Do NOT include original English terms in parentheses unless explicitly requested or if it's a proper noun/brand name without a translation.
            Ensuring the output is natural and native-sounding in ${targetLang}.`;
};

/**
 * Generic OpenAI-Compatible API Handler
 */
async function callOpenAIAPI(
    endpoint: string,
    apiKey: string,
    modelId: string,
    messages: any[],
    temperature: number,
    jsonMode: boolean = false,
    isOpenRouter: boolean = false
): Promise<any> {
    const body: any = {
        model: modelId,
        messages: messages,
        temperature: temperature,
    };
    if (jsonMode) {
        body.response_format = { type: "json_object" };
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    // OpenRouter 需要额外的头信息
    if (isOpenRouter) {
        headers['HTTP-Referer'] = 'https://ideacyclone.yuho-aigc.lsv.jp';
        headers['X-Title'] = 'IdeaCyclone';
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

const PROVIDER_ENDPOINTS: Record<string, string> = {
    'openai': 'https://api.openai.com/v1/chat/completions',
    'openrouter': 'https://openrouter.ai/api/v1/chat/completions',
    'github': 'https://models.inference.ai.azure.com/chat/completions',
    'groq': 'https://api.groq.com/openai/v1/chat/completions',
    'aliyun': 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    'deepseek': 'https://api.deepseek.com/chat/completions',
    'zhipu': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    'moonshot': 'https://api.moonshot.cn/v1/chat/completions'
};

/**
 * 获取关键词的联想词
 * @param word 输入关键词
 * @param persona 人格模式
 * @param language 目标语言
 * @param apiKey API 密钥
 * @param modelId 模型 ID
 * @returns 联想词列表
 */
export const fetchAssociations = async (
    word: string,
    persona: PersonaType = 'standard',
    language: Language = 'en',
    apiKey?: string,
    modelId: string = 'gemini-2.0-flash'
): Promise<GeminiResponse> => {
    const key = apiKey || processEnvApiKey;
    if (!key) throw new Error("API Key is missing.");

    // 判断 Provider
    const modelInfo = AI_MODELS.find(m => m.id === modelId);
    const provider = modelInfo?.provider || 'google';

    const targetLangMap = { 'zh': 'Chinese', 'en': 'English', 'ja': 'Japanese' };
    const targetLangName = targetLangMap[language];

    if (provider !== 'google') {
        const endpoint = PROVIDER_ENDPOINTS[provider];
        if (!endpoint) throw new Error(`Unknown provider: ${provider}`);

        const systemPrompt = getSystemInstruction(persona, language);

        const userPrompt = `Generate 6 to 8 associations for the word "${word}". 
        Output format: JSON with "associations" array. 
        CRITICAL: The output "word" and "explanation" MUST be strictly in ${targetLangName}.
        If the target language is ${targetLangName}, all content must be in ${targetLangName}.
        Do NOT output English unless the target language IS English.
        If you fail to follow the language rule, the response is invalid.`;

        try {
            const content = await callOpenAIAPI(
                endpoint,
                key,
                modelId,
                [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                persona === 'logic' ? 0.3 : 0.9,
                true, // JSON Mode
                provider === 'openrouter' // isOpenRouter
            );
            return JSON.parse(content) as GeminiResponse;
        } catch (error) {
            console.error(`${provider} API Error:`, error);
            throw error;
        }
    } else {
        // Google 调用逻辑 (原有逻辑)
        const ai = new GoogleGenAI({ apiKey: key });

        try {
            const response = await ai.models.generateContent({
                model: modelId,
                contents: `Generate 6 to 8 associations for the word "${word}". 
      CRITICAL: The output "word" and "explanation" MUST be strictly in ${targetLangName}.
      If the target language is ${targetLangName}, all content must be in ${targetLangName}.
      Do NOT output English unless the target language IS English.`,
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
    }
};

/**
 * 生成创意概念融合
 * @param keywords 关键词列表
 * @param language 目标语言
 * @param apiKey API 密钥
 * @param modelId 模型 ID
 * @returns 创意概念描述
 */
export const generateCreativeProposal = async (
    keywords: string[],
    language: Language = 'en',
    apiKey?: string,
    modelId: string = 'gemini-2.0-flash'
): Promise<string> => {
    const key = apiKey || processEnvApiKey;
    if (!key) return "API Key Missing";

    const langMap: Record<Language, string> = {
        'zh': 'Chinese',
        'en': 'English',
        'ja': 'Japanese'
    };

    // 判断 Provider
    const modelInfo = AI_MODELS.find(m => m.id === modelId);
    const provider = modelInfo?.provider || 'google';

    const userContent = `Synthesize these concepts into a coherent, innovative creative concept: ${keywords.join(', ')}.
      
      CRITICAL OUTPUT RULES:
      1. Language: STRICTLY ${langMap[language]}.
      2. Format: Use Markdown.
         - **Title**: Creative Concept Name
         - **Core Logic**: 3-4 bullet points explaining the mechanism. Concise and professional.
         - **Value/Application**: 1-2 bullet points on potential value.
      3. Tone: Professional, Dense, Logic-driven. Avoid fluff.
      4. Constraint: NO long paragraphs. Use clear, short bullet points.`;

    if (provider !== 'google') {
        const endpoint = PROVIDER_ENDPOINTS[provider];
        if (!endpoint) return "Error: Unknown Provider";

        try {
            return await callOpenAIAPI(
                endpoint,
                key,
                modelId,
                [{ role: 'user', content: userContent }],
                0.7
            ) || "Unable to generate proposal.";
        } catch (error) {
            console.error(`${provider} Proposal Error:`, error);
            return "Error generating proposal.";
        }
    } else {
        // Google 调用逻辑
        const ai = new GoogleGenAI({ apiKey: key });

        try {
            const response = await ai.models.generateContent({
                model: modelId,
                contents: [
                    { role: 'user', parts: [{ text: userContent }] }
                ],
                config: {
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE }
                    ]
                }
            });
            return response.text || "Unable to generate proposal.";
        } catch (error) {
            console.error("Proposal Generation Error:", error);
            // 尝试返回更详细的错误信息，帮助调试
            if (error instanceof Error) {
                return `Error: ${error.message}`;
            }
            return "Error generating proposal.";
        }
    }
};

/**
 * 生成缩略图
 * @param keyword 关键词
 * @param apiKey API 密钥
 * @returns Base64 图像数据或 null
 */
export const generateThumbnail = async (
    keyword: string,
    apiKey?: string
): Promise<string | null> => {
    const key = apiKey || processEnvApiKey;
    if (!key) return null;
    const ai = new GoogleGenAI({ apiKey: key });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: `Create a minimalist, high-quality illustration for the concept: "${keyword}". 
            Style: Clean vector art, modern design, vibrant colors, white or transparent background.
            The image should be visually striking and represent the concept clearly.`,
            config: {
                responseModalities: ['Text', 'Image'],
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ]
            }
        });

        // 检查响应中的图像数据
        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    return `data:${mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        console.warn("Image generation response did not contain image data:", response);
        return null;
    } catch (e) {
        console.error("Image Gen Error:", e);
        return null;
    }
};

/**
 * 生成全图摘要
 * @param content 需要总结的文本内容
 * @param language 目标语言
 * @param apiKey API 密钥
 * @param modelId 模型 ID
 * @returns 摘要文本
 */
export const generateSummary = async (
    content: string,
    language: Language = 'en',
    apiKey?: string,
    modelId: string = 'gemini-2.0-flash'
): Promise<string> => {
    const key = apiKey || processEnvApiKey;
    if (!key) return "API Key Missing";

    const langMap: Record<Language, string> = {
        'zh': 'Chinese (Simplified)',
        'en': 'English',
        'ja': 'Japanese'
    };

    // 判断 Provider
    const modelInfo = AI_MODELS.find(m => m.id === modelId);
    const provider = modelInfo?.provider || 'google';

    const systemPrompt = `You are an expert Strategic Consultant. Analyze the provided brainstorming keywords and concepts.
    
    CRITICAL OUTPUT RULES:
    1. Language: STRICTLY ${langMap[language]}.
    2. Format: Use Markdown.
       - **# Mind Map Strategic Summary** (or equivalent in target language)
       - **## Core Themes**: 3 bullet points synthezing the main clusters.
       - **## Key Insight**: 1 profound insight or pattern observed.
       - **## Actionable Direction**: 1 suggestion for next steps.
    3. Tone: Professional, High-level, Insightful. No fluff.`;

    const userPrompt = `Keywords: ${content}`;

    if (provider !== 'google') {
        const endpoint = PROVIDER_ENDPOINTS[provider];
        if (!endpoint) return "Error: Unknown Provider";

        try {
            return await callOpenAIAPI(
                endpoint,
                key,
                modelId,
                [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                0.7
            ) || "Unable to generate summary.";
        } catch (error) {
            console.error(`${provider} Summary Error:`, error);
            if (error instanceof Error) return `Error: ${error.message}`;
            return "Error generating summary.";
        }
    } else {
        // Google 调用逻辑
        const ai = new GoogleGenAI({ apiKey: key });

        try {
            const response = await ai.models.generateContent({
                model: modelId,
                contents: [
                    { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
                ],
                config: {
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE }
                    ]
                }
            });
            return response.text || "Unable to generate summary.";
        } catch (error) {
            console.error("Summary Generation Error:", error);
            if (error instanceof Error) return `Error: ${error.message}`;
            return "Error generating summary.";
        }
    }
};

/**
 * 解释名词概念
 * @param word 需要解释的名词
 * @param language 目标语言
 * @param apiKey API 密钥
 * @param modelId 模型 ID
 * @returns 解释文本
 */
export const generateExplanation = async (
    word: string,
    language: Language = 'en',
    apiKey?: string,
    modelId: string = 'gemini-2.0-flash'
): Promise<string> => {
    const key = apiKey || processEnvApiKey;
    if (!key) return "API Key Missing";

    const langMap: Record<Language, string> = {
        'zh': 'Chinese (Simplified)',
        'en': 'English',
        'ja': 'Japanese'
    };

    // 判断 Provider
    const modelInfo = AI_MODELS.find(m => m.id === modelId);
    const provider = modelInfo?.provider || 'google';

    const systemPrompt = `You are an expert tutor. Explain the concept clearly and concisely.
    Output Requirement: Provide a concise explanation (under 60 words) in ${langMap[language]}. Avoid jargon where possible.`;

    const userPrompt = `Explain the term: "${word}"`;

    if (provider !== 'google') {
        const endpoint = PROVIDER_ENDPOINTS[provider];
        if (!endpoint) return "Error: Unknown Provider";

        try {
            return await callOpenAIAPI(
                endpoint,
                key,
                modelId,
                [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                0.7
            ) || "Unable to generate explanation.";
        } catch (error) {
            console.error(`${provider} Explanation Error:`, error);
            if (error instanceof Error) return `Error: ${error.message}`;
            return "Error generating explanation.";
        }
    } else {
        // Google 调用逻辑
        const ai = new GoogleGenAI({ apiKey: key });

        try {
            const response = await ai.models.generateContent({
                model: modelId,
                contents: [
                    { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
                ],
                config: {
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE }
                    ]
                }
            });
            return response.text || "Unable to generate explanation.";
        } catch (error) {
            console.error("Explanation Generation Error:", error);
            if (error instanceof Error) return `Error: ${error.message}`;
            return "Error generating explanation.";
        }
    }
};

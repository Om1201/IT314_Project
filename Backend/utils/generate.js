import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const geminiModel = genAI.models.generateContent.bind(genAI.models);
export async function generateWithGemini(prompt, model = 'gemini-2.0-flash-001') {
    try {
        const response = await genAI.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate content with Gemini');
    }
}
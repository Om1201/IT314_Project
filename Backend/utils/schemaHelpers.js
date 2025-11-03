import { Type } from '@google/genai';
export function buildRoadmapSchema() {
    return {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedDuration: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            chapters: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.NUMBER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedTime: { type: Type.STRING },
                        subtopics: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.NUMBER },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    estimatedTime: { type: Type.STRING },
                                    completed: { type: Type.BOOLEAN },
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}

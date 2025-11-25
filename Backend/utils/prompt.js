export const getRoadmapPrompt = (topic) => {
  return `
Create a comprehensive learning roadmap for "${topic}". Return a JSON object with this exact structure:

{
  "title": "Learning ${topic}",
  "description": "Brief description of what the learner will achieve",
  "estimatedDuration": "X weeks/months",
  "difficulty": "Beginner/Intermediate/Advanced",
  "chapters": [
    {
      "id": 1,
      "title": "Chapter Title",
      "description": "What this chapter covers",
      "estimatedTime": "X hours",
      "subtopics": [
        {
          "id": 1,
          "title": "Subtopic Title",
          "description": "Brief description",
          "estimatedTime": "X minutes",
          "completed": false,
          "recommendedArticleSites": [
            "top-site1.org",
            "top-site2.com",
            "top-site3.dev"
            (Include popular sites like GFG, w3School and documentations first, if relevent)
          ],
          "detailedExplanation": "<remain this field empty string>"
        }
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Create 4-6 chapters maximum.
- Each chapter must have 3-5 subtopics.
- Progress from basic to advanced concepts.
- Make titles clear and specific.
- For EACH subtopic, you MUST populate the "recommendedArticleSites" field.
- Analyze the specific subtopic and provide the 2-3 most authoritative, high-quality domains for finding articles on that topic (e.g., "geeksforgeeks.org", "developer.mozilla.org", "react.dev", "martinfowler.com").
- The sites MUST be relevant to the subtopic. (e.g., for "React Hooks", "react.dev" is perfect).
- Do NOT include "youtube.com" in this list. This is for articles only.
- Do NOT invent domain names. Use real, well-known technical sources.

Return ONLY the valid JSON object, with no other text or explanation.
`;
}

export const quizPrompt = (roadMap, chapterId, subtopicId) => {

    const chapters = roadMap.roadmapData?.chapters || [];

    if (subtopicId) {
        // quiz for subtopic
        const chapter = chapters.find(ch => ch.id === chapterId);
        if (!chapter) throw new Error("Chapter not found");

        const subtopic = chapter.subtopics.find(st => st.id === subtopicId);
        if (!subtopic) throw new Error("Subtopic not found");

        return `
        You are an expert quiz generator.

        Generate a 5-question multiple-choice quiz for:
        Title: "${subtopic.title}"
        Description: "${subtopic.description}"

        Each question must have:
        - 4 MCQ options (a, b, c, d)
        - correctAnswer field
        - explanation field (3-4 lines)

        Return ONLY a JSON array.
      `;
    }

    // quiz for whole chapter
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) throw new Error("Chapter not found");

    const subtopics = chapter.subtopics || [];

    return `
    You are an expert educational quiz generator.

    Generate a quiz covering the chapter and its subtopics.

    Chapter Title: "${chapter.title}"
    Chapter Description: "${chapter.description}"

    Subtopics:
    ${subtopics.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join("\n")}

    Return ONLY JSON with:
    {
      "chapterTitle": "...",
      "totalQuestions": <number>,
      "quiz": [...]
    }
  `;
};


export const getSubtopicSummaryPrompt = (subtopic, roadmapTitle, chapterTitle, personalization) => {

  return `You are an expert tutor and technical writer. Your task is to generate a detailed summary for a specific technical subtopic.

---
**Context:**
* **Roadmap Title:** "${roadmapTitle}"
* **Chapter Title:** "${chapterTitle}"
* **Subtopic to Summarize:** "${subtopic}"
* **Personalization:** "${personalization}"
---

**Strict Instructions:**
1.  **Format:** The *entire* response MUST be in well-structured Markdown (MD) format.
2.  **Structure:** Use headings, subheadings, and bullet points to make the information clear and easy to read.
3.  **Content:** Explain the key concepts, core definitions, and the practical importance of this subtopic.
4.  **Tone:** Write in a clear, concise, and educational tone, as if explaining it to a curious student.
5.  **Constraints:**
    * Do NOT include any external links, advertisements, or recommendations for videos or articles.
    * Do NOT write a conversational intro or outro (e.g., "Certainly! Here is...", "I hope this helps!"). Start directly with the Markdown-formatted summary.
    * Keep the summary focused and ideally upto 1500 words.
6.  Generate the summary considering the following personalization from the user: "${personalization}".

**Begin the detailed summary for the subtopic "${subtopic}" now.**

Begin the summary now.`;
};

export const getAnalysePrompt = (code) => {
  return `You are an expert at analyzing code. You are given a piece of code to analyze its time and space complexity.

Code:
${code}

Your task:
1. If the code contains syntax errors or an infinite loop, explicitly mention it in the "compilationError" section.
2. Analyze the time and space complexity of the given code carefully.
3. Provide clear and detailed explanations for both.
4. Suggest optimizations if possible.


 Important Instructions:
- Respond in **ONLY** the JSON format shown below.
- Do **not** include any extra text, comments, or explanations outside of the JSON.

{
  "compilationError": <true | false>,
  "errorExplanation": "<Explain the syntax or logical issue if any>",

  "timeComplexity": "<Big O notation, e.g., O(n^2)>",
  "timeExplanation": "<Explain the reasoning behind the time complexity wiht reasonable details.>",
  
  "spaceComplexity": "<Big O notation, e.g., O(1)>",
  "spaceExplanation": "<Explain the reasoning behind the space complexity with reasonable details.>",

  "suggestions": "<Provide suggestions to optimize the code if possible. If no optimizations are possible, state 'No optimizations possible. (no suggestions)'>"
}`
};

export const getTitlePrompt = (userDescription) => {
  return `You are an AI chat assistant that ONLY answers technical, coding, software development, debugging, architecture, or programming-related questions.

  Given this user description or question: "${userDescription}".

  Rules:
  - If the question is technical/programming-related, generate a helpful answer.
  - If it is NOT related to coding or technology (but general talk is allowed), do NOT answer it directly. Instead:
      * Generate a generic technical title: "General Tech Query"
      * Tell them politely that you are only here to answer tech queries

  Tasks:
  1. Generate a concise and engaging title (max 5 words) summarizing the user's question ONLY if it is technical.
  2. Generate a helpful technical response ONLY if the question is technical.

  Respond strictly in the following JSON format (no extra text, no markdown, no explanations, no newlines):

  {
    "title": "<generated_title_here>",
    "response": "<ai_response_here>"
  }`;
}


export const getResponsePrompt = (userMessage, context) => {
  return `You are an AI chat assistant that ONLY answers technical, coding, software development, debugging, architecture, or programming-related messages.

  Given this user message: "${userMessage}".
  And some past conversation for context: "${context}".

  Rules:
  - If the user's message is technical/programming-related, generate a helpful technical response.
  - If the user's message is NOT technical or coding-related, do NOT answer it directly. Instead:
      * Politely tell them that you are only here to answer technical and programming-related queries.

  Additional guidelines:
  - Use the context only to craft a better answer, but NEVER mention the context explicitly.
  - Do NOT say things like "as previously discussed", "in our last conversation", or "according to the context".
  - JUST answer naturally within the allowed domain.

  Respond with only the final answer, no markdown, no extra formatting, no explanations.`;
}


export const getTopicGuardPrompt = (topic) => {
  return `
    You are a topic classifier for a programming education platform.
    The topic must be related to programming, software engineering, computer science, data science, or IT.
    
    Topic: "${topic}"
    
    Is this topic valid for a programming learning platform?
    Respond with only the single word "true" or "false".
  `;
};
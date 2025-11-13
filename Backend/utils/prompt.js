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
        - explanation field (3–4 lines)

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


export const getSubtopicSummaryPrompt = (subtopic, roadmapTitle, chapterTitle) => {

  return `You are an expert tutor and technical writer. Your task is to generate a detailed summary for a specific technical subtopic.

---
**Context:**
* **Roadmap Title:** "${roadmapTitle}"
* **Chapter Title:** "${chapterTitle}"
* **Subtopic to Summarize:** "${subtopic}"
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
}`
};

export const getTitlePrompt = (userDescription) => {
  return `You are an AI chat assistant.
  Given this user description or question: "${userDescription}".

  1. Generate a concise and engaging title (max 5 words) that summarizes the user's description/question.
  2. Generate a helpful and natural response to the user's description/question.

  Respond strictly in the following JSON format (no extra text, no markdown, no explanations, no newlines):

  {
    "title": "<generated_title_here>",
    "response": "<ai_response_here>"
  }`;
}


export const getResponsePrompt = (userMessage, context) => {
  return `You are an AI chat assistant.
  Given this user message: "${userMessage}".
  And this some last past conversation between you and user as context: "${context}". 
  Generate a helpful and natural response to the user's message considering the provided context.
  don't reply like this: "Given our previous back-and-forth or as the last thing we discussed was the or anything like as our conversation was...", you know the context is there, just use it to generate a better response. `;
}
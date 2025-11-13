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
    // Always access the real structure
    const chapters = roadMap.roadmapData?.chapters || [];

    if (subtopicId) {
        // quiz is for subtopic
        const chapter = chapters.find(ch => ch.id === chapterId);
        if (!chapter) throw new Error("Chapter not found");

        const subtopic = chapter.subtopics.find(st => st.id === subtopicId);
        if (!subtopic) throw new Error("Subtopic not found");

        return `You are an expert quiz generator.
      Generate a 5-question multiple-choice quiz for the topic:
      Title: "${subtopic.title}"
      Description: "${subtopic.description}"

      Each question should:
      - Be related to the topic and increase in difficulty from Q1 to Q5.
      - Have exactly **4 answer options (a, b, c, d)**.
      - Clearly specify the **correct answer**.
      - Include a short, clear **explanation** of why that answer is correct.

      Output must be a **valid JSON array** with the following structure:

      [
        {
          "questionId": 1,
          "question": "<question text>",
          "options": {
            "a": "<option A>",
            "b": "<option B>",
            "c": "<option C>",
            "d": "<option D>"
          },
          "correctAnswer": "a/b/c/d",
          "explanation": "<explanation text in detail>"
        }
      ]

      Only output the JSON array — no additional commentary.
      `;
    }
    else {
        // quiz is for whole chapter
        const chapter = chapters.find(ch => ch.id === chapterId);
        if (!chapter) throw new Error("Chapter not found");

        const subtopics = chapter.subtopics || [];

        return `You are an expert educational content creator and quiz generator.

Generate a comprehensive multiple-choice quiz for the chapter:

Chapter Title: "${chapter.title}"
Chapter Description: "${chapter.description}"

Subtopics:
${subtopics
            .map((s, i) => `${i + 1}. ${s.title}: ${s.description}`)
            .join("\n")}

Instructions:
- Create 3–4 questions per subtopic.
- Each question must include 4 options (a, b, c, d).
- Specify correct answer.
- Include an explanation.

Output Format:

{
  "chapterTitle": "${chapter.title}",
  "totalQuestions": <number>,
  "quiz": [
    {
      "subtopic": "<subtopic title>",
      "questions": [
        {
          "questionId": <number>,
          "question": "<question text>",
          "options": {
            "a": "<option A>",
            "b": "<option B>",
            "c": "<option C>",
            "d": "<option D>"
          },
          "correctAnswer": "a",
          "explanation": "<explanation>"
        }
      ]
    }
  ]
}

Return only the JSON.`;
    }
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
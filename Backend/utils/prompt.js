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
          ]
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


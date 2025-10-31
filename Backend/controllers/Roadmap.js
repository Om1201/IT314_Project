    import { GoogleGenAI } from "@google/genai";

    const genAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });

    export const geminiModel = genAI.models.generateContent.bind(genAI.models);

    export async function generateWithGemini(
      prompt,
      model = "gemini-2.0-flash-001"
    ) {
      try {
        const response = await genAI.models.generateContent({
          model,
          contents: prompt,
        });

        console.log(response.text);
        return response.text;
      } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate content with Gemini");
      }
    }

    export const generateRoadmap = async (req, res) => {
      try {
        const {userDescription, userLevel} = req.body;

        console.log("Generating roadmap for userDescription:", userDescription);
        const prompt = `
    Create a comprehensive learning roadmap based on the user's description "${userDescription}" and their current level "${userLevel}". Return a JSON object with this exact structure:
    
    {
      "title": "Learning <give very concise title accroding to the user description>",
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
              "completed": false
            }
          ]
        }
      ]
    }
    
    Requirements:
    - Create 4-6 chapters maximum
    - Each chapter should have 3-5 subtopics
    - Progress from basic to advanced concepts
    - Include practical, hands-on topics
    - Make titles clear and specific
    - Estimate realistic time requirements
    - Focus on the most important concepts according to the user's description: ${userDescription}
    
    Return only valid JSON, no additional text.
    `

        const response = await generateWithGemini(prompt);
        return res.status(200).json({ success: true, data: response });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    };

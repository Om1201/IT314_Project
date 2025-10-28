import { GoogleGenAI } from "@google/genai";
import { buildRoadmapSchema } from "../utils/schemaHelpers.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


// export const generateRoadmap = async (req, res) => {
//   try{
//     // console.log("Received roadmap generation request:", req.body);
//     const { description, level } = req.body;

//     // const prompt = `Create a comprehensive learning roadmap according to following user request:\n"${description}". \nAnd user is at ${level} level. \nReturn a JSON object with this exact structure:`;

//     // const schema = buildRoadmapSchema();
//     // const modelName = "gemini-2.5-pro";

//     // const generationConfig = {
//     //   responseMimeType: "application/json",
//     //   responseSchema: schema,
//     //   temperature: 0,
//     //   maxOutputTokens: 2000,
//     // }

//     // const response = await ai.models.generateContent({
//     //   model: modelName,
//     //   contents: prompt,
//     //   config: generationConfig,
//     // });

//     // // The generateContent result may include a parsed object or a string candidate.
//     // // Ensure we send an HTTP response to the client instead of returning from the function.
//     // console.log(response?.candidates?.[0]?.content);

//     // let parsed = null;
//     // if (response.parsed) {
//     //   parsed = response.parsed;
//     // } else if (response?.candidates?.[0]?.content) {
//     //   const content = response.candidates[0].content;
//     //   try {
//     //     parsed = JSON.parse(content);
//     //   } catch (e) {
//     //     // If content isn't strict JSON, return it as a string
//     //     parsed = content;
//     //   }
//     // }

//     // return res.status(200).json({ success: true, data: parsed });
    


    
//   }catch (error) {
//     console.error("Error generating roadmap:", error);
//     res.status(500).json({ error: "Failed to generate roadmap" });
//   }
// }

export const generateRoadmap = async (req, res) => {
  try {
    const { description, level } = req.body;

    const prompt = `Create a full learning roadmap for the user's request:
"${description}"
User level: ${level}

Return ONLY valid JSON (no explanation). The JSON MUST match this template exactly and must include:
- at least 6-8 chapters
- each chapter with id, title, description, estimatedTime
- each chapter must contain 3-5 subtopics (extend if needed) (each with id, title, description, estimatedTime, completed boolean)

Template (fill all keys; use empty arrays/strings if nothing applies):

{
  "title": "<string>",
  "description": "<string>",
  "estimatedDuration": "<string>",
  "difficulty": "<string>",
  "chapters": [
    {
      "id": 1,
      "title": "<string>",
      "description": "<string>",
      "estimatedTime": "<string>",
      "subtopics": [
        { "id": 1, "title": "<string>", "description": "<string>", "estimatedTime": "<string>", "completed": false }
      ]
    }
  ]
}

Do not include any commentary or fields outside this JSON.\n
AGAIN VERY IMPORTANT: Return ONLY valid JSON matching the template EXACTLY. No explanations, no extra text, no deviations, no missing fields, no omissions, no notes. STRICTLY follow the template.`;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ type: "text", text: prompt }],
      config: {
        response_schema: buildRoadmapSchema(),
        response_mime_type: "application/json",
        temperature: 0,
        // maxOutputTokens: 8000,
        candidateCount: 1
      }
    });
    // console.log(response.candidates[0].content);
    const raw = response.candidates[0].content;
    const cleaned = raw
  .replace(/```json/i, "")
  .replace(/```/g, "")
  .trim();

    // ✅ schema-enforced result is directly parsed
    return res.status(200).json({
      success: true,
      data: response.parsed
    });

  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
}

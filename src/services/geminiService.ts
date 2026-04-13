import { GoogleGenAI, Type } from "@google/genai";
import { ExamArchive } from "../types";

const SYSTEM_PROMPT = `Role: You are the Lead Data Ingestion Engineer for Longinsent Pro. Your goal is to transform messy, raw text from Indian competitive exam response sheets (SSC, UPSC, TNPSC, RRB) into a structured, production-ready JSON archive.

Objective: Extract every question, option, ID, and metadata point with 100% accuracy.

Formatting Rules:
1. Output ONLY valid JSON.
2. Metadata: Identify the exam name, state, and year from the text. If missing, use "Unknown".
3. Subject Mapping: Automatically categorize questions into subjects (e.g., Quantitative Aptitude, General Awareness, English, Reasoning).
4. Logic & Explanation:
    * Identify the Correct Answer based on your internal knowledge base.
    * Provide a clear English explanation.
    * Provide a Tanglish explanation (a natural mix of Tamil and English) that explains the logic simply for a student from rural Tamil Nadu.
5. IDs: Strictly extract Question ID and Option ID as they appear in the text.

Negative Constraints:
- NO Hallucinations: If an ID is missing, leave it as null.
- NO Formatting Errors: Ensure all quotes and braces are closed.
- NO Pure Tamil: Keep the Tamil in the "Tanglish" section conversational (how a friend would explain it).`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processExamText(rawText: string): Promise<ExamArchive> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: rawText,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          document_info: {
            type: Type.OBJECT,
            properties: {
              exam_name: { type: Type.STRING },
              exam_year: { type: Type.NUMBER },
              state: { type: Type.STRING },
              total_questions: { type: Type.NUMBER },
            },
            required: ["exam_name", "exam_year", "state", "total_questions"],
          },
          archive_data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                q_number: { type: Type.NUMBER },
                question_id: { type: Type.STRING, nullable: true },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                question_text: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, nullable: true },
                      text: { type: Type.STRING },
                      is_correct: { type: Type.BOOLEAN },
                    },
                    required: ["text", "is_correct"],
                  },
                },
                explanation: {
                  type: Type.OBJECT,
                  properties: {
                    english: { type: Type.STRING },
                    tanglish: { type: Type.STRING },
                  },
                  required: ["english", "tanglish"],
                },
              },
              required: ["q_number", "subject", "topic", "question_text", "options", "explanation"],
            },
          },
        },
        required: ["document_info", "archive_data"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as ExamArchive;
}

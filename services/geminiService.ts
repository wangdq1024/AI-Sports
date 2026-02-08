
import { GoogleGenAI } from "@google/genai";
import { SportProject } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// Initialize the Gemini API client using the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes sports video using Gemini 3 Pro model for complex biomechanical reasoning.
 * Returns an async generator that yields streaming commentary and finally a JSON report.
 */
// FIX: Changed return type from Promise<AsyncGenerator> to AsyncGenerator as async function* returns the generator directly.
export async function* analyzeSportsVideoStreaming(
  videoBase64: string,
  project: SportProject,
  mimeType: string
): AsyncGenerator<string, void, unknown> {
  // Use gemini-3-pro-preview for complex reasoning tasks like biomechanical analysis.
  const modelName = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    你是一名专业的中考体育教练和运动生物力学专家。
    请分析用户上传的${project}运动视频。
    
    任务流程：
    1. 首先，以专业教练的口吻，实时描述你看到的动作细节（例如：预摆幅度、起跳角度、核心发力状态等）。这部分请直接输出文本。
    2. 最后，提供一个 JSON 格式的总结报告，包含评分和具体建议。
    
    JSON 格式要求（必须放在代码块 \`\`\`json ... \`\`\` 中）：
    {
      "score": number, (0-100)
      "pros": string[],
      "cons": string[],
      "suggestions": string[],
      "overallEvaluation": string
    }
    
    语气要求：专业、严谨、多用体育术语，同时保持对学生的鼓励。
  `;

  // Use generateContentStream to provide real-time coaching feedback.
  const responseStream = await ai.models.generateContentStream({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: videoBase64,
          },
        },
        { text: `请开始对这组${project}动作进行流式实时分析。最后给出总结 JSON。` }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
    },
  });

  for await (const chunk of responseStream) {
    // FIX: Access .text property directly on the chunk (not a method call).
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}

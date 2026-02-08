
import { GoogleGenAI } from "@google/genai";
import { SportProject } from "../types";

/**
 * 使用 Gemini 3 Pro 模型分析运动视频，进行复杂的生物力学推理。
 * 返回一个异步生成器，产生流式点评及最后的 JSON 报告。
 */
export async function* analyzeSportsVideoStreaming(
  videoBase64: string,
  project: SportProject,
  mimeType: string
): AsyncGenerator<string, void, unknown> {
  // 在函数内部初始化，确保能够获取到注入的 API_KEY 并避免顶层初始化错误
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 使用 gemini-3-pro-preview 处理复杂的推理任务，如生物力学分析。
  const modelName = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    你是一名专业的中考体育教练和运动生物力学专家。
    请分析用户上传的${project}运动视频。
    
    任务流程：
    1. 首先，以专业教练的口吻，实时描述你看到的动作细节（例如：预摆幅度、起跳角度、核心发力状态等）。这部分请直接输出简体中文文本。
    2. 最后，提供一个 JSON 格式的总结报告，包含评分和具体建议。
    
    所有非 JSON 部分必须使用简体中文。
    
    JSON 格式要求（必须放在代码块 \`\`\`json ... \`\`\` 中）：
    {
      "score": number, (0-100)
      "pros": string[], (简体中文描述优点)
      "cons": string[], (简体中文描述不足)
      "suggestions": string[], (简体中文提供改进方案)
      "overallEvaluation": string (简体中文综合评价)
    }
    
    语气要求：专业、严谨、多用体育术语，同时保持对学生的鼓励。
  `;

  try {
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
          { text: `请开始对这组${project}动作进行流式实时分析。请务必使用简体中文回答。最后给出总结 JSON。` }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "分析过程中出错，请检查 API 配置或视频格式。";
  }
}

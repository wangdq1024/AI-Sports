
import { GoogleGenAI, Type } from "@google/genai";
import { SportProject, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: '动作规范分数 (0-100)',
    },
    pros: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '做得好的地方',
    },
    cons: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '存在的不足/扣分项',
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '具体的改进建议和训练方法',
    },
    overallEvaluation: {
      type: Type.STRING,
      description: '综合评价',
    }
  },
  required: ['score', 'pros', 'cons', 'suggestions', 'overallEvaluation'],
};

export async function analyzeSportsVideo(
  videoBase64: string,
  project: SportProject,
  mimeType: string
): Promise<AnalysisResult> {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    你是一名专业的中考体育教练和运动生物力学专家。
    请分析用户上传的${project}运动视频。
    
    分析维度：
    1. 准备阶段：站位、重心、预摆。
    2. 发力阶段：核心收紧、爆发力运用、发力顺序。
    3. 结束阶段：缓冲、落地稳健度、动作完整性。
    
    对比标准：请参照中国中考体育评分标准和专业运动员技术动作。
    
    输出要求：
    - 请给出具有专业性和针对性的评估。
    - 建议应包含具体的训练方法（如：深蹲跳练习、核心稳定性训练等）。
    - 语言要亲切、专业、鼓励性。
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: videoBase64,
          },
        },
        { text: `请对这个${project}的动作进行深度分析，并按照指定的JSON格式输出。` }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    },
  });

  const resultStr = response.text.trim();
  return JSON.parse(resultStr) as AnalysisResult;
}

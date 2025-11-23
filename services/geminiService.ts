import { GoogleGenAI, Type } from "@google/genai";
import { PlanResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateActionPlan = async (userInput: string): Promise<PlanResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `用户想要做这件事，但正在拖延：${userInput}。
      请作为一个温柔、有同理心的行动教练，把这个任务拆解成非常微小、容易执行的步骤（微习惯）。
      第一步必须非常简单（例如“放下手机”或“深呼吸”）。
      
      请返回JSON格式。
      Title: 给这个行动起一个简约清新的名字。
      Steps: 步骤列表。每个步骤包含 text (动作描述) 和 encouragement (对这个具体小步骤的鼓励，说明为什么它很简单)。
      OverallEncouragement: 一句温暖的总鼓励。
      语言必须是中文，风格治愈、清新、无压力。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  encouragement: { type: Type.STRING },
                },
                required: ["text", "encouragement"]
              }
            },
            overallEncouragement: { type: Type.STRING }
          },
          required: ["title", "steps", "overallEncouragement"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as PlanResponse;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const generateMotivationalImage = async (context: string): Promise<string | undefined> => {
  try {
    // Using flash-image for speed and efficiency on simple illustrations
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `Create a minimalist, zen-style, vector-like illustration for a task titled: "${context}". 
      Style: Soft pastel colors (sage green, beige, soft blue), clean lines, flat design, plenty of whitespace. 
      Mood: Calming, encouraging, fresh. No text in the image.`,
    });

    // Iterate through parts to find image data
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined; // Fail gracefully without crashing app
  }
};
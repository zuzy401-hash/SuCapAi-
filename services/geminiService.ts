
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

// Configuración mejorada para sesión de voz en español
export const startLiveVoiceSession = async (callbacks: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { 
          prebuiltVoiceConfig: { 
            voiceName: 'Puck' // Voz con tono profesional y creativo
          } 
        }
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      systemInstruction: 'Eres un director creativo de élite y asistente de IA en Visionary Creator Hub. Ayudas a los usuarios a refinar sus prompts visuales, entender teoría del diseño y organizar su flujo creativo. Responde en español de forma concisa, inspiradora y profesional. Si el usuario habla de creación visual, ofrece consejos técnicos específicos sobre composición, color e iluminación.'
    }
  });
};

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un asistente experto para creadores visuales. Responde siempre en español."
      }
    });
    return response.text || "Lo siento, no pude procesar eso.";
  } catch (error) {
    console.error("Error en Gemini API:", error);
    return "Error al conectar con el asistente de IA.";
  }
};

export const generateVisualContent = async (prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error en Generación Visual:", error);
    return null;
  }
};

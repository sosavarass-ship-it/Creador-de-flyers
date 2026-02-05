
import { GoogleGenAI, Type } from "@google/genai";
import { TargetAudience, Category, FlyerContent } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getFinancialTrends(target: TargetAudience): Promise<string> {
  const ai = getAI();
  const prompt = `Investiga las tendencias actuales en redes sociales (TikTok, Instagram, Facebook) sobre educación financiera específicamente para "${target}" en Argentina y Latinoamérica. 
  Identifica temas virales, ganchos (hooks) y qué tipo de contenido está funcionando mejor. 
  Resume los 3 hallazgos más importantes.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text || "Enfoque educativo clásico sobre ahorro e inversión.";
  } catch (error) {
    console.error("Error fetching trends:", error);
    return "Enfoque educativo clásico.";
  }
}

export async function generateFlyerContent(
  target: TargetAudience, 
  category: Category, 
  trends: string,
  userPrompt: string
): Promise<FlyerContent> {
  const ai = getAI();
  const prompt = `Eres un experto en marketing y finanzas para "Little Founders".
  Basado en estas tendencias: "${trends}".
  Pedido específico del usuario: "${userPrompt || 'Generar contenido educativo general'}".
  
  Crea contenido para un flyer publicitario para "${target}". 
  Categoría: "${category}". 
  
  REGLAS DE IDIOMA:
  - Usa CASTELLANO ARGENTINO (voseo obligatorio: ahorrá, tené, fijate, hacé).
  - Tono: Cercano, canchero pero educativo, muy profesional.
  - El "caption" debe ser un texto largo y persuasivo para el cuerpo de la publicación en redes.
  - Genera 5 hashtags locales y globales.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Título con voseo argentino' },
          description: { type: Type.STRING, description: 'Bajada corta y potente' },
          points: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: '3 puntos clave para el carrusel' 
          },
          callToAction: { type: Type.STRING, description: 'Cierre motivador' },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '5 hashtags'
          },
          caption: { type: Type.STRING, description: 'Texto extenso para el post de Instagram/Facebook/TikTok' }
        },
        required: ['title', 'description', 'points', 'callToAction', 'hashtags', 'caption']
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateFlyerImage(content: FlyerContent, target: TargetAudience): Promise<string | null> {
  const ai = getAI();
  const visualPrompt = `Modern 3D flat illustration for a children's finance brand called Little Founders. 
  Concept: ${content.title}. 
  Vibe: Argentine startup style, friendly, vibrant colors (Orange, Blue). 
  No text. Minimalist and clean.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: visualPrompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

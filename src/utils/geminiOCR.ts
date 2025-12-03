import { ApiKeyManager } from './apiKeyManager';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export interface GeminiOCRResult {
  originalText: string;
  translatedText: string;
  detectedLang: string;
}

/**
 * Convert file to base64 data (without data URL prefix)
 */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Call Gemini API with image
 */
const callGeminiAPI = async (prompt: string, file: File): Promise<string> => {
  const apiKey = await ApiKeyManager.getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please set it in Settings.');
  }

  const base64 = await fileToBase64(file);
  const mimeType = file.type || 'image/png';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64 } }
          ]
        }],
        generationConfig: { responseMimeType: 'application/json' }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API request failed');
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) {
    throw new Error('No response from Gemini API');
  }

  return rawText;
};

/**
 * Extract text only from image (for quick screen capture)
 */
export const extractTextFromImage = async (file: File): Promise<string | null> => {
  const prompt = `
  You are an expert OCR system.
  Extract ALL text from the provided image exactly as it appears.
  
  STRICTLY RETURN ONLY A VALID JSON OBJECT. NO MARKDOWN. NO CODE BLOCKS.
  Structure:
  {
      "extractedText": "..."
  }
  
  If no text is found, return:
  {
      "extractedText": ""
  }
  `;

  const rawText = await callGeminiAPI(prompt, file);

  try {
    const parsed = JSON.parse(rawText);
    return parsed.extractedText || null;
  } catch {
    return rawText.trim() || null;
  }
};

/**
 * Extract text and translate from image (for CTRL+V paste)
 */
export const extractAndTranslateFromImage = async (
  file: File,
  targetLang: string
): Promise<GeminiOCRResult> => {
  const prompt = `
  You are an expert OCR and translation system.
  1. Extract ALL text from the provided image exactly as it appears (originalText).
  2. Detect the language of the extracted text (detectedLang - ISO 639-1 code).
  3. Translate the extracted text to ${targetLang} (translatedText).

  STRICTLY RETURN ONLY A VALID JSON OBJECT. NO MARKDOWN. NO CODE BLOCKS.
  Structure:
  {
      "originalText": "...",
      "translatedText": "...",
      "detectedLang": "..."
  }
  `;

  const rawText = await callGeminiAPI(prompt, file);

  try {
    const parsed = JSON.parse(rawText);
    return {
      originalText: parsed.originalText || '',
      translatedText: parsed.translatedText || '',
      detectedLang: parsed.detectedLang || 'auto'
    };
  } catch {
    return {
      originalText: rawText,
      translatedText: '',
      detectedLang: 'auto'
    };
  }
};

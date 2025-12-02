import { ApiKeyManager } from './apiKeyManager';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

interface TextRegion {
    text: string;
    translatedText: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
}

interface TranslationResult {
    regions: TextRegion[];
    success: boolean;
    error?: string;
}

/**
 * Compress and convert image to base64
 * Max size: 1024x1024 to reduce API payload
 */
export async function imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas not supported'));
                return;
            }

            // Calculate new dimensions (max 1024px)
            const maxSize = 1024;
            let width = img.width;
            let height = img.height;

            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = (height / width) * maxSize;
                    width = maxSize;
                } else {
                    width = (width / height) * maxSize;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw compressed image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to base64 with quality 0.8
            const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
            resolve(base64);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Call Gemini API to detect and translate text in image
 */
export async function detectAndTranslateText(
    imageBase64: string,
    sourceLang: string = 'en',
    targetLang: string = 'vi'
): Promise<TranslationResult> {
    const apiKey = await ApiKeyManager.getApiKey();
    
    if (!apiKey) {
        return {
            success: false,
            error: 'API key not found. Please configure in Settings.',
            regions: [],
        };
    }

    const prompt = `You are an expert OCR and translation system. Analyze this image carefully and:

1. Detect ALL text regions in the image
2. For each text region, provide EXACT bounding box coordinates in pixels from the top-left corner
3. Translate text from ${sourceLang} to ${targetLang}
4. Estimate font size based on the height of the text

CRITICAL: Coordinates must be EXACT pixel positions where:
- x: distance from LEFT edge of image to LEFT edge of text
- y: distance from TOP edge of image to TOP edge of text  
- width: horizontal width of the text region
- height: vertical height of the text region

Return ONLY a valid JSON array (no markdown, no code blocks):
[
  {
    "text": "original text here",
    "translatedText": "translated text here",
    "x": 50,
    "y": 100,
    "width": 200,
    "height": 25,
    "fontSize": 18
  }
]

Rules:
- Return ONLY the JSON array
- All coordinates must be integers in pixels
- fontSize should be approximately 70-80% of height
- If no text found, return []`;

    // Retry logic for 503 errors
    let lastError: Error | null = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                {
                                    inline_data: {
                                        mime_type: 'image/jpeg',
                                        data: imageBase64,
                                    },
                                },
                            ],
                        }],
                        generationConfig: {
                            temperature: 0.1,
                            maxOutputTokens: 2048,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                
                // Retry on 503 (Service Unavailable)
                if (response.status === 503 && attempt < maxRetries) {
                    console.log(`Attempt ${attempt} failed with 503, retrying...`);
                    await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
                    continue;
                }
                
                throw new Error(`API error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textContent) {
                throw new Error('No response from Gemini');
            }

            // Parse JSON from response
            const jsonMatch = textContent.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response');
            }

            const regions: TextRegion[] = JSON.parse(jsonMatch[0]);

            return {
                success: true,
                regions,
            };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            
            // Don't retry on non-503 errors
            if (!lastError.message.includes('503')) {
                break;
            }
        }
    }

    // All retries failed
    console.error('Translation error after retries:', lastError);
    return {
        success: false,
        error: lastError?.message || 'Unknown error',
        regions: [],
    };
}

/**
 * Draw translated text on canvas with semi-transparent background
 */
export async function replaceTextInImage(
    imageFile: File,
    regions: TextRegion[]
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas not supported'));
                return;
            }

            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Process each text region
            regions.forEach((region) => {
                // Add padding to background for better coverage
                const padding = 2;
                const bgX = Math.max(0, region.x - padding);
                const bgY = Math.max(0, region.y - padding);
                const bgWidth = Math.min(canvas.width - bgX, region.width + padding * 2);
                const bgHeight = Math.min(canvas.height - bgY, region.height + padding * 2);

                // Draw semi-transparent background to cover original text
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

                // Setup text style
                const fontSize = Math.max(10, Math.floor(region.fontSize * 0.85));
                ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
                ctx.fillStyle = '#1a1a1a';
                ctx.textBaseline = 'top'; // Align from top
                ctx.textAlign = 'left'; // Align from left

                // Draw text from top-left of region (no centering)
                const textX = region.x;
                const textY = region.y;

                // Draw translated text
                ctx.fillText(region.translatedText, textX, textY);
            });

            // Convert canvas to data URL
            const resultImage = canvas.toDataURL('image/png');
            resolve(resultImage);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(imageFile);
    });
}

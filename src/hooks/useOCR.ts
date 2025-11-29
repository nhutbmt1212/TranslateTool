import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useOCR = () => {
    const { t } = useTranslation();
    const [isProcessingOCR, setIsProcessingOCR] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [ocrError, setOcrError] = useState<string | null>(null);

    const convertFileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const recognizeWithGemini = async (file: File): Promise<string> => {
        const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
        if (!GEMINI_API_KEY) {
            throw new Error(t('errors.missingGeminiKey'));
        }

        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const mimeType = file.type || 'image/png';
        const GEMINI_MODEL = 'gemini-2.5-flash-lite';

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: 'Extract all text from this image. Return only the text content, no explanations or additional text.'
                                },
                                {
                                    inline_data: {
                                        mime_type: mimeType,
                                        data: base64
                                    }
                                }
                            ]
                        }
                    ]
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || t('errors.translationRequestFailed'));
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return '';
        }

        return text.trim();
    };

    const processImage = async (
        file: File,
        onSuccess: (text: string) => void
    ) => {
        if (!file.type.startsWith('image/')) {
            setOcrError(t('errors.invalidImageFile'));
            return;
        }

        const base64DataUrl = await convertFileToBase64(file);
        setImagePreview(base64DataUrl);
        setIsProcessingOCR(true);
        setOcrError(null);

        try {
            const text = await recognizeWithGemini(file);
            const cleanedText = text.trim();

            if (cleanedText) {
                setImagePreview(null);
                onSuccess(cleanedText);
            } else {
                setOcrError(t('errors.noTextFoundInImage'));
            }
        } catch (err) {
            setOcrError(err instanceof Error ? err.message : t('errors.ocrFailure'));
        } finally {
            setIsProcessingOCR(false);
        }
    };

    return {
        isProcessingOCR,
        imagePreview,
        ocrError,
        setImagePreview,
        setOcrError,
        processImage,
    };
};

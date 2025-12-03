import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Languages } from '../types/languages';
import { ApiKeyManager } from '../utils/apiKeyManager';

interface TranslationResult {
    translatedText: string;
    detectedLang: string;
}

export const useTranslationLogic = (
    languages: Languages,
    sourceLang: string,
    targetLang: string,
    setSourceLang: (lang: string) => void,
    setTargetLang: (lang: string) => void,
    setDetectedLang: (lang: string) => void,
    setOutputText: (text: string) => void
) => {
    const { t } = useTranslation();
    const [isTranslating, setIsTranslating] = useState(false);

    const translateWithGemini = async (
        text: string,
        targetLangCode: string,
        targetLabel: string,
        sourceLangCode?: string
    ): Promise<TranslationResult> => {
        const GEMINI_API_KEY = await ApiKeyManager.getApiKey();
        if (!GEMINI_API_KEY) {
            throw new Error(t('errors.missingGeminiKey') || 'Please configure your API key in Settings');
        }

        const GEMINI_MODEL = 'gemini-2.5-flash-lite';
        const sourceInstruction = sourceLangCode
            ? `The source text is in language code: ${sourceLangCode}.`
            : 'Automatically detect the source language and return its ISO 639-1 code.';

        const prompt = `You are a professional translator.

Task: Translate the following text to ${targetLabel} (ISO code: ${targetLangCode}).
${sourceInstruction}

IMPORTANT RULES:
1. ONLY translate the text content, do NOT translate language names or codes
2. Preserve the original meaning and tone
3. Return ONLY a valid JSON object with NO markdown, NO code blocks, NO extra text

Required JSON structure:
{
  "detectedLang": "source_language_iso_code",
  "translatedText": "your_translation_here"
}

Text to translate:
${JSON.stringify(text)}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json().catch(() => undefined);
            throw new Error(error?.error?.message || t('errors.translationRequestFailed'));
        }

        const data = await response.json();
        const rawText = (data.candidates?.[0]?.content?.parts || [])
            .map((part: { text?: string }) => part.text ?? '')
            .join('\n')
            .trim();

        if (!rawText) {
            throw new Error(t('errors.noResponse'));
        }

        let cleaned = rawText.replace(/```json|```/g, '').trim();
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        let parsed: { translatedText?: string; detectedLang?: string };
        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {

            throw new Error(t('errors.invalidTranslationResponse'));
        }

        if (!parsed.translatedText) {
            throw new Error(t('errors.noTranslationOutput'));
        }

        return {
            translatedText: parsed.translatedText.trim(),
            detectedLang: parsed.detectedLang?.trim() || sourceLangCode || 'auto',
        };
    };

    const handleTranslate = async (inputText: string, textOverride?: string) => {
        const textToTranslate = (textOverride ?? inputText).trim();

        if (!textToTranslate) {
            toast.error(t('errors.inputRequired'));
            return;
        }

        if (textOverride) {
            setSourceLang('auto');
        }

        setIsTranslating(true);
        setOutputText('');

        try {
            let currentTarget = targetLang;
            let targetLabel = languages[currentTarget] || currentTarget;

            const sourceToUse = textOverride ? undefined : (sourceLang === 'auto' ? undefined : sourceLang);

            let { translatedText, detectedLang: detected } = await translateWithGemini(
                textToTranslate,
                currentTarget,
                targetLabel,
                sourceToUse
            );

            const detectedCode = detected || 'auto';

            if (detectedCode !== 'auto') {
                if (!textOverride) {
                    setSourceLang(detectedCode);
                }

                if (detectedCode === currentTarget) {
                    const defaultTarget = 'en';
                    if (currentTarget !== defaultTarget) {
                        currentTarget = defaultTarget;
                        targetLabel = languages[currentTarget] || currentTarget;
                        
                        // Update target language immediately
                        setTargetLang(currentTarget);
                        
                        // Also persist to localStorage immediately
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('app-target-lang', currentTarget);
                        }

                        const retryResult = await translateWithGemini(
                            textToTranslate,
                            currentTarget,
                            targetLabel,
                            detectedCode
                        );
                        translatedText = retryResult.translatedText;
                    }
                }
            }

            setOutputText(translatedText);
            setDetectedLang(detectedCode);

        } catch (err) {
            toast.error(err instanceof Error ? err.message : t('errors.unknown'));
        } finally {
            setIsTranslating(false);
        }
    };

    return {
        isTranslating,
        handleTranslate,
    };
};

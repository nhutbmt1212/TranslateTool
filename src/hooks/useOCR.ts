import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { extractAndTranslateFromImage, GeminiOCRResult } from '../utils/geminiOCR';

export type OCRResult = GeminiOCRResult;

const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

export const useOCR = () => {
    const { t } = useTranslation();
    const [isProcessingOCR, setIsProcessingOCR] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);

    const startCountdown = () => {
        setCountdown(4);
        let remaining = 4;
        const interval = setInterval(() => {
            remaining -= 1;
            setCountdown(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                setImagePreview(null);
                setCountdown(null);
            }
        }, 1000);
    };

    const processImage = async (
        file: File,
        targetLang: string,
        onSuccess: (result: OCRResult) => void
    ) => {
        if (!file.type.startsWith('image/')) {
            toast.error(t('errors.invalidImageFile'));
            return;
        }

        const base64DataUrl = await convertFileToBase64(file);
        setImagePreview(base64DataUrl);
        setIsProcessingOCR(true);

        try {
            const result = await extractAndTranslateFromImage(file, targetLang);

            if (result.originalText) {
                setImagePreview(null);
                setCountdown(null);
                onSuccess(result);
            } else {
                toast.error(t('errors.noTextFoundInImage'));
                startCountdown();
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : t('errors.ocrFailure'));
            startCountdown();
        } finally {
            setIsProcessingOCR(false);
        }
    };

    return {
        isProcessingOCR,
        imagePreview,
        setImagePreview,
        processImage,
        countdown,
    };
};

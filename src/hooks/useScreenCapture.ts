import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { extractTextFromImage } from '../utils/geminiOCR';

interface UseScreenCaptureReturn {
  isCapturing: boolean;
  captureScreen: () => Promise<string | null>;
  error: string | null;
}

export const useScreenCapture = (): UseScreenCaptureReturn => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureScreen = useCallback(async (): Promise<string | null> => {
    if (isCapturing) {
      return null;
    }

    try {
      setIsCapturing(true);
      setError(null);

      // Check if screen capture API is available
      if (typeof window === 'undefined' || !window.electronAPI?.screenCapture) {
        throw new Error('Screen capture API not available');
      }

      // Show loading toast
      const loadingToast = toast.loading('Select region to translate...');
      
      try {
        // Use desktop selection overlay
        const imageBuffer = await window.electronAPI.screenCapture.selectDesktopRegion();
        toast.dismiss(loadingToast);
        
        if (!imageBuffer) {
          // User cancelled selection
          toast('Selection cancelled', { icon: '❌' });
          return null;
        }

        // Show processing toast
        const processingToast = toast.loading('Processing image...');
        
        try {
          // Convert buffer to blob and create file for OCR
          const uint8Array = new Uint8Array(imageBuffer);
          const blob = new Blob([uint8Array], { type: 'image/png' });
          const file = new File([blob], 'screen-capture.png', { type: 'image/png' });
          
          // Use shared Gemini OCR utility
          const extractedText = await extractTextFromImage(file);
          
          toast.dismiss(processingToast);
          
          if (extractedText && extractedText.trim()) {
            toast.success('Text extracted and ready to translate!');
            return extractedText;
          } else {
            toast.error('No text found in the selected region');
            return null;
          }
        } catch (processingError) {
          toast.dismiss(processingToast);
          throw processingError;
        }
      } catch (selectionError) {
        toast.dismiss(loadingToast);
        throw selectionError;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to capture and process image';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  return {
    isCapturing,
    captureScreen,
    error,
  };
};

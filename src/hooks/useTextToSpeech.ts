import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { responsiveVoiceTTS, languageToTTSCode } from '../utils/responsiveVoiceTTS';

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  speak: (text: string, language: string) => Promise<void>;
  triggerTTS: (text: string, sourceLang: string, detectedLang: string) => Promise<void>;
  stopTTS: () => void;
}

/**
 * Custom hook để quản lý Text-To-Speech functionality
 * - Quản lý speaking state
 * - Handle TTS API calls với error handling
 * - Cung cấp functions để start/stop TTS
 * - Hỗ trợ cả simple speak và auto-detect language
 */
export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const stopTTS = useCallback(() => {
    responsiveVoiceTTS.stop();
    setIsSpeaking(false);
  }, []);

  // Simple speak function cho TargetPanel
  const speak = useCallback(async (text: string, language: string) => {
    if (!text) return;

    if (isSpeaking) {
      stopTTS();
      return;
    }

    setIsSpeaking(true);
    
    try {
      const ttsLang = languageToTTSCode[language] || language;
      await responsiveVoiceTTS.speak(text, ttsLang);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSpeaking(false);
    }
  }, [isSpeaking, stopTTS]);

  // Advanced triggerTTS function cho SourcePanel với auto-detect
  const triggerTTS = useCallback(async (text: string, sourceLang: string, detectedLang: string) => {
    if (!text) return;

    if (isSpeaking) {
      stopTTS();
      return;
    }

    setIsSpeaking(true);
    
    try {
      const langToSpeak = sourceLang === 'auto' ? detectedLang : sourceLang;
      const ttsLang = languageToTTSCode[langToSpeak] || langToSpeak;
      await responsiveVoiceTTS.speak(text, ttsLang);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSpeaking(false);
    }
  }, [isSpeaking, stopTTS]);

  return {
    isSpeaking,
    speak,
    triggerTTS,
    stopTTS,
  };
};
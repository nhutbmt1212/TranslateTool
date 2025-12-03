/**
 * ResponsiveVoice TTS Service
 * Free: 5000 requests/day
 * 51 languages supported
 */

declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options?: any) => void;
      cancel: () => void;
      isPlaying: () => boolean;
      voiceSupport: () => boolean;
    };
  }
}

// Voice mapping - ResponsiveVoice complete list (prefer Female, fallback to Male)
const VOICE_MAP: Record<string, string> = {
  // English
  'en-GB': 'UK English Female',
  'en-US': 'US English Female',
  'en-AU': 'Australian Female',
  
  // European Languages
  'es-ES': 'Spanish Female',
  'es-MX': 'Spanish Latin American Female',
  'fr-FR': 'French Female',
  'de-DE': 'German Female',
  'it-IT': 'Italian Female',
  'el-GR': 'Greek Female',
  'hu-HU': 'Hungarian Female',
  'tr-TR': 'Turkish Female',
  'ru-RU': 'Russian Female',
  'nl-NL': 'Dutch Female',
  'sv-SE': 'Swedish Female',
  'no-NO': 'Norwegian Female',
  'pl-PL': 'Polish Female',
  'fi-FI': 'Finnish Female',
  'cs-CZ': 'Czech Female',
  'da-DK': 'Danish Female',
  'sk-SK': 'Slovak Female',
  'pt-PT': 'Portuguese Female',
  'pt-BR': 'Brazilian Portuguese Female',
  'ro-RO': 'Romanian Female',
  'hr-HR': 'Croatian Female',
  'bs-BA': 'Bosnian Female',
  'sr-RS': 'Serbian Female',
  
  // Asian Languages
  'ja-JP': 'Japanese Female',
  'ko-KR': 'Korean Female',
  'zh-CN': 'Chinese Female',
  'zh-HK': 'Chinese (Hong Kong) Female',
  'zh-TW': 'Chinese Taiwan Female',
  'hi-IN': 'Hindi Female',
  'id-ID': 'Indonesian Female',
  'th-TH': 'Thai Female',
  'vi-VN': 'Vietnamese Female',
  
  // Languages with Male only (no Female available)
  'sq-AL': 'Albanian Male',
  'ar-SA': 'Arabic Female', // Has Female
  'hy-AM': 'Armenian Male',
  'ca-ES': 'Catalan Male',
  'eo': 'Esperanto Male',
  'is-IS': 'Icelandic Male',
  'la': 'Latin Female',
  'lv-LV': 'Latvian Male',
  'mk-MK': 'Macedonian Male',
  'mo': 'Moldavian Male',
  'me': 'Montenegrin Male',
  'sw-KE': 'Swahili Male',
  'ta-IN': 'Tamil Male',
  'cy-GB': 'Welsh Male',
  'af-ZA': 'Afrikaans Male',
};

class ResponsiveVoiceTTSService {
  /**
   * Check if ResponsiveVoice is loaded
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           window.responsiveVoice && 
           window.responsiveVoice.voiceSupport();
  }

  /**
   * Speak text
   */
  speak(text: string, langCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('ResponsiveVoice not loaded'));
        return;
      }

      const voice = VOICE_MAP[langCode];
      
      if (!voice) {
        reject(new Error(`Language "${langCode}" is not supported for text-to-speech`));
        return;
      }

      try {
        window.responsiveVoice.speak(text, voice, {
          onend: () => resolve(),
          onerror: (error: any) => reject(error),
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.isSupported()) {
      window.responsiveVoice.cancel();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.isSupported() && window.responsiveVoice.isPlaying();
  }
}

export const responsiveVoiceTTS = new ResponsiveVoiceTTSService();

// Language code mapping (ISO 639-1 to full locale)
export const languageToTTSCode: Record<string, string> = {
  'en': 'en-US',
  'vi': 'vi-VN',
  'zh': 'zh-CN',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'es': 'es-ES',
  'it': 'it-IT',
  'pt': 'pt-BR',
  'ru': 'ru-RU',
  'ar': 'ar-SA',
  'hi': 'hi-IN',
  'th': 'th-TH',
  'id': 'id-ID',
  'tr': 'tr-TR',
  'pl': 'pl-PL',
  'nl': 'nl-NL',
  'sv': 'sv-SE',
  'tl': 'tl-PH', // Tagalog/Filipino
  'ta': 'ta-IN', // Tamil
  'bn': 'bn-IN', // Bengali
  'da': 'da-DK', // Danish
  'no': 'no-NO', // Norwegian
  'fi': 'fi-FI', // Finnish
  'cs': 'cs-CZ', // Czech
  'el': 'el-GR', // Greek
  'he': 'he-IL', // Hebrew
  'hu': 'hu-HU', // Hungarian
  'ro': 'ro-RO', // Romanian
  'sk': 'sk-SK', // Slovak
  'uk': 'uk-UA', // Ukrainian
  'af': 'af-ZA', // Afrikaans
  'sq': 'sq-AL', // Albanian
  'hy': 'hy-AM', // Armenian
  'ca': 'ca-ES', // Catalan
  'hr': 'hr-HR', // Croatian
  'is': 'is-IS', // Icelandic
  'lv': 'lv-LV', // Latvian
  'mk': 'mk-MK', // Macedonian
  'sr': 'sr-RS', // Serbian
  'sw': 'sw-KE', // Swahili
  'cy': 'cy-GB', // Welsh
};

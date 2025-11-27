import { translate as googleTranslate } from '@vitalets/google-translate-api';

export interface TranslationResult {
  text: string;
  from: string;
  to: string;
  originalText: string;
}

export class Translator {
  /**
   * Dịch văn bản từ ngôn ngữ này sang ngôn ngữ khác
   * @param text - Văn bản cần dịch
   * @param targetLang - Ngôn ngữ đích (mã ISO 639-1, ví dụ: 'en', 'vi', 'ja')
   * @param sourceLang - Ngôn ngữ nguồn (tự động phát hiện nếu không chỉ định)
   * @returns Kết quả dịch
   */
  async translate(
    text: string,
    targetLang: string = 'en',
    sourceLang?: string
  ): Promise<TranslationResult> {
    try {
      const result = await googleTranslate(text, {
        to: targetLang,
        from: sourceLang,
      });

      // Xử lý cấu trúc response từ API
      let detectedLang = 'auto';
      // Kiểm tra xem result có property 'from' không
      const resultAny = result as any;
      if (resultAny.from) {
        if (typeof resultAny.from === 'string') {
          detectedLang = resultAny.from;
        } else if (resultAny.from.language?.iso) {
          detectedLang = resultAny.from.language.iso;
        } else if (resultAny.from.text?.value) {
          // Một số phiên bản API trả về dạng khác
          detectedLang = resultAny.from.text.value;
        }
      }

      return {
        text: result.text,
        from: detectedLang,
        to: targetLang,
        originalText: text,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi dịch thuật: ${error.message}`);
      }
      throw new Error('Lỗi dịch thuật không xác định');
    }
  }

  /**
   * Dịch nhiều đoạn văn bản cùng lúc
   * @param texts - Mảng các văn bản cần dịch
   * @param targetLang - Ngôn ngữ đích
   * @param sourceLang - Ngôn ngữ nguồn
   * @returns Mảng kết quả dịch
   */
  async translateBatch(
    texts: string[],
    targetLang: string = 'en',
    sourceLang?: string
  ): Promise<TranslationResult[]> {
    const promises = texts.map((text) =>
      this.translate(text, targetLang, sourceLang)
    );
    return Promise.all(promises);
  }

  /**
   * Lấy danh sách các ngôn ngữ được hỗ trợ
   */
  getSupportedLanguages(): Record<string, string> {
    return {
      'vi': 'Tiếng Việt',
      'en': 'English',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어',
      'fr': 'Français',
      'de': 'Deutsch',
      'es': 'Español',
      'pt': 'Português',
      'ru': 'Русский',
      'ar': 'العربية',
      'th': 'ไทย',
      'id': 'Bahasa Indonesia',
      'ms': 'Bahasa Melayu',
    };
  }
}


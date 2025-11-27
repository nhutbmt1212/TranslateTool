import { translate as googleTranslate } from '@vitalets/google-translate-api';
export class Translator {
    /**
     * Dịch văn bản từ ngôn ngữ này sang ngôn ngữ khác
     * @param text - Văn bản cần dịch
     * @param targetLang - Ngôn ngữ đích (mã ISO 639-1, ví dụ: 'en', 'vi', 'ja')
     * @param sourceLang - Ngôn ngữ nguồn (tự động phát hiện nếu không chỉ định)
     * @returns Kết quả dịch
     */
    async translate(text, targetLang = 'en', sourceLang) {
        try {
            const result = await googleTranslate(text, {
                to: targetLang,
                from: sourceLang,
            });
            // Xử lý cấu trúc response từ API
            let detectedLang = 'auto';
            if (result.from) {
                if (typeof result.from === 'string') {
                    detectedLang = result.from;
                }
                else if (result.from.language?.iso) {
                    detectedLang = result.from.language.iso;
                }
            }
            return {
                text: result.text,
                from: detectedLang,
                to: targetLang,
                originalText: text,
            };
        }
        catch (error) {
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
    async translateBatch(texts, targetLang = 'en', sourceLang) {
        const promises = texts.map((text) => this.translate(text, targetLang, sourceLang));
        return Promise.all(promises);
    }
    /**
     * Lấy danh sách các ngôn ngữ được hỗ trợ
     */
    getSupportedLanguages() {
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
//# sourceMappingURL=translator.js.map
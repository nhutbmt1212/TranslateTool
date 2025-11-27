export interface TranslationResult {
    text: string;
    from: string;
    to: string;
    originalText: string;
}
export declare class Translator {
    /**
     * Dịch văn bản từ ngôn ngữ này sang ngôn ngữ khác
     * @param text - Văn bản cần dịch
     * @param targetLang - Ngôn ngữ đích (mã ISO 639-1, ví dụ: 'en', 'vi', 'ja')
     * @param sourceLang - Ngôn ngữ nguồn (tự động phát hiện nếu không chỉ định)
     * @returns Kết quả dịch
     */
    translate(text: string, targetLang?: string, sourceLang?: string): Promise<TranslationResult>;
    /**
     * Dịch nhiều đoạn văn bản cùng lúc
     * @param texts - Mảng các văn bản cần dịch
     * @param targetLang - Ngôn ngữ đích
     * @param sourceLang - Ngôn ngữ nguồn
     * @returns Mảng kết quả dịch
     */
    translateBatch(texts: string[], targetLang?: string, sourceLang?: string): Promise<TranslationResult[]>;
    /**
     * Lấy danh sách các ngôn ngữ được hỗ trợ
     */
    getSupportedLanguages(): Record<string, string>;
}

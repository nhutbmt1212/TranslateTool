import React, { useState, useEffect, useRef } from 'react';
import sampleImageUrl from './assets/Screenshot 2025-11-26 202920.png';

interface TranslationResult {
  text: string;
  from: string;
  to: string;
  originalText: string;
}

interface Languages {
  [key: string]: string;
}

const DEFAULT_TEST_CALLS = 5;

const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const [metadata, base64] = dataUrl.split(',');
  const mimeMatch = metadata.match(/data:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], filename, { type: mime });
};

const fetchSampleImageFile = async (): Promise<File> => {
  const response = await fetch(sampleImageUrl);
  const blob = await response.blob();
  return new File([blob], 'sample-image.png', {
    type: blob.type || 'image/png',
  });
};

declare global {
  interface Window {
    electronAPI: {
      translate: (text: string, targetLang: string, sourceLang?: string) => Promise<{
        success: boolean;
        data?: TranslationResult;
        error?: string;
      }>;
      getLanguages: () => Promise<Languages>;
    };
  }
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [detectedLang, setDetectedLang] = useState('auto');
  const [languages, setLanguages] = useState<Languages>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTestingLimit, setIsTestingLimit] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const langs = await window.electronAPI.getLanguages();
      setLanguages(langs);
    } catch (err) {
      console.error('Lỗi khi tải danh sách ngôn ngữ:', err);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập văn bản cần dịch');
      return;
    }

    setIsTranslating(true);
    setError(null);
    setOutputText('');

    try {
      const result = await window.electronAPI.translate(
        inputText,
        targetLang,
        sourceLang === 'auto' ? undefined : sourceLang
      );

      if (result.success && result.data) {
        setOutputText(result.data.text);
        setDetectedLang(result.data.from);
      } else {
        setError(result.error || 'Lỗi dịch thuật');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang !== 'auto') {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
      setInputText(outputText);
      setOutputText(inputText);
    } else if (detectedLang !== 'auto') {
      setSourceLang(targetLang);
      setTargetLang(detectedLang);
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Hiển thị preview
    const base64DataUrl = await convertFileToBase64(file);
    setImagePreview(base64DataUrl);
    setLastImageBase64(base64DataUrl);

    // Xử lý OCR
    setIsProcessingOCR(true);
    setError(null);

    try {
      let text = '';

      // Sử dụng Gemini API (miễn phí, không cần billing)
      text = await recognizeWithGemini(file);

      // Làm sạch văn bản
      const cleanedText = text.trim();
      
      if (cleanedText) {
        setInputText(cleanedText);
        setImagePreview(null);
        // Tự động dịch sau khi nhận diện
        setTimeout(() => {
          handleTranslate();
        }, 100);
      } else {
        setError('Không tìm thấy văn bản trong hình ảnh');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi nhận diện văn bản');
    } finally {
      setIsProcessingOCR(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleSampleImageTest = async () => {
    setIsProcessingOCR(true);
    setError(null);
    try {
      const sampleFile = await fetchSampleImageFile();
      const base64DataUrl = await convertFileToBase64(sampleFile);
      setImagePreview(base64DataUrl);
      setLastImageBase64(base64DataUrl);

      const text = await recognizeWithGemini(sampleFile);
      const cleanedText = text.trim();
      if (cleanedText) {
        setInputText(cleanedText);
        setTimeout(() => {
          handleTranslate();
        }, 100);
      } else {
        setError('Không nhận diện được văn bản từ ảnh mẫu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xử lý ảnh mẫu');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const createTestImageFile = async (): Promise<File> => {
    if (lastImageBase64) {
      return dataUrlToFile(lastImageBase64, `test-${Date.now()}.png`);
    }
    return fetchSampleImageFile();
  };

  const handleTestLimit = async (times: number = DEFAULT_TEST_CALLS) => {
    setIsTestingLimit(true);
    setTestProgress(0);
    setError(null);
    try {
      for (let i = 0; i < times; i++) {
        const testFile = await createTestImageFile();
        await recognizeWithGemini(testFile);
        setTestProgress(i + 1);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi test giới hạn API');
    } finally {
      setIsTestingLimit(false);
    }
  };

  // OCR với Google Gemini API (miễn phí, không cần billing)
  const recognizeWithGemini = async (file: File): Promise<string> => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    if (!GEMINI_API_KEY) {
      throw new Error('Thiếu VITE_GEMINI_API_KEY trong file .env');
    }

    // Chuyển file thành base64
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

    // Model mới (Gemini 2.5 Flash) hỗ trợ generateContent hình ảnh
    const GEMINI_MODEL = 'gemini-2.5-flash-lite';

    // Gọi Gemini API với API key
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
      throw new Error(error.error?.message || 'Lỗi khi gọi Gemini API');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return '';
    }

    return text.trim();
  };


  return (
    <div className="app">
      <header className="header">
        <h1>🌍 Translate Tool</h1>
        <p className="subtitle">Ứng dụng dịch thuật đa ngôn ngữ</p>
        <div className="ocr-settings">
          <span className="ocr-badge">✨ Gemini API (Miễn phí)</span>
        </div>
      </header>

      <main className="main-content">
        <div className="translation-container">
          {/* Input Section */}
          <div className="translation-box">
            <div className="box-header">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="lang-select"
              >
                <option value="auto">Tự động phát hiện</option>
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
              {sourceLang !== 'auto' && detectedLang !== 'auto' && (
                <span className="detected-lang">Phát hiện: {languages[detectedLang] || detectedLang}</span>
              )}
            </div>
            <textarea
              className="text-input"
              placeholder="Nhập văn bản cần dịch....."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
            />
            <div className="box-footer">
              <div className="footer-left">
                <button
                  className="icon-button"
                  onClick={handleCaptureClick}
                  title="Chụp/Chọn ảnh để dịch"
                  disabled={isProcessingOCR}
                >
                  📷
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <button
                  className="icon-button"
                  onClick={() => handleCopy(inputText)}
                  title="Sao chép"
                  disabled={!inputText}
                >
                  📋
                </button>
              </div>
              <span className="char-count">{inputText.length} ký tự</span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="swap-container">
            <button
              className="swap-button"
              onClick={handleSwapLanguages}
              title="Đổi ngôn ngữ"
              disabled={!inputText || !outputText}
            >
              ⇅
            </button>
          </div>

          {/* Output Section */}
          <div className="translation-box">
            <div className="box-header">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="lang-select"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="text-output"
              placeholder="Bản dịch sẽ hiển thị ở đây..."
              value={outputText}
              readOnly
              rows={8}
            />
            <div className="box-footer">
              <button
                className="icon-button"
                onClick={() => handleCopy(outputText)}
                title="Sao chép"
                disabled={!outputText}
              >
                📋
              </button>
              <span className="char-count">{outputText.length} ký tự</span>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button
              className="close-preview-button"
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Translate Button */}
        <button
          className="translate-button"
          onClick={handleTranslate}
          disabled={isTranslating || isProcessingOCR || !inputText.trim()}
        >
          {isProcessingOCR
            ? '🔍 Đang nhận diện văn bản...'
            : isTranslating
            ? '🔄 Đang dịch...'
            : '✨ Dịch'}
        </button>

        {/* Sample Image Button */}
        <button
          className="test-button"
          onClick={handleSampleImageTest}
          disabled={isProcessingOCR || isTranslating}
        >
          {isProcessingOCR ? '🖼️ Đang xử lý ảnh mẫu...' : '🖼️ Dùng ảnh mẫu Robinquill'}
        </button>

        {/* Test API Limit Button */}
        <button
          className="test-button"
          onClick={() => handleTestLimit()}
          disabled={isTestingLimit || isProcessingOCR || isTranslating}
        >
          {isTestingLimit
            ? `🚀 Đang test (${testProgress}/${DEFAULT_TEST_CALLS})`
            : `🚀 Test API limit (${DEFAULT_TEST_CALLS} calls)`}
        </button>

        {isTestingLimit && (
          <div className="test-status">
            Đang gửi yêu cầu {testProgress}/{DEFAULT_TEST_CALLS}...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;


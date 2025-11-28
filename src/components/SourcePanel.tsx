import React from 'react';
import { Languages } from '../types/languages';

interface SourcePanelProps {
  sourceLang: string;
  targetLang: string;
  languages: Languages;
  inputText: string;
  isProcessingOCR: boolean;
  charCount: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSourceLangChange: (lang: string) => void;
  onInputTextChange: (text: string) => void;
  onCaptureClick: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCopy: () => void;
}

const SourcePanel: React.FC<SourcePanelProps> = ({
  sourceLang,
  targetLang,
  languages,
  inputText,
  isProcessingOCR,
  charCount,
  fileInputRef,
  onSourceLangChange,
  onInputTextChange,
  onCaptureClick,
  onImageSelect,
  onCopy,
}) => {
  return (
    <div className="translation-box">
      <div className="box-header">
        <select
          value={sourceLang}
          onChange={(e) => onSourceLangChange(e.target.value)}
          className="lang-select"
        >
          <option value="auto">Tự động phát hiện</option>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code} disabled={code === targetLang}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="text-input"
        placeholder="Nhập văn bản cần dịch....."
        value={inputText}
        onChange={(e) => onInputTextChange(e.target.value)}
        rows={8}
      />
      <div className="box-footer">
        <div className="footer-left">
          <button
            className="icon-button"
            onClick={onCaptureClick}
            title="Chụp/Chọn ảnh để dịch"
            disabled={isProcessingOCR}
          >
            📷
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            style={{ display: 'none' }}
          />
          <button
            className="icon-button"
            onClick={onCopy}
            title="Sao chép"
            disabled={!inputText}
          >
            📋
          </button>
        </div>
        <span className="char-count">{charCount} ký tự</span>
      </div>
    </div>
  );
};

export default SourcePanel;

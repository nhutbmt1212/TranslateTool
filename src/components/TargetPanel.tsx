import React from 'react';
import { Languages } from '../types/languages';

interface TargetPanelProps {
  targetLang: string;
  sourceLang: string;
  languages: Languages;
  outputText: string;
  charCount: number;
  onTargetLangChange: (lang: string) => void;
  onCopy: () => void;
}

const TargetPanel: React.FC<TargetPanelProps> = ({
  targetLang,
  sourceLang,
  languages,
  outputText,
  charCount,
  onTargetLangChange,
  onCopy,
}) => {
  return (
    <div className="translation-box">
      <div className="box-header">
        <select
          value={targetLang}
          onChange={(e) => onTargetLangChange(e.target.value)}
          className="lang-select"
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code} disabled={sourceLang !== 'auto' && code === sourceLang}>
              {name}
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
          onClick={onCopy}
          title="Sao chép"
          disabled={!outputText}
        >
          📋
        </button>
        <span className="char-count">{charCount} ký tự</span>
      </div>
    </div>
  );
};

export default TargetPanel;

import React from 'react';

interface HeaderBarProps {
  onOpenLanguagePicker: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenLanguagePicker }) => (
  <header className="header">
    <div className="header-top">
      <div>
        <h1>🌍 Translate Tool</h1>
        <p className="subtitle">Ứng dụng dịch thuật đa ngôn ngữ</p>
      </div>
      <button
        className="globe-button"
        aria-label="Chọn ngôn ngữ"
        onClick={onOpenLanguagePicker}
      >
        🌐
      </button>
    </div>
    <div className="ocr-settings">
      <span className="ocr-badge">✨ Gemini API (Miễn phí)</span>
    </div>
  </header>
);

export default HeaderBar;

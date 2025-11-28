import React from 'react';
import { Languages } from '../types/languages';

type PickerMode = 'source' | 'target';

interface LanguagePickerModalProps {
  open: boolean;
  mode: PickerMode;
  languages: Languages;
  sourceLang: string;
  targetLang: string;
  onClose: () => void;
  onModeChange: (mode: PickerMode) => void;
  onSelectSource: (code: string) => void;
  onSelectTarget: (code: string) => void;
}

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  open,
  mode,
  languages,
  sourceLang,
  targetLang,
  onClose,
  onModeChange,
  onSelectSource,
  onSelectTarget,
}) => {
  if (!open) return null;

  const handleSelect = (code: string) => {
    if (mode === 'source') {
      onSelectSource(code);
    } else {
      onSelectTarget(code);
    }
    onClose();
  };

  const isDisabled = (code: string) => {
    if (mode === 'source') {
      return code === targetLang;
    }
    return sourceLang !== 'auto' && code === sourceLang;
  };

  return (
    <div className="language-picker-overlay" onClick={onClose}>
      <div className="language-picker" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <h3>Chọn ngôn ngữ {mode === 'source' ? 'nguồn' : 'đích'}</h3>
          <div className="picker-actions">
            <button className={mode === 'source' ? 'active' : ''} onClick={() => onModeChange('source')}>
              Nguồn
            </button>
            <button className={mode === 'target' ? 'active' : ''} onClick={() => onModeChange('target')}>
              Đích
            </button>
          </div>
        </div>
        <div className="language-list">
          {Object.entries(languages).map(([code, name]) => (
            <button
              key={code}
              className="language-item"
              onClick={() => handleSelect(code)}
              disabled={isDisabled(code)}
            >
              <span className="language-name">{name}</span>
              <span className="language-code">{code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagePickerModal;

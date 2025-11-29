import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

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

  const titleKey = mode === 'source' ? 'languagePicker.titleSource' : 'languagePicker.titleTarget';

  const filteredLanguages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return Object.entries(languages);
    }

    return Object.entries(languages).filter(([code, name]) => {
      const haystack = `${name} ${code}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [languages, searchTerm]);

  if (!open) return null;

  return (
    <div className="language-picker-overlay" onClick={onClose}>
      <div className="language-picker" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <div>
            <p className="picker-eyebrow">{t('languagePicker.eyebrow')}</p>
            <h3>{t(titleKey)}</h3>
          </div>
          <div className="picker-actions">
            <button className={mode === 'source' ? 'active' : ''} onClick={() => onModeChange('source')}>
              {t('languagePicker.tabSource')}
            </button>
            <button className={mode === 'target' ? 'active' : ''} onClick={() => onModeChange('target')}>
              {t('languagePicker.tabTarget')}
            </button>
          </div>
        </div>
        <div className="picker-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('languagePicker.searchPlaceholder', 'Search languages...') ?? 'Search languages...'}
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} aria-label={t('general.clear', 'Clear')}>
              ✕
            </button>
          )}
        </div>
        <div className="language-list">
          {filteredLanguages.map(([code, name]) => {
            const selected = mode === 'source' ? code === sourceLang : code === targetLang;
            return (
              <button
                key={code}
                className={`language-item${isDisabled(code) ? ' disabled' : ''}${selected ? ' selected' : ''}`}
                onClick={() => handleSelect(code)}
                disabled={isDisabled(code)}
              >
                <span className="language-name">{name}</span>
                <span className="language-code">{code}</span>
                {selected && <span className="language-check" aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguagePickerModal;

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from '../types/languages';
import { useLanguageSearch } from '../hooks/useLanguageSearch';
import ErrorBoundary from './ErrorBoundary';

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

const LanguagePickerModalContent: React.FC<LanguagePickerModalProps> = ({
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const autoDetectLabel = t('source.autoDetect', 'Auto detect');
  const {
    searchTerm,
    setSearchTerm,
    filteredLanguages,
    clearSearch,
    sanitizeInput,
    isLetterKey,
  } = useLanguageSearch({
    languages,
    mode,
    autoDetectLabel,
  });

  const handleSelect = useCallback((code: string) => {
    if (mode === 'source') {
      onSelectSource(code);
    } else {
      onSelectTarget(code);
    }
    onClose();
  }, [mode, onSelectSource, onSelectTarget, onClose]);

  const isDisabled = useCallback((code: string) => {
    if (mode === 'source') {
      return code === targetLang;
    }
    return sourceLang !== 'auto' && code === sourceLang;
  }, [mode, targetLang, sourceLang]);

  const titleKey = useMemo(() => 
    mode === 'source' ? 'languagePicker.titleSource' : 'languagePicker.titleTarget',
    [mode]
  );

  // Clear search term when modal opens
  useEffect(() => {
    if (open) {
      clearSearch();
    }
  }, [open, clearSearch]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    const target = event.target as HTMLElement | null;
    const isInputFocused = target && inputRef.current && inputRef.current.contains(target);
    if (isInputFocused) {
      return;
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.key.length === 1) {
      if (isLetterKey(event.key)) {
        event.preventDefault();
        inputRef.current?.focus();
        setSearchTerm((prev: string) => sanitizeInput(`${prev}${event.key}`));
      } else {
        event.preventDefault();
      }
    }
  }, [onClose, isLetterKey, sanitizeInput, setSearchTerm]);

  useEffect(() => {
    if (!open) return undefined;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

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
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('languagePicker.searchPlaceholder', 'Search languages...') ?? 'Search languages...'}
          />
          {searchTerm && (
            <button type="button" onClick={clearSearch} aria-label={t('general.clear', 'Clear')}>
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

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = (props) => {
  return (
    <ErrorBoundary>
      <LanguagePickerModalContent {...props} />
    </ErrorBoundary>
  );
};

export default LanguagePickerModal;

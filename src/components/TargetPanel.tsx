import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className="translation-box target-box">
      <div className="panel-top simple-panel-header">
        <select
          value={targetLang}
          onChange={(e) => onTargetLangChange(e.target.value)}
          className="lang-select simple-select"
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code} disabled={sourceLang !== 'auto' && code === sourceLang}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="text-output simple-textarea"
        placeholder={t('target.placeholder') ?? ''}
        value={outputText}
        readOnly
        rows={8}
      />
      <div className="box-footer target-footer simple-footer">
        <button
          type="button"
          className="icon-button simple-icon-button"
          onClick={onCopy}
          title={t('buttons.copy') ?? undefined}
          disabled={!outputText}
        >
          📋
        </button>
        <span className="char-count simple-char-count">
          {t('general.characters', { count: charCount })}
        </span>
      </div>
    </div>
  );
};

export default TargetPanel;

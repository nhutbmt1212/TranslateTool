import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CopyIcon, CheckIcon, SpeakerIcon, SpeakerOffIcon } from './icons';
import { responsiveVoiceTTS, languageToTTSCode } from '../utils/responsiveVoiceTTS';

interface TargetPanelProps {
  targetLang: string;
  outputText: string;
  charCount: number;
  onCopy: () => void;
  onOpenLanguagePicker: () => void;
  targetLabel: string;
  copied: boolean;
}

const TargetPanel: React.FC<TargetPanelProps> = ({
  targetLang,
  outputText,
  charCount,
  onCopy,
  onOpenLanguagePicker,
  targetLabel,
  copied,
}) => {
  const { t } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    if (!outputText) return;

    if (isSpeaking) {
      responsiveVoiceTTS.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    try {
      const ttsLang = languageToTTSCode[targetLang] || targetLang;
      await responsiveVoiceTTS.speak(outputText, ttsLang);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="translation-box target-box">
      <div className="panel-top simple-panel-header">
        <button type="button" className="simple-select-trigger" onClick={onOpenLanguagePicker}>
          <span className="select-label">{targetLabel}</span>
          <span className="select-caret" aria-hidden="true" />
        </button>
      </div>
      <textarea
        className="text-output simple-textarea"
        placeholder={t('target.placeholder') ?? ''}
        value={outputText}
        readOnly
        rows={8}
      />
      <div className="box-footer target-footer simple-footer">
        <div className="target-footer-left">
          <button
            type="button"
            className="icon-button simple-icon-button"
            onClick={handleSpeak}
            title={isSpeaking ? 'Stop' : 'Listen'}
            disabled={!outputText}
          >
            {isSpeaking ? <SpeakerOffIcon size={18} /> : <SpeakerIcon size={18} />}
          </button>
          <button
            type="button"
            className="icon-button simple-icon-button"
            onClick={onCopy}
            title={t('buttons.copy') ?? undefined}
            disabled={!outputText}
          >
            {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
          </button>
        </div>
        <span className="char-count simple-char-count target-footer-right">
          {t('general.characters', { count: charCount })}
        </span>
      </div>
    </div>
  );
};

export default TargetPanel;

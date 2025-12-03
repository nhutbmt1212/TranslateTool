import React from 'react';
import { useTranslation } from 'react-i18next';

interface ApiKeySectionProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  maskedKey: string | null;
  showKey: boolean;
  setShowKey: (show: boolean) => void;
  onClear: () => Promise<void>;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  setApiKey,
  maskedKey,
  showKey,
  setShowKey,
  onClear,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="settings-section">
        <h3>{t('settings.apiKey.title') || 'Gemini API Key'}</h3>
        <p className="settings-description">
          {t('settings.apiKey.description') ||
            'Your API key is encrypted and stored securely on your device.'}
        </p>

        {maskedKey && (
          <div className="current-key-display">
            <div className="current-key-label">
              {t('settings.apiKey.current') || 'Current API Key:'}
            </div>
            <div className="current-key-value">
              <code>{maskedKey}</code>
              <button
                type="button"
                className="clear-key-button"
                onClick={onClear}
                title={t('settings.apiKey.clear') || 'Clear API Key'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="input-group">
          <label htmlFor="api-key-input">
            {maskedKey
              ? t('settings.apiKey.update') || 'Update API Key'
              : t('settings.apiKey.enter') || 'Enter API Key'}
          </label>
          <div className="api-key-input-wrapper">
            <div className="picker-search">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('settings.apiKey.placeholder') || 'Enter your Gemini API Key'}
                className="api-key-input"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="toggle-visibility-button"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide' : 'Show'}
              >
                {showKey ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-help">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="get-key-link"
          >
            {t('settings.apiKey.getKey') || 'Get API Key'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="settings-section">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {t('settings.security.title') || 'Security'}
        </h3>
        <ul className="security-info">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('settings.security.encrypted') || 'API key is encrypted using AES-GCM'}
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('settings.security.session') || 'Stored permanently on your device'}
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('settings.security.device') || 'Encryption key is device-specific'}
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('settings.security.noServer') || 'Never sent to any server except Google AI'}
          </li>
        </ul>
      </div>
    </>
  );
};

export default ApiKeySection;
import React from 'react';
import { useTranslation } from 'react-i18next';

interface UpdateInfo {
  version: string;
  releaseDate?: string;
}

interface UpdateSectionProps {
  appVersion: string;
  updateAvailable: boolean;
  updateInfo: UpdateInfo | null;
  downloading: boolean;
  downloadProgress: number;
  updateReady: boolean;
  updateError: string | null;
  downloadRetries: number;
  isPaused: boolean;
  onPauseResume: () => void;
}

const UpdateSection: React.FC<UpdateSectionProps> = ({
  appVersion,
  updateAvailable,
  updateInfo,
  downloading,
  downloadProgress,
  updateReady,
  updateError,
  downloadRetries,
  isPaused,
  onPauseResume,
}) => {
  const { t } = useTranslation();

  return (
    <div className="settings-section">
      <h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {t('settings.update.title') || 'App Update'}
      </h3>
      <p className="settings-description">
        {t('settings.update.description') || 'Check and install the latest version of the application.'}
      </p>

      <div className="update-info-box">
        <div className="update-info-label">{t('settings.update.currentVersion') || 'Current version'}</div>
        <div className="update-info-value">v{appVersion}</div>
      </div>

      {updateError && (
        <div className="update-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {updateError}
        </div>
      )}

      {updateReady && (
        <div className="update-ready-box">
          <div className="update-ready-icon">🎉</div>
          <div className="update-ready-text">
            <strong>{t('settings.update.readyToInstall') || 'Update ready!'}</strong>
            <p>{t('settings.update.readyDescription', { version: updateInfo?.version }) || `Version ${updateInfo?.version} has been downloaded`}</p>
          </div>
        </div>
      )}

      {downloading && (
        <div className="update-progress-box">
          <div className="update-progress-header">
            <div className="update-progress-label">
              {isPaused ? `⏸️ ${t('settings.update.paused') || 'Paused'}` : t('settings.update.downloading') || 'Downloading update...'}
            </div>
            <button 
              className="pause-resume-button"
              onClick={onPauseResume}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
          </div>
          <div className="update-progress-bar">
            <div
              className="update-progress-fill"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <div className="update-progress-text">
            {downloadProgress}%
            {downloadRetries > 0 && ` (Retry ${downloadRetries}/3)`}
          </div>
        </div>
      )}

      {updateAvailable && !downloading && !updateReady && (
        <div className="update-available-box">
          <div className="update-available-icon">🔔</div>
          <div className="update-available-text">
            <strong>{t('settings.update.newVersion') || 'New version available!'}</strong>
            <p>{t('settings.update.versionAvailable', { version: updateInfo?.version }) || `Version ${updateInfo?.version} is available`}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateSection;
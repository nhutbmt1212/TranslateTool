import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateNotification } from '../hooks/useUpdateNotification';
import ErrorBoundary from './ErrorBoundary';
import '../styles/update-notification.css';

const UpdateNotificationContent: React.FC = () => {
  const { t } = useTranslation();
  const {
    updateAvailable,
    updateInfo,
    downloading,
    downloadProgress,
    updateReady,
    isPaused,
    error,
    handleDownload,
    handleInstall,
    handleDismiss,
    handlePauseResume,
  } = useUpdateNotification();

  // Show error state if any
  if (error) {
    return (
      <div className="update-notification update-error">
        <div className="update-content">
          <div className="update-icon">❌</div>
          <div className="update-text">
            <h3>{t('update.notification.error', 'Update Error')}</h3>
            <p>{error}</p>
          </div>
        </div>
        <div className="update-actions">
          <button onClick={handleDismiss} className="btn-dismiss">
            {t('update.notification.dismiss', 'Dismiss')}
          </button>
        </div>
      </div>
    );
  }

  if (updateReady) {
    return (
      <div className="update-notification update-ready">
        <div className="update-content">
          <div className="update-icon">🎉</div>
          <div className="update-text">
            <h3>{t('update.notification.ready', 'Update ready!')}</h3>
            <p>
              {t('update.notification.readyDescription', 'Version {{version}} has been downloaded', {
                version: updateInfo?.version,
              })}
            </p>
          </div>
        </div>
        <div className="update-actions">
          <button onClick={handleInstall} className="btn-install">
            {t('update.notification.installNow', 'Install now')}
          </button>
          <button onClick={handleDismiss} className="btn-later">
            {t('update.notification.later', 'Later')}
          </button>
        </div>
      </div>
    );
  }

  if (downloading) {
    return (
      <div className="update-notification update-downloading">
        <div className="update-content">
          <div className="update-icon">⬇️</div>
          <div className="update-text">
            <h3>
              {isPaused
                ? t('update.notification.paused', 'Download paused')
                : t('update.notification.downloading', 'Downloading update...')}
            </h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <div className="progress-info">
              <span className="progress-text">{downloadProgress}%</span>
              <button 
                onClick={handlePauseResume} 
                className="btn-pause-resume"
                title={isPaused ? t('update.notification.resume', 'Resume') : t('update.notification.pause', 'Pause')}
              >
                {isPaused ? '▶️' : '⏸️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (updateAvailable) {
    return (
      <div className="update-notification">
        <div className="update-content">
          <div className="update-icon">🔔</div>
          <div className="update-text">
            <h3>{t('update.notification.newVersion', 'New version available!')}</h3>
            <p>
              {t('update.notification.versionAvailable', 'Version {{version}} is available', {
                version: updateInfo?.version,
              })}
            </p>
          </div>
        </div>
        <div className="update-actions">
          <button onClick={handleDownload} className="btn-update">
            {t('update.notification.download', 'Download')}
          </button>
          <button onClick={handleDismiss} className="btn-skip">
            {t('update.notification.skip', 'Skip')}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export function UpdateNotification() {
  return (
    <ErrorBoundary>
      <UpdateNotificationContent />
    </ErrorBoundary>
  );
}

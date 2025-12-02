import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../styles/update-notification.css';

interface UpdateInfo {
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
}

interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
}

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;

    // Listening to update events
    const removeChecking = window.electronAPI.onUpdateChecking(() => {
      // Update checking started
    });

    const removeAvailable = window.electronAPI.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateAvailable(true);
      setUpdateInfo(info);
      toast.success(`Phiên bản mới ${info.version} đã có sẵn!`, {
        duration: 5000,
      });
    });

    const removeNotAvailable = window.electronAPI.onUpdateNotAvailable(() => {
      // No update available
    });

    const removeError = window.electronAPI.onUpdateError((error: any) => {
      toast.error('Lỗi khi kiểm tra update');
      setDownloading(false);
    });

    const removeProgress = window.electronAPI.onUpdateDownloadProgress((progress: DownloadProgress) => {
      setDownloadProgress(Math.round(progress.percent));
    });

    const removeDownloaded = window.electronAPI.onUpdateDownloaded((info: UpdateInfo) => {
      setDownloading(false);
      setUpdateReady(true);
      toast.success('Update đã sẵn sàng cài đặt!');
    });

    return () => {
      removeChecking();
      removeAvailable();
      removeNotAvailable();
      removeError();
      removeProgress();
      removeDownloaded();
    };
  }, []);

  const handleDownload = async () => {
    if (!window.electronAPI) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      await window.electronAPI.downloadUpdate();
    } catch (error) {
      toast.error('Không thể tải update');
      setDownloading(false);
    }
  };

  const handleInstall = () => {
    if (!window.electronAPI) return;
    window.electronAPI.installUpdate();
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
    setUpdateReady(false);
  };

  if (updateReady) {
    return (
      <div className="update-notification update-ready">
        <div className="update-content">
          <div className="update-icon">🎉</div>
          <div className="update-text">
            <h3>Update đã sẵn sàng!</h3>
            <p>Phiên bản {updateInfo?.version} đã được tải xuống</p>
          </div>
        </div>
        <div className="update-actions">
          <button onClick={handleInstall} className="btn-install">
            Cài đặt ngay
          </button>
          <button onClick={handleDismiss} className="btn-later">
            Để sau
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
            <h3>Đang tải update...</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <p className="progress-text">{downloadProgress}%</p>
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
            <h3>Có phiên bản mới!</h3>
            <p>Phiên bản {updateInfo?.version} đã có sẵn</p>
          </div>
        </div>
        <div className="update-actions">
          <button onClick={handleDownload} className="btn-update">
            Tải về
          </button>
          <button onClick={handleDismiss} className="btn-skip">
            Bỏ qua
          </button>
        </div>
      </div>
    );
  }

  return null;
}

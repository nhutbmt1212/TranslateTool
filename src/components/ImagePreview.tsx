import React from 'react';
import { useTranslation } from 'react-i18next';

interface ImagePreviewProps {
    imagePreview: string | null;
    isProcessingOCR: boolean;
    countdown: number | null;
    onClose?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreview, isProcessingOCR, countdown, onClose }) => {
    const { t } = useTranslation();
    
    if (!imagePreview) return null;

    // Calculate circle progress (circumference = 2 * PI * radius = 2 * 3.14159 * 10 ≈ 62.83)
    const circumference = 62.83;
    const maxCountdown = 10; // Assuming max countdown is 10 seconds
    const progress = countdown !== null ? (countdown / maxCountdown) : 1;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="image-preview-toast">
            <div className="image-preview-content">
                <img src={imagePreview} alt="Preview" className="image-preview-img" />
                {isProcessingOCR && (
                    <div className="ocr-progress-overlay">
                        <div className="ocr-progress-bar">
                            <div className="ocr-progress-indicator" />
                        </div>
                        <span className="ocr-status-text">{t('status.processing')}</span>
                    </div>
                )}
            </div>
            <div className="image-preview-footer">
                {countdown !== null && countdown > 0 && (
                    <div className="countdown-timer">
                        <svg className="countdown-circle" viewBox="0 0 24 24">
                            <circle 
                                cx="12" 
                                cy="12" 
                                r="10"
                                style={{
                                    strokeDashoffset: strokeDashoffset,
                                    transition: 'stroke-dashoffset 1s linear'
                                }}
                            />
                        </svg>
                        <span className="countdown-text">{countdown}s</span>
                    </div>
                )}
                {onClose && (
                    <button 
                        className="image-preview-close" 
                        onClick={onClose}
                        aria-label="Close preview"
                        type="button"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImagePreview;

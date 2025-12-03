import React from 'react';
import { useTranslation } from 'react-i18next';
import { useScreenCapture } from '../hooks/useScreenCapture';

interface QuickScreenCaptureProps {
  onImageCaptured: (text: string) => void;
  disabled?: boolean;
}

const QuickScreenCapture: React.FC<QuickScreenCaptureProps> = ({ 
  onImageCaptured, 
  disabled = false 
}) => {
  const { t } = useTranslation();
  const { isCapturing, captureScreen } = useScreenCapture();

  const handleQuickCapture = async () => {
    if (disabled || isCapturing) {
      return;
    }

    const extractedText = await captureScreen();
    if (extractedText) {
      onImageCaptured(extractedText);
    }
  };

  return (
    <button
      type="button"
      className="quick-capture-button"
      onClick={handleQuickCapture}
      disabled={disabled || isCapturing}
      title={t('quickCapture.tooltip') || 'Quick screen capture and translate'}
    >
      {isCapturing ? (
        <div className="capture-spinner" />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      )}
    </button>
  );
};

export default QuickScreenCapture;
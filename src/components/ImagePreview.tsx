import React from 'react';

interface ImagePreviewProps {
    imagePreview: string | null;
    isProcessingOCR: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreview, isProcessingOCR }) => {
    if (!imagePreview) return null;

    return (
        <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            {isProcessingOCR && (
                <div className="ocr-progress-bar">
                    <div className="ocr-progress-indicator" />
                </div>
            )}
        </div>
    );
};

export default ImagePreview;

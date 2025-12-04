# Python OCR Integration Guide

## Tổng quan

Dự án đã được tích hợp Python OCR service để cải thiện độ chính xác của Image Translation. Python OCR sử dụng **EasyOCR** (hoặc Tesseract làm fallback) để nhận diện văn bản trong ảnh.

## Cài đặt

### 1. Setup Python Environment

```bash
# Di chuyển vào thư mục python
cd python

# Chạy script setup (tự động tạo venv và cài dependencies)
python setup.py

# Hoặc cài đặt thủ công:
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# Unix/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### 2. Test Python OCR

```bash
# Test với một ảnh
python python/ocr_service.py path/to/image.png

# Test với ngôn ngữ cụ thể
python python/ocr_service.py path/to/image.png en vi ja
```

## Sử dụng trong Electron

### 1. Cập nhật Preload (electron/preload.ts)

Thêm vào cuối file, trước dòng `});`:

```typescript
  // Python OCR APIs
  pythonOCR: {
    checkAvailable: () => ipcRenderer.invoke('python-ocr:check-available'),
    processImage: (imagePath: string, languages?: string[]) => 
      ipcRenderer.invoke('python-ocr:process-image', imagePath, languages),
  },
```

### 2. Cập nhật Types (electron.d.ts)

Thêm vào interface `ElectronAPI`:

```typescript
  // Python OCR APIs
  pythonOCR: {
    checkAvailable: () => Promise<{ success: boolean; available: boolean }>;
    processImage: (imagePath: string, languages?: string[]) => Promise<{
      success: boolean;
      text?: string;
      blocks?: Array<{
        text: string;
        confidence: number;
        bbox: { x: number; y: number; width: number; height: number };
      }>;
      engine?: string;
      error?: string;
    }>;
  };
```
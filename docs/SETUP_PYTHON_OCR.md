# 🐍 Setup Python OCR cho Image Translation

## Bước 1: Cài đặt Python Environment

```powershell
# Di chuyển vào thư mục python
cd python

# Tạo virtual environment
py -m venv venv

# Activate venv
venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip

# Cài đặt dependencies
pip install -r requirements.txt
```

**Lưu ý**: Quá trình cài đặt sẽ mất ~5-10 phút vì cần download:
- PyTorch (~800MB)
- EasyOCR models (~100MB)

## Bước 2: Test Python OCR

```powershell
# Test với một ảnh
python ocr_service.py path/to/test-image.png

# Kết quả mong đợi:
# {
#   "success": true,
#   "text": "detected text...",
#   "blocks": [...],
#   "engine": "easyocr"
# }
```

## Bước 3: Cập nhật Preload.ts

Mở file `electron/preload.ts` và thêm code sau vào **CẢ 2** `contextBridge.exposeInMainWorld` (electronAPI và electron):

Tìm dòng cuối cùng trước `});` và thêm:

```typescript
  // Python OCR APIs
  pythonOCR: {
    checkAvailable: () => ipcRenderer.invoke('python-ocr:check-available'),
    processImage: (imagePath: string, languages?: string[]) => 
      ipcRenderer.invoke('python-ocr:process-image', imagePath, languages),
  },

  // Temp file helpers
  saveToTemp: (buffer: Buffer, filename: string) => 
    ipcRenderer.invoke('save-to-temp', buffer, filename),
  cleanupTemp: (filePath: string) => 
    ipcRenderer.invoke('cleanup-temp', filePath),
```

## Bước 4: Build và Test

```powershell
# Build Electron
npm run build

# Run app
npm run dev
```
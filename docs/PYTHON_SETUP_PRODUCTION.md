# Python OCR Setup for Production

## Vấn đề
Khi build installer, Python OCR không hoạt động vì:
- Python virtual environment không thể đóng gói (chứa đường dẫn tuyệt đối)
- Dependencies (EasyOCR, PyTorch) rất lớn (~2GB)

## Giải pháp

### Option 1: Yêu cầu Python system (Đơn giản - Đang dùng)
App sẽ tự động:
1. Tìm Python trên máy user (py, python, python3)
2. Kiểm tra dependencies
3. Tự động cài đặt nếu thiếu (lần đầu chạy)

**Ưu điểm:**
- Installer nhỏ gọn
- Dễ maintain
- User có thể update Python độc lập

**Nhược điểm:**
- Yêu cầu user có Python (>= 3.8)
- Lần đầu chạy cần internet để tải dependencies

### Option 2: Đóng gói Python portable (Phức tạp)
Đóng gói Python + dependencies vào installer

**Ưu điểm:**
- Không cần Python trên máy user
- Hoạt động offline

**Nhược điểm:**
- Installer rất lớn (~500MB - 1GB)
- Khó maintain
- Build time lâu

### Option 3: Tải Python runtime khi cần (Hybrid)
App tải Python portable khi user bật tính năng OCR lần đầu

## Cấu hình hiện tại

### electron/lib/pythonOCR.ts
```typescript
// Tự động tìm Python theo thứ tự:
// 1. Virtual env (dev mode)
// 2. Python launcher (py)
// 3. System Python (python/python3)
```

### package.json
```json
"files": [
  "python/**/*",        // Include Python scripts
  "!python/venv/**/*",  // Exclude venv
  "!python/__pycache__/**/*"
]
```
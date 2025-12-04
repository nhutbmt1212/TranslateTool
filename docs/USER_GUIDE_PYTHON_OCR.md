# 🎯 Hướng dẫn sử dụng Python OCR trong DALIT

## 📖 Giới thiệu

DALIT có 2 công nghệ nhận dạng chữ (OCR):

1. **Tesseract.js** (JavaScript) - Tích hợp sẵn, không cần cài gì thêm
2. **EasyOCR** (Python) - Chính xác hơn, nhưng cần Python

## 🚀 Cách hoạt động tự động

### Khi bạn mở DALIT lần đầu:

```
1. Bạn cài DALIT từ file Setup.exe
   ↓
2. Mở DALIT và thử dịch ảnh
   ↓
3. DALIT tự động kiểm tra:
   - ✅ Có Python trên máy không? (py, python, python3)
   - ✅ Có EasyOCR đã cài chưa?
   ↓
4a. NẾU CÓ Python + EasyOCR:
    → Dùng Python OCR (chính xác cao)
    → Bạn thấy: "✅ Using Python OCR (EasyOCR)"
   
4b. NẾU KHÔNG CÓ:
    → Dùng Tesseract.js (vẫn OK)
    → Bạn thấy: "❌ Python OCR not available, using Tesseract"
```

## 💡 Tại sao không tự động cài Python?

**Lý do:**
- Python + EasyOCR rất nặng (~2GB)
- Không phải ai cũng cần độ chính xác cao
- Tesseract.js đã đủ tốt cho hầu hết trường hợp

**Ưu điểm của cách này:**
- ✅ Installer nhỏ gọn (~100MB thay vì ~1GB)
- ✅ Cài đặt nhanh
- ✅ User tự quyết định có muốn Python OCR không

## 🔧 Cách bật Python OCR (nếu muốn)

### Bước 1: Cài Python

1. Tải Python từ: https://www.python.org/downloads/
2. Chọn phiên bản mới nhất (Python 3.8+)
3. **QUAN TRỌNG**: Tích ✅ "Add Python to PATH"
4. Cài đặt

### Bước 2: Cài EasyOCR

Mở Command Prompt (cmd) và chạy:

```cmd
py -m pip install easyocr torch torchvision
```

**Lưu ý:**
- Cần internet
- Tải ~2GB
- Mất 5-10 phút

### Bước 3: Khởi động lại DALIT

Đóng và mở lại DALIT. Thử dịch ảnh, bạn sẽ thấy:

```
✅ Using Python OCR (EasyOCR)
```
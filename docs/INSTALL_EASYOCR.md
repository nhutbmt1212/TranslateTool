# Cài đặt EasyOCR cho DALIT

## Tại sao cần cài?

DALIT đã được build và cài đặt thành công, nhưng để sử dụng **Python OCR (EasyOCR)** - công nghệ nhận dạng chữ chính xác hơn, bạn cần cài thêm Python và EasyOCR.

**Không cài cũng được!** App vẫn hoạt động với Tesseract.js (JavaScript OCR).

## Bước 1: Kiểm tra Python

Mở Command Prompt (cmd) và chạy:

```cmd
py --version
```

### Nếu thấy: `Python 3.x.x`
✅ Bạn đã có Python! Chuyển sang Bước 2.

### Nếu thấy: `'py' is not recognized...`
❌ Cần cài Python:

1. Tải từ: https://www.python.org/downloads/
2. Chọn phiên bản mới nhất (Python 3.8+)
3. **QUAN TRỌNG**: Tích ✅ "Add Python to PATH"
4. Cài đặt
5. Khởi động lại Command Prompt
6. Test lại: `py --version`

## Bước 2: Cài EasyOCR

Mở Command Prompt và chạy:

```cmd
py -m pip install easyocr torch torchvision
```

**Lưu ý:**
- Cần kết nối internet
- Tải khoảng **2GB** dữ liệu
- Mất **5-10 phút**
- Có thể thấy nhiều text chạy - đừng lo, đó là bình thường!
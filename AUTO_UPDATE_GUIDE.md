# Hướng dẫn Auto-Update cho DALIT

## Tính năng đã implement

✅ Tự động kiểm tra update khi mở app (sau 3 giây)
✅ Hiển thị thông báo khi có phiên bản mới
✅ Người dùng có thể chọn "Tải về" hoặc "Bỏ qua"
✅ Hiển thị progress bar khi đang tải
✅ Thông báo khi update đã sẵn sàng cài đặt
✅ Người dùng có thể chọn "Cài đặt ngay" hoặc "Để sau"
✅ Nếu chọn "Để sau", app vẫn chạy bình thường với version cũ

## Cách hoạt động

1. **Khi mở app**: App tự động check update sau 3 giây
2. **Có update mới**: Hiển thị notification ở góc trên bên phải
3. **User chọn "Tải về"**: Bắt đầu download với progress bar
4. **Download xong**: Hiển thị nút "Cài đặt ngay" hoặc "Để sau"
5. **Cài đặt**: App sẽ restart và cài đặt version mới

## Cấu hình để sử dụng

### 1. Cập nhật package.json

Thay đổi thông tin publish trong `package.json`:

```json
"publish": {
  "provider": "github",
  "owner": "your-github-username",
  "repo": "your-repo-name"
}
```

### 2. Tạo GitHub Release

Để auto-update hoạt động, bạn cần:

1. Push code lên GitHub repository
2. Tạo GitHub Release với tag version (ví dụ: v1.0.1)
3. Upload file installer (.exe) vào Release
4. electron-updater sẽ tự động check GitHub Releases

### 3. Build và Release

```bash
# Build app
npm run build

# File installer sẽ ở trong thư mục release/
# Upload file .exe lên GitHub Release
```

### 4. Tăng version

Mỗi lần release mới, tăng version trong `package.json`:

```json
{
  "version": "1.0.1"  // Tăng từ 1.0.0
}
```

## Các provider khác

Ngoài GitHub, bạn có thể dùng:

### Generic Server (HTTP)
```json
"publish": {
  "provider": "generic",
  "url": "https://your-server.com/updates"
}
```

### Amazon S3
```json
"publish": {
  "provider": "s3",
  "bucket": "your-bucket-name"
}
```

### Spaces (DigitalOcean)
```json
"publish": {
  "provider": "spaces",
  "name": "your-space-name",
  "region": "nyc3"
}
```

## Test trong development

Auto-update chỉ hoạt động trong production build. Để test:

1. Build app: `npm run build`
2. Chạy file .exe trong thư mục `release/`
3. Tạo version mới và upload lên GitHub Release
4. Mở app để test auto-update

## Tùy chỉnh

### Thay đổi thời gian check update

Trong `electron/main.ts`:

```typescript
setTimeout(() => {
  autoUpdater.checkForUpdates();
}, 3000); // Đổi 3000 thành số milliseconds khác
```

### Tự động download khi có update

Trong `electron/main.ts`:

```typescript
autoUpdater.autoDownload = true; // Đổi từ false sang true
```

### Tự động cài đặt khi thoát app

```typescript
autoUpdater.autoInstallOnAppQuit = true; // Đã bật sẵn
```

## Lưu ý

- Auto-update chỉ hoạt động với production build (file .exe đã build)
- Không hoạt động trong development mode (`npm run electron:dev`)
- Cần có internet để check và download update
- File update phải được host trên server (GitHub Release, S3, etc.)
- Version mới phải lớn hơn version hiện tại

## Troubleshooting

### Update không hoạt động?

1. Kiểm tra console log trong app (Ctrl+Shift+I)
2. Đảm bảo đã config đúng provider trong package.json
3. Đảm bảo GitHub Release đã public
4. Kiểm tra version trong package.json đã tăng chưa

### Lỗi "Update not available"?

- Version trong package.json phải nhỏ hơn version trên GitHub Release
- Ví dụ: Local v1.0.0, GitHub Release v1.0.1

### Muốn test nhanh?

Dùng dev-app-update-yml để test local:

```bash
# Tạo file dev-app-update.yml trong thư mục release/
# Chạy app với biến môi trường
set ELECTRON_UPDATER_DEV_APP_UPDATE_CONFIG=dev-app-update.yml
npm run electron:dev
```

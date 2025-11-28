# 🌍 Translate Tool - Ứng dụng Dịch thuật Desktop bằng TypeScript

Ứng dụng dịch thuật desktop được xây dựng bằng TypeScript và Electron, hỗ trợ dịch văn bản giữa nhiều ngôn ngữ khác nhau với giao diện đẹp mắt và hiện đại.

## ✨ Tính năng

### 🖥️ Desktop App (Electron)
- 🎨 Giao diện desktop đẹp mắt và hiện đại
- 🔄 Dịch văn bản tức thì
- 🌐 Hỗ trợ nhiều ngôn ngữ (Tiếng Việt, English, 中文, 日本語, và nhiều hơn nữa)
- 🔍 Tự động phát hiện ngôn ngữ nguồn
- ⇅ Đổi ngôn ngữ nhanh chóng
- 📋 Sao chép văn bản dễ dàng
- 💫 UI/UX mượt mà với animations

### 💻 CLI Tool
- 🚀 Dịch văn bản nhanh chóng từ dòng lệnh
- 🔄 Chế độ tương tác để dịch nhiều lần
- 🎨 Giao diện CLI đẹp mắt với màu sắc
- 📦 TypeScript với type safety

## 📋 Yêu cầu

- Node.js >= 18.0.0
- npm hoặc yarn

## 🚀 Cài đặt

1. Tạo file `.env` và đặt Gemini API key:

```env
VITE_GEMINI_API_KEY=AIzaSyDDC2GMKXS8O2Kn_GHRrzWk5rc7LEVkNeY
```

> Nếu muốn dùng key khác, chỉ cần thay giá trị trong `.env`. File đã được thêm vào `.gitignore`.

2. Cài đặt các dependencies:

```bash
npm install
```

## 💻 Sử dụng

### 🖥️ Desktop App

#### Chạy ở chế độ development:

```bash
npm run electron:dev
```

**Hot Reload:**
- ✅ **React UI** (`src/App.tsx`, `src/styles.css`): Tự động reload ngay khi bạn sửa code - **KHÔNG CẦN BUILD**
- ⚠️ **Electron Main** (`electron/main.ts`, `electron/preload.ts`): Cần **restart app** khi sửa (nhấn Ctrl+R trong app hoặc đóng/mở lại)

**Cách hoạt động:**
1. Khi bạn sửa file React (`src/App.tsx`, `src/styles.css`): App tự động cập nhật ngay lập tức
2. Khi bạn sửa Electron main process (`electron/main.ts`): Cần restart app để thấy thay đổi

#### Build ứng dụng desktop:

```bash
npm run electron:build
```

Sau khi build, file cài đặt sẽ nằm trong thư mục `release/`.

#### Test giới hạn API (stress test)

- Trong ứng dụng desktop, nhấn nút **“Test API limit (5 calls)”**
- Ứng dụng sẽ tự động gửi 5 yêu cầu OCR đến Gemini để kiểm tra giới hạn/throttle
- Bạn có thể tùy chỉnh logic trong `handleTestLimit` nếu muốn số lần khác

#### Chụp màn hình như Snipping Tool

- Nhấn **“Dùng ảnh mẫu Robinquill”** để test nhanh bằng ảnh cố định trong `src/assets`.
- Nhấn **“Chụp màn hình (Snipping)”**:
  - Ưu tiên gọi trực tiếp Snipping Tool của Windows (`ms-screenclip:`). Sau khi bạn chọn vùng, ảnh trong clipboard sẽ được OCR và dịch tự động.
  - Nếu Snipping Tool không khả dụng, app sẽ fallback về `desktopCapturer`/`getDisplayMedia` để vẫn có thể chụp màn hình.

### 💻 CLI Tool

#### Dịch văn bản đơn giản:

```bash
npm run cli:dev translate "Xin chào" -t en
# Hoặc
npm run cli:dev t "Hello" -t vi
```

#### Chế độ tương tác:

```bash
npm run cli:dev interactive
# Hoặc
npm run cli:dev i
```

Trong chế độ tương tác:
- Nhập văn bản để dịch
- Nhập `to:<lang>` để đổi ngôn ngữ đích (ví dụ: `to:ja`)
- Nhập `exit` hoặc `quit` để thoát

#### Xem danh sách ngôn ngữ:

```bash
npm run cli:dev languages
# Hoặc
npm run cli:dev langs
```

#### Build CLI:

```bash
npm run cli:build
npm run cli:start translate "Xin chào" -t en
```

## 📝 Ví dụ

### Desktop App:
1. Chạy `npm run electron:dev`
2. Nhập văn bản vào ô bên trái
3. Chọn ngôn ngữ đích
4. Nhấn nút "✨ Dịch"
5. Kết quả sẽ hiển thị ở ô bên phải

### CLI:
```bash
# Dịch từ tiếng Việt sang tiếng Anh
npm run cli:dev translate "Tôi yêu lập trình" -t en

# Dịch từ tiếng Anh sang tiếng Nhật
npm run cli:dev translate "Hello World" -t ja -f en

# Chế độ tương tác với ngôn ngữ đích mặc định là tiếng Trung
npm run cli:dev interactive -t zh
```

## 🌐 Các ngôn ngữ được hỗ trợ

- `vi` - Tiếng Việt
- `en` - English
- `zh` - 中文
- `ja` - 日本語
- `ko` - 한국어
- `fr` - Français
- `de` - Deutsch
- `es` - Español
- `pt` - Português
- `ru` - Русский
- `ar` - العربية
- `th` - ไทย
- `id` - Bahasa Indonesia
- `ms` - Bahasa Melayu

Và nhiều ngôn ngữ khác (sử dụng mã ISO 639-1)

## 🛠️ Cấu trúc dự án

```
TranslateTool/
├── electron/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Preload script
├── src/
│   ├── App.tsx          # React component chính
│   ├── main.tsx         # React entry point
│   ├── styles.css       # CSS styling
│   ├── translator.ts    # Module dịch thuật
│   └── cli/
│       └── index.ts     # CLI application
├── dist/                # Built web assets
├── dist-electron/       # Built Electron files
├── dist-cli/            # Built CLI files
├── package.json
├── tsconfig.json
├── tsconfig.electron.json
├── tsconfig.cli.json
├── vite.config.ts
└── README.md
```

## 📦 Scripts

### Desktop App:
- `npm run electron:dev` - Chạy desktop app ở chế độ development (với hot reload cho React)
- `npm run electron:build` - Build desktop app thành file cài đặt
- `npm run build:electron` - Build Electron và web assets

### CLI:
- `npm run cli:dev` - Chạy CLI ở chế độ development
- `npm run cli:build` - Build CLI
- `npm run cli:start` - Chạy CLI đã build

### Web (Development):
- `npm run dev` - Chạy Vite dev server (chỉ cho React UI)
- `npm run preview` - Preview build

## 🔧 Phát triển

1. Clone repository
2. Cài đặt dependencies: `npm install`
3. Chạy desktop app: `npm run electron:dev`
4. Hoặc chạy CLI: `npm run cli:dev interactive`
5. Build: `npm run electron:build` hoặc `npm run cli:build`

## 🔥 Hot Reload

### React UI (Tự động - Không cần build):
- ✅ Sửa `src/App.tsx` → App tự động reload ngay
- ✅ Sửa `src/styles.css` → Styles tự động cập nhật ngay
- ✅ Sửa `src/main.tsx` → App tự động reload ngay

### Electron Main Process (Cần restart):
- ⚠️ Sửa `electron/main.ts` → Cần **restart app** (Ctrl+R hoặc đóng/mở lại)
- ⚠️ Sửa `electron/preload.ts` → Cần **restart app**
- ⚠️ Sửa `src/translator.ts` → Cần **restart app**

**Lý do:** Electron main process chạy trong Node.js environment, không thể hot reload như React UI.

## 🎨 Tính năng UI

- **Dark Theme**: Giao diện tối hiện đại
- **Responsive**: Tự động điều chỉnh theo kích thước màn hình
- **Smooth Animations**: Hiệu ứng mượt mà
- **Copy to Clipboard**: Sao chép văn bản dễ dàng
- **Language Detection**: Tự động phát hiện ngôn ngữ
- **Swap Languages**: Đổi ngôn ngữ nhanh chóng

## 📄 License

MIT

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

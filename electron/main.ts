/// <reference types="electron" />
import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Translator } from '../src/translator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const translator = new Translator();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    backgroundColor: '#1a1a1a',
    show: false,
    autoHideMenuBar: true, // Ẩn thanh menu bar
  });

  const window = mainWindow;
  if (!window) {
    return;
  }

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    window.loadURL('http://localhost:5173');
    // Chỉ mở DevTools khi có biến môi trường DEBUG
    // Bạn có thể mở DevTools thủ công bằng Ctrl+Shift+I hoặc F12
    // window.webContents.openDevTools();
  } else {
    window.loadFile(join(__dirname, '../dist/index.html'));
  }

  // Ẩn menu bar hoàn toàn
  window.setMenuBarVisibility(false);

  window.once('ready-to-show', () => {
    window.show();
  });

  window.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('translate', async (_event: any, text: string, targetLang: string, sourceLang?: string) => {
  try {
    const result = await translator.translate(text, targetLang, sourceLang);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi không xác định',
    };
  }
});

ipcMain.handle('get-languages', async () => {
  return translator.getSupportedLanguages();
});

export interface ElectronAPI {
  translate: (text: string, targetLang: string, sourceLang?: string) => Promise<{
    success: boolean;
    data?: {
      text: string;
      from: string;
      to: string;
      originalText: string;
    };
    error?: string;
  }>;
  getLanguages: () => Promise<Record<string, string>>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


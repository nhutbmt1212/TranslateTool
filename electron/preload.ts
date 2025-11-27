/// <reference types="electron" />
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  translate: (text: string, targetLang: string, sourceLang?: string) =>
    ipcRenderer.invoke('translate', text, targetLang, sourceLang),
  getLanguages: () => ipcRenderer.invoke('get-languages'),
});


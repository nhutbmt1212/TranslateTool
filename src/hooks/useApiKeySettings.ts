import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ApiKeyManager } from '../utils/apiKeyManager';

interface UseApiKeySettingsReturn {
  apiKey: string;
  setApiKey: (key: string) => void;
  maskedKey: string | null;
  showKey: boolean;
  setShowKey: (show: boolean) => void;
  isLoading: boolean;
  loadMaskedKey: () => Promise<void>;
  handleSave: () => Promise<boolean>;
  handleClear: () => Promise<void>;
}

/**
 * Custom hook để quản lý API Key settings
 * - Quản lý API key state và validation
 * - Handle save/clear operations
 * - Load masked key display
 */
export const useApiKeySettings = (): UseApiKeySettingsReturn => {
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadMaskedKey = useCallback(async () => {
    const masked = await ApiKeyManager.getMaskedApiKey();
    setMaskedKey(masked);
  }, []);

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!apiKey.trim()) {
      toast.error('API key cannot be empty');
      return false;
    }

    const validation = ApiKeyManager.validateApiKeyFormat(apiKey);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid API key');
      return false;
    }

    setIsLoading(true);
    try {
      await ApiKeyManager.saveApiKey(apiKey);
      toast.success('API key saved successfully!');
      setApiKey('');
      await loadMaskedKey();
      return true;
    } catch (err) {
      toast.error('Failed to save API key');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, loadMaskedKey]);

  const handleClear = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear the API key?')) {
      await ApiKeyManager.clearApiKey();
      setMaskedKey(null);
      setApiKey('');
      toast.success('API key cleared');
    }
  }, []);

  return {
    apiKey,
    setApiKey,
    maskedKey,
    showKey,
    setShowKey,
    isLoading,
    loadMaskedKey,
    handleSave,
    handleClear,
  };
};
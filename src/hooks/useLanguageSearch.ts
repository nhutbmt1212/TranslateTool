import { useCallback, useMemo, useState } from 'react';
import { Languages } from '../types/languages';

type PickerMode = 'source' | 'target';

interface UseLanguageSearchProps {
  languages: Languages;
  mode: PickerMode;
  autoDetectLabel: string;
}

interface UseLanguageSearchReturn {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredLanguages: Array<[string, string]>;
  clearSearch: () => void;
  sanitizeInput: (value: string) => string;
  isLetterKey: (value: string) => boolean;
}

/**
 * Custom hook để quản lý search/filter logic cho LanguagePickerModal
 * - Quản lý search term state
 * - Filter languages dựa trên search query
 * - Cung cấp helper functions cho keyboard input
 * - Tối ưu performance với useMemo
 */
export const useLanguageSearch = ({
  languages,
  mode,
  autoDetectLabel,
}: UseLanguageSearchProps): UseLanguageSearchReturn => {
  const [searchTerm, setSearchTerm] = useState('');

  // Tạo base language entries với sorting và auto-detect
  const baseLanguageEntries = useMemo(() => {
    const entries = Object.entries(languages).sort((a, b) =>
      a[1].localeCompare(b[1], undefined, { sensitivity: 'base' })
    ) as Array<[string, string]>;

    if (mode === 'source') {
      return [['auto', autoDetectLabel] as [string, string], ...entries];
    }

    return entries;
  }, [languages, mode, autoDetectLabel]);

  // Filter languages dựa trên search term
  const filteredLanguages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return baseLanguageEntries;
    }

    return baseLanguageEntries.filter(([code, name]) => {
      const haystack = `${name} ${code}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [baseLanguageEntries, searchTerm]);

  // Helper function để sanitize input (chỉ cho phép letters)
  const sanitizeInput = useCallback((value: string) => value.replace(/[^\p{L}]/gu, ''), []);

  // Helper function để check xem key có phải là letter không
  const isLetterKey = useCallback((value: string) => /^\p{L}$/u.test(value), []);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredLanguages,
    clearSearch,
    sanitizeInput,
    isLetterKey,
  };
};
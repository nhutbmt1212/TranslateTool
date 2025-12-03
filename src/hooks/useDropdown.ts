import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDropdownReturn {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  ref: React.RefObject<HTMLDivElement>;
}

/**
 * Custom hook để quản lý dropdown state và behavior
 * - Quản lý toggle state
 * - Tự động đóng khi click ra ngoài
 * - Cung cấp ref cho container element
 */
export const useDropdown = (): UseDropdownReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Sử dụng useCallback để tránh re-render không cần thiết
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Chỉ add event listener khi dropdown đang mở để tối ưu performance
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    close,
    open,
    ref,
  };
};
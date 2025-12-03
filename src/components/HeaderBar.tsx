import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeIcon, ChevronDownIcon, MoonIcon, SunIcon, SettingsIcon } from './icons';
import { useDropdown } from '../hooks/useDropdown';

interface HeaderBarProps {
  uiLanguageOptions: { code: string; label: string }[];
  currentUiLanguage: string;
  onUiLanguageChange: (code: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onOpenSettings: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  uiLanguageOptions,
  currentUiLanguage,
  onUiLanguageChange,
  theme,
  onThemeToggle,
  onOpenSettings,
}) => {
  const { t } = useTranslation();
  const dropdown = useDropdown();

  const currentLabel = useMemo(() =>
    uiLanguageOptions.find((option) => option.code === currentUiLanguage)?.label ||
    currentUiLanguage,
    [uiLanguageOptions, currentUiLanguage]
  );

  const handleUiMenuSelect = useCallback((code: string) => {
    onUiLanguageChange(code);
    dropdown.close();
  }, [onUiLanguageChange, dropdown]);

  const themeToggleLabel = useMemo(() =>
    theme === 'light'
      ? t('header.switchDark', 'Switch to dark mode')
      : t('header.switchLight', 'Switch to light mode'),
    [theme, t]
  );

  return (
    <header className="header hero-banner">
      <div className="hero-text">
        <p className="brand-eyebrow">POWERED BY AI</p>
        <h1>{t('app.title')}</h1>
        <p className="subtitle">{t('app.subtitle')}</p>
      </div>
      <div className="hero-actions">
        <div className="hero-select-wrapper" ref={dropdown.ref}>
          <button
            type="button"
            className={`hero-select${dropdown.isOpen ? ' open' : ''}`}
            onClick={dropdown.toggle}
            aria-haspopup="listbox"
            aria-expanded={dropdown.isOpen}
          >
            <span className="hero-select-icon" aria-hidden="true">
              <GlobeIcon size={18} />
            </span>
            <span className="hero-select-text">{currentLabel}</span>
            <span className="hero-select-caret" aria-hidden="true">
              <ChevronDownIcon size={16} />
            </span>
          </button>
          {dropdown.isOpen && (
            <div className="hero-menu" role="listbox">
              {uiLanguageOptions.map((option) => (
                <button
                  type="button"
                  key={option.code}
                  role="option"
                  aria-selected={option.code === currentUiLanguage}
                  className={`hero-option${option.code === currentUiLanguage ? ' active' : ''}`}
                  onClick={() => handleUiMenuSelect(option.code)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="hero-toggle"
          onClick={onThemeToggle}
          aria-label={themeToggleLabel}
        >
          <span className="hero-toggle-icon" aria-hidden="true">
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </span>
          <span>{theme === 'light' ? t('header.darkMode', 'Dark') : t('header.lightMode', 'Light')}</span>
        </button>
        <button
          type="button"
          className="hero-button"
          onClick={onOpenSettings}
          aria-label={t('header.settings', 'Settings')}
        >
          <span className="hero-button-icon" aria-hidden="true">
            <SettingsIcon size={18} />
          </span>
          <span>{t('header.settings', 'Settings')}</span>
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;

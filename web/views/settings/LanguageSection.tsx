import { FaGlobe, FaChevronDown } from 'react-icons/fa6';
import { useState, useRef, useEffect } from 'react';
import { useLanguageQuery, useSetLanguageMutation } from '../../hooks/useQueries';
import { LANGUAGE_OPTIONS } from '../../shared/i18n';
import { useI18n } from '../../contexts/I18nContext';
import { DEFAULT_LANGUAGE, type Language } from '../../shared/settings';

export function LanguageSection() {
  const t = useI18n();
  const { data: language = DEFAULT_LANGUAGE } = useLanguageQuery();
  const setLanguageMutation = useSetLanguageMutation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguageMutation.mutate(lang);
    setIsOpen(false);
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-secondary border border-theme">
      <h3 className="text-lg font-semibold mb-4">{t.settings.language.title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaGlobe className="text-secondary" />
          <span>{t.settings.language.label}</span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-tertiary text-primary hover:opacity-80 transition-opacity"
            aria-label={t.settings.language.label}
          >
            <span>{selectedOption?.nativeName ?? language}</span>
            <FaChevronDown className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-1 bg-secondary border border-theme rounded-lg shadow-lg p-1 min-w-[120px] z-10">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleSelect(option.code)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-tertiary transition-colors ${
                    option.code === language ? 'bg-tertiary' : ''
                  }`}
                >
                  {option.nativeName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

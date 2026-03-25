import { FaSun, FaMoon } from 'react-icons/fa6';
import {
  useThemeQuery,
  useSetThemeMutation,
  useAnimationsEnabledQuery,
  useSetAnimationsEnabledMutation,
} from '../../hooks/useQueries';
import { DEFAULT_THEME } from '../../shared/settings';
import { useI18n } from '../../contexts/I18nContext';

interface SettingsSwitchProps {
  label: string;
  isSelected: boolean;
  onChange: () => void;
  leftIcon?: (isSelected: boolean) => React.ReactNode;
  rightIcon?: (isSelected: boolean) => React.ReactNode;
}

function SettingsSwitch({ label, isSelected, onChange, leftIcon, rightIcon }: SettingsSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isSelected ? 'bg-accent' : 'bg-tertiary border border-theme'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            isSelected ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export function AppearanceSection() {
  const t = useI18n();
  const { data: theme = DEFAULT_THEME } = useThemeQuery();
  const setThemeMutation = useSetThemeMutation();
  const { data: animationsEnabled = true } = useAnimationsEnabledQuery();
  const setAnimationsEnabledMutation = useSetAnimationsEnabledMutation();

  const toggleTheme = () => {
    setThemeMutation.mutate(theme === 'light' ? 'dark' : 'light');
  };

  const toggleAnimations = () => {
    setAnimationsEnabledMutation.mutate(!animationsEnabled);
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-secondary border border-theme">
      <h3 className="text-lg font-semibold mb-4">{t.settings.appearance.title}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaSun className={`text-sm ${theme !== 'dark' ? 'text-yellow-500' : 'text-secondary'}`} />
            <span>{t.settings.appearance.darkMode}</span>
            <FaMoon className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-secondary'}`} />
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-accent' : 'bg-tertiary border border-theme'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        <SettingsSwitch
          label={t.settings.appearance.enableAnimations}
          isSelected={animationsEnabled}
          onChange={toggleAnimations}
        />
      </div>
    </div>
  );
}

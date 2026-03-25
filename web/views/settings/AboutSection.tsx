import { FaGithub } from 'react-icons/fa6';
import { useI18n } from '../../contexts/I18nContext';

export function AboutSection() {
  const t = useI18n();

  return (
    <div className="mb-6 p-4 rounded-lg bg-secondary border border-theme">
      <h3 className="text-lg font-semibold mb-4">{t.settings.about.title}</h3>
      <div className="space-y-3 text-sm">
        <p className="text-secondary">{t.settings.about.feedbackMessage}</p>
        <a
          href="https://github.com/matthewdmdrake/LeetSRS"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent hover:underline"
        >
          <FaGithub />
          {t.settings.about.github}
        </a>
        <p className="text-secondary text-xs mt-4">{t.settings.about.copyright}</p>
      </div>
    </div>
  );
}

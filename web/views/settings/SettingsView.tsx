import { ViewLayout } from '../../components/ViewLayout';
import { useI18n } from '../../contexts/I18nContext';
import { LanguageSection } from './LanguageSection';
import { AppearanceSection } from './AppearanceSection';
import { ReviewSettingsSection } from './ReviewSettingsSection';
import { GistSyncSection } from './GistSyncSection';
import { DataSection } from './DataSection';
import { AboutSection } from './AboutSection';
import { DonateSection } from './DonateSection';

export function SettingsView() {
  const t = useI18n();
  return (
    <ViewLayout title={t.settings.title}>
      <LanguageSection />
      <AppearanceSection />
      <ReviewSettingsSection />
      <GistSyncSection />
      <DataSection />
      <DonateSection />
      <AboutSection />
    </ViewLayout>
  );
}

import { ViewLayout } from '../../components/ViewLayout';
import { StatsBar } from './StatsBar';
import { ReviewQueue } from './ReviewQueue';
import { StreakCounter } from '../../components/StreakCounter';
import { useI18n } from '../../contexts/I18nContext';

export function HomeView() {
  const t = useI18n();
  
  return (
    <ViewLayout
      title={t.nav.home}
      headerContent={
        <div className="flex items-center justify-end gap-4 w-full">
          <StatsBar />
          <StreakCounter />
        </div>
      }
    >
      <ReviewQueue />
    </ViewLayout>
  );
}

import { useReviewQueueQuery } from '../../hooks/useQueries';
import { State } from 'ts-fsrs';
import { useI18n } from '../../contexts/I18nContext';

interface StatItemProps {
  count: number;
  label: string;
  colorClass: string;
}

function StatItem({ count, label, colorClass }: StatItemProps) {
  return (
    <span className="flex items-center gap-1">
      <span className={`font-semibold ${colorClass}`}>{count}</span>
      <span className="text-secondary">{label}</span>
    </span>
  );
}

export function StatsBar() {
  const t = useI18n();
  const { data: cards = [] } = useReviewQueueQuery();

  const stats = cards.reduce(
    (acc, card) => {
      switch (card.fsrs?.state) {
        case State.Review:
          acc.reviews++;
          break;
        case State.New:
          acc.new++;
          break;
        case State.Learning:
        case State.Relearning:
          acc.learn++;
          break;
        default:
          break;
      }
      return acc;
    },
    { reviews: 0, new: 0, learn: 0 }
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      <StatItem count={stats.reviews} label={t.statsBar.review} colorClass="text-blue-500" />
      <span className="text-tertiary">•</span>
      <StatItem count={stats.new} label={t.statsBar.new} colorClass="text-green-500" />
      <span className="text-tertiary">•</span>
      <StatItem count={stats.learn} label={t.statsBar.learn} colorClass="text-red-500" />
    </div>
  );
}

import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import type { Difficulty, Card } from '../../shared/cards';
import { Rating } from 'ts-fsrs';
import type { Grade } from 'ts-fsrs';
import { bounceButton } from '../../shared/styles';
import { useI18n } from '../../contexts/I18nContext';

type ReviewCardProps = {
  card: Pick<Card, 'slug' | 'leetcodeId' | 'name' | 'difficulty' | 'domain'>;
  onRate: (rating: Grade) => void;
  isProcessing?: boolean;
};

type RatingButtonConfig = {
  rating: Grade;
  labelKey: 'again' | 'hard' | 'good' | 'easy';
  colorClass: string;
};

const difficultyColorMap: Record<Difficulty, string> = {
  Easy: 'bg-green-500',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-500',
};

const ratingButtonConfigs: RatingButtonConfig[] = [
  { rating: Rating.Again, labelKey: 'again', colorClass: 'bg-red-500' },
  { rating: Rating.Hard, labelKey: 'hard', colorClass: 'bg-orange-500' },
  { rating: Rating.Good, labelKey: 'good', colorClass: 'bg-blue-500' },
  { rating: Rating.Easy, labelKey: 'easy', colorClass: 'bg-green-500' },
];

export function ReviewCard({ card, onRate, isProcessing = false }: ReviewCardProps) {
  const t = useI18n();
  const difficultyColor = difficultyColorMap[card.difficulty] || 'bg-yellow-500';

  const handleRating = (rating: Grade) => {
    onRate(rating);
  };

  const handleOpenLeetCode = (e: React.MouseEvent) => {
    e.preventDefault();
    const domain = card.domain || 'leetcode.com';
    const url = `https://${domain}/problems/${card.slug}/description/`;
    // 使用 window.open 确保在新窗口/标签页打开
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-secondary rounded-lg p-4 flex flex-col gap-3 border border-theme">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-secondary">#{card.leetcodeId}</span>
        <span className={`text-xs px-2 py-1 rounded text-white ${difficultyColor}`}>{card.difficulty}</span>
      </div>

      <div className="flex justify-center pb-3 -mt-1 text-center">
        <button
          onClick={handleOpenLeetCode}
          className="text-lg font-semibold text-primary hover:text-accent transition-colors"
        >
          {card.name}
          <FaArrowUpRightFromSquare className="inline ml-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="flex gap-2 justify-center">
        {ratingButtonConfigs.map(({ rating, labelKey, colorClass }) => (
          <button
            key={labelKey}
            onClick={() => handleRating(rating)}
            disabled={isProcessing}
            className={`w-20 py-1.5 rounded text-sm ${colorClass} text-white hover:opacity-90 ${bounceButton} disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
          >
            {t.ratings[labelKey]}
          </button>
        ))}
      </div>
    </div>
  );
}

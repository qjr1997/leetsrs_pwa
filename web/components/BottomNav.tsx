import { IconType } from 'react-icons';
import { MdHome, MdStyle, MdBarChart, MdSettings } from 'react-icons/md';
import { useI18n } from '../contexts/I18nContext';
import { useReviewQueueQuery } from '../hooks/useQueries';

export type ViewId = 'home' | 'card' | 'stats' | 'settings';

interface NavItem {
  id: ViewId;
  icon: IconType;
  labelKey: keyof { nav: { home: string; cards: string; stats: string; settings: string } }['nav'];
}

const navItems: NavItem[] = [
  { id: 'home', icon: MdHome, labelKey: 'home' },
  { id: 'card', icon: MdStyle, labelKey: 'cards' },
  { id: 'stats', icon: MdBarChart, labelKey: 'stats' },
  { id: 'settings', icon: MdSettings, labelKey: 'settings' },
];

interface BottomNavProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const t = useI18n();
  const { data: reviewQueue = [] } = useReviewQueueQuery();
  
  // Calculate total due cards for badge
  const dueCount = reviewQueue.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-secondary border-t border-theme flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        const isHome = item.id === 'home';
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
              isActive ? 'text-accent' : 'text-secondary'
            }`}
          >
            <div className="relative">
              <Icon className="w-6 h-6" />
              {/* Show badge on Home icon when there are due cards */}
              {isHome && dueCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {dueCount > 99 ? '99+' : dueCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{t.nav[item.labelKey]}</span>
          </button>
        );
      })}
    </nav>
  );
}

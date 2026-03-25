import { useState } from 'react';
import { FaForwardStep, FaForwardFast, FaPause } from 'react-icons/fa6';
import { bounceButton } from '../../shared/styles';
import type { IconType } from 'react-icons';
import { useI18n } from '../../contexts/I18nContext';

interface ActionsSectionProps {
  onDelete: () => void;
  onDelay: (days: number) => void;
  onPause: () => void;
}

interface ActionButtonProps {
  icon: IconType;
  label: string;
  onClick: () => void;
}

function ActionButton({ icon: Icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded text-sm bg-tertiary text-primary hover:bg-secondary transition-colors ${bounceButton}`}
      onClick={onClick}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </button>
  );
}

export function ActionsSection({ onDelete, onDelay, onPause }: ActionsSectionProps) {
  const t = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div className="bg-secondary rounded-lg overflow-hidden border border-theme">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-tertiary transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold text-primary">{t.actionsSection.title}</span>
        <span className={`text-xs text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-theme">
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <ActionButton icon={FaForwardStep} label={t.actionsSection.delay1Day} onClick={() => onDelay(1)} />
              <ActionButton icon={FaForwardFast} label={t.actionsSection.delay5Days} onClick={() => onDelay(5)} />
              <ActionButton icon={FaPause} label={t.actions.pause} onClick={onPause} />
            </div>

            <div className="pt-2 border-t border-theme">
              <button
                className={`w-full px-4 py-2 rounded text-sm ${
                  deleteConfirm ? 'bg-red-700' : 'bg-red-500'
                } text-white hover:opacity-90 transition-colors ${bounceButton}`}
                onClick={() => {
                  if (!deleteConfirm) {
                    setDeleteConfirm(true);
                    setTimeout(() => setDeleteConfirm(false), 3000);
                  } else {
                    onDelete();
                    setDeleteConfirm(false);
                  }
                }}
              >
                {deleteConfirm ? t.actions.confirmDelete : t.actionsSection.deleteCard}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

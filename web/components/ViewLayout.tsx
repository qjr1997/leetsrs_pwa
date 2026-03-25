import type { ReactNode } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface ViewLayoutProps {
  title?: string;
  children: ReactNode;
  headerContent?: ReactNode;
}

export function ViewLayout({ title, children, headerContent }: ViewLayoutProps) {
  const t = useI18n();
  
  return (
    <div className="h-full flex flex-col">
      {(title || headerContent) && (
        <div className="flex items-center justify-between p-4 border-b border-theme shrink-0">
          {title && <h1 className="text-xl font-bold">{title}</h1>}
          {headerContent}
        </div>
      )}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}

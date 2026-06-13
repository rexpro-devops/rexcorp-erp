import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ReportViewIcon,
  ListViewIcon,
  KanbanViewIcon,
} from './IconLibrary';

export type ViewMode = 'report' | 'list' | 'kanban';

interface ViewModeSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
}

const VIEW_OPTIONS: Record<ViewMode, { label: string; icon: React.FC }> = {
  report: {
    label: 'Report',
    icon: ReportViewIcon,
  },
  list: {
    label: 'List',
    icon: ListViewIcon,
  },
  kanban: {
    label: 'Kanban',
    icon: KanbanViewIcon,
  },
};

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  currentView,
  onViewChange,
  availableViews = ['report', 'list', 'kanban'],
}) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      {availableViews.map((view) => {
        const option = VIEW_OPTIONS[view];
        const Icon = option.icon;

        return (
          <Button
            key={view}
            variant={currentView === view ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(view)}
            title={option.label}
            className={`p-2 h-auto ${
              currentView === view
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon />
          </Button>
        );
      })}
    </div>
  );
};

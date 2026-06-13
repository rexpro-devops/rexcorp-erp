import React, { useMemo } from 'react';
import { GripIcon } from './IconLibrary';

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  count?: number;
}

interface KanbanViewProps<T> {
  items: T[];
  columns: KanbanColumn[];
  getItemColumn: (item: T) => string;
  getItemId: (item: T, index: number) => string;
  renderCard: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void;
  onDragStart?: (item: T, columnId: string) => void;
  emptyMessage?: string;
}

export const KanbanView = React.forwardRef<HTMLDivElement, KanbanViewProps<any>>(
  (
    {
      items,
      columns,
      getItemColumn,
      getItemId,
      renderCard,
      onCardClick,
      onDragStart,
      emptyMessage = 'No items',
    },
    ref
  ) => {
    // Group items by column
    const groupedItems = useMemo(() => {
      const groups: Record<string, any[]> = {};
      columns.forEach((col) => {
        groups[col.id] = [];
      });

      items.forEach((item) => {
        const columnId = getItemColumn(item);
        if (groups[columnId]) {
          groups[columnId].push(item);
        }
      });

      return groups;
    }, [items, columns]);

    return (
      <div
        ref={ref}
        className="overflow-x-auto pb-4"
      >
        <div className="inline-flex gap-4 min-w-full px-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col w-80 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Column Header */}
              <div
                className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${
                  column.color
                    ? column.color
                    : 'bg-white dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                    {groupedItems[column.id]?.length || 0}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {groupedItems[column.id]?.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                    {emptyMessage}
                  </div>
                ) : (
                  groupedItems[column.id]?.map((item, index) => (
                    <div
                      key={getItemId(item, index)}
                      draggable
                      onDragStart={() => onDragStart?.(item, column.id)}
                      onClick={() => onCardClick?.(item)}
                      className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <GripIcon className="text-gray-300 dark:text-gray-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" size="sm" />
                        <div className="flex-1 min-w-0">
                          {renderCard(item)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

KanbanView.displayName = 'KanbanView';

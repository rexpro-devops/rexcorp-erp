import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export interface ListItemFieldDef<T> {
  id: string;
  label?: string;
  accessorKey?: keyof T;
  accessorFn?: (item: T) => any;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface ListViewProps<T> {
  items: T[];
  fields: ListItemFieldDef<T>[];
  getItemId?: (item: T, index: number) => string;
  onItemSelect?: (selectedIds: string[]) => void;
  selectable?: boolean;
  renderCard?: (item: T, isSelected: boolean) => React.ReactNode;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
}

export const ListView = React.forwardRef<HTMLDivElement, ListViewProps<any>>(
  (
    {
      items,
      fields,
      getItemId = (_, i) => String(i),
      onItemSelect,
      selectable = true,
      renderCard,
      onItemClick,
      emptyMessage = 'No items available',
    },
    ref
  ) => {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        const allIds = new Set(items.map((item, i) => getItemId(item, i)));
        setSelectedItems(allIds);
        onItemSelect?.(Array.from(allIds));
      } else {
        setSelectedItems(new Set());
        onItemSelect?.([]);
      }
    };

    const handleSelectItem = (itemId: string, checked: boolean) => {
      const newSelected = new Set(selectedItems);
      if (checked) {
        newSelected.add(itemId);
      } else {
        newSelected.delete(itemId);
      }
      setSelectedItems(newSelected);
      onItemSelect?.(Array.from(newSelected));
    };

    if (items.length === 0) {
      return (
        <div
          ref={ref}
          className="py-12 text-center text-gray-500 dark:text-gray-400"
        >
          {emptyMessage}
        </div>
      );
    }

    return (
      <div ref={ref} className="space-y-3">
        {/* Select All Option */}
        {selectable && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Checkbox
              checked={selectedItems.size === items.length && items.length > 0}
              indeterminate={selectedItems.size > 0 && selectedItems.size < items.length}
              onCheckedChange={(checked) =>
                handleSelectAll(checked as boolean)
              }
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedItems.size > 0
                ? `${selectedItems.size} selected`
                : 'Select all'}
            </span>
          </div>
        )}

        {/* List Items */}
        {items.map((item, index) => {
          const itemId = getItemId(item, index);
          const isSelected = selectedItems.has(itemId);

          if (renderCard) {
            return (
              <div
                key={itemId}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                    : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                } hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer`}
                onClick={() => onItemClick?.(item)}
              >
                {selectable && (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleSelectItem(itemId, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div className="flex-1 min-w-0">
                  {renderCard(item, isSelected)}
                </div>
              </div>
            );
          }

          return (
            <div
              key={itemId}
              className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
              } hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer`}
              onClick={() => onItemClick?.(item)}
            >
              {selectable && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleSelectItem(itemId, checked as boolean)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <div className="flex-1 space-y-2">
                {fields.map((field) => {
                  const value = field.accessorFn
                    ? field.accessorFn(item)
                    : (item as any)[field.accessorKey as string];

                  return (
                    <div key={field.id} className={field.className}>
                      {field.label && (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {field.label}
                        </span>
                      )}
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {field.render ? field.render(item) : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

ListView.displayName = 'ListView';

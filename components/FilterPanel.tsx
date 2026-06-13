import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FilterIcon, CloseIcon } from './IconLibrary';
import type { FilterState } from '../hooks/useFilters';

interface FilterPanelProps {
  filters: FilterState;
  onToggleFilter: (groupId: string, optionId: string) => void;
  onSetFilterValue: (groupId: string, value: string | string[] | { start: string; end: string }) => void;
  onClearAllFilters: () => void;
  onClearFilter: (groupId: string) => void;
  activeFilterCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onToggleFilter,
  onSetFilterValue,
  onClearAllFilters,
  onClearFilter,
  activeFilterCount,
}) => {
  return (
    <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="space-y-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="text-gray-600 dark:text-gray-400" size="md" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Filter Groups */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(filters).map(([groupId, group]) => (
            <div key={groupId} className="space-y-2">
              {/* Group Label */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {group.label}
                </label>
                {group.type === 'checkbox' && group.options.some((opt) => opt.checked) && (
                  <button
                    onClick={() => onClearFilter(groupId)}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Checkbox Group */}
              {group.type === 'checkbox' && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {group.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center space-x-2 cursor-pointer rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Checkbox
                        checked={option.checked}
                        onCheckedChange={() => onToggleFilter(groupId, option.id)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Select Group */}
              {group.type === 'select' && (
                <Select
                  value={String(group.value || '')}
                  onValueChange={(value) => onSetFilterValue(groupId, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {group.options.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Search Group */}
              {group.type === 'search' && (
                <Input
                  type="text"
                  placeholder={`Search ${group.label.toLowerCase()}...`}
                  value={String(group.value || '')}
                  onChange={(e) => onSetFilterValue(groupId, e.target.value)}
                  className="w-full text-sm"
                />
              )}

              {/* Date Range Group */}
              {group.type === 'date-range' && (
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={
                      group.value && typeof group.value === 'object'
                        ? group.value.start
                        : ''
                    }
                    onChange={(e) => {
                      const start = e.target.value;
                      const end =
                        group.value && typeof group.value === 'object'
                          ? group.value.end
                          : '';
                      onSetFilterValue(groupId, { start, end });
                    }}
                    className="w-full text-sm"
                    placeholder="Start date"
                  />
                  <Input
                    type="date"
                    value={
                      group.value && typeof group.value === 'object'
                        ? group.value.end
                        : ''
                    }
                    onChange={(e) => {
                      const end = e.target.value;
                      const start =
                        group.value && typeof group.value === 'object'
                          ? group.value.start
                          : '';
                      onSetFilterValue(groupId, { start, end });
                    }}
                    className="w-full text-sm"
                    placeholder="End date"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

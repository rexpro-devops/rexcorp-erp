import { useState, useMemo, useCallback } from 'react';

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'select' | 'date-range' | 'search';
  options: FilterOption[];
  value?: string | string[] | { start: string; end: string };
}

export interface FilterState {
  [groupId: string]: FilterGroup;
}

export const useFilters = <T extends Record<string, any>>(
  data: T[],
  initialFilters: FilterState,
  filterFn?: (item: T, filters: FilterState) => boolean
) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Toggle a checkbox filter option
  const toggleFilter = useCallback(
    (groupId: string, optionId: string) => {
      setFilters((prev) => {
        const group = prev[groupId];
        if (!group) return prev;

        return {
          ...prev,
          [groupId]: {
            ...group,
            options: group.options.map((opt) =>
              opt.id === optionId ? { ...opt, checked: !opt.checked } : opt
            ),
          },
        };
      });
    },
    []
  );

  // Set select filter value
  const setFilterValue = useCallback(
    (groupId: string, value: string | string[] | { start: string; end: string }) => {
      setFilters((prev) => {
        const group = prev[groupId];
        if (!group) return prev;

        return {
          ...prev,
          [groupId]: {
            ...group,
            value,
          },
        };
      });
    },
    []
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters((prev) => {
      const cleared: FilterState = {};
      Object.entries(prev).forEach(([key, group]) => {
        cleared[key] = {
          ...group,
          options: group.options.map((opt) => ({ ...opt, checked: false })),
          value: undefined,
        };
      });
      return cleared;
    });
  }, []);

  // Clear specific filter group
  const clearFilter = useCallback((groupId: string) => {
    setFilters((prev) => {
      const group = prev[groupId];
      if (!group) return prev;

      return {
        ...prev,
        [groupId]: {
          ...group,
          options: group.options.map((opt) => ({ ...opt, checked: false })),
          value: undefined,
        },
      };
    });
  }, []);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (filterFn) {
      return data.filter((item) => filterFn(item, filters));
    }

    // Default filtering: check checkbox selections
    return data.filter((item) => {
      for (const group of Object.values(filters)) {
        if (group.type === 'checkbox') {
          const checkedOptions = group.options.filter((opt) => opt.checked);
          if (checkedOptions.length > 0) {
            // Item must match at least one checked option in this group
            const itemValue = (item as any)[group.id];
            const matches = checkedOptions.some(
              (opt) =>
                opt.id === itemValue ||
                String(itemValue).toLowerCase().includes(opt.label.toLowerCase())
            );
            if (!matches) return false;
          }
        }
      }
      return true;
    });
  }, [data, filters, filterFn]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.values(filters).forEach((group) => {
      if (group.type === 'checkbox') {
        count += group.options.filter((opt) => opt.checked).length;
      } else if (group.value) {
        count += 1;
      }
    });
    return count;
  }, [filters]);

  return {
    filters,
    toggleFilter,
    setFilterValue,
    clearAllFilters,
    clearFilter,
    filteredData,
    activeFilterCount,
  };
};

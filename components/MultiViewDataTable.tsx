import React, { useState, ReactNode } from 'react';
import { ViewModeSelector, type ViewMode } from './ViewModeSelector';
import { FilterPanel } from './FilterPanel';
import { ReportView, type ColumnDef } from './ReportView';
import { ListView, type ListItemFieldDef } from './ListView';
import { KanbanView, type KanbanColumn } from './KanbanView';
import { useFilters, type FilterState } from '../hooks/useFilters';

interface MultiViewDataTableProps<T> {
  title: string;
  data: T[];
  initialFilters: FilterState;
  filterFn?: (item: T, filters: FilterState) => boolean;
  reportColumns: ColumnDef<T>[];
  listFields: ListItemFieldDef<T>[];
  kanbanColumns: KanbanColumn[];
  getItemId?: (item: T, index: number) => string;
  getItemColumn?: (item: T) => string;
  renderListCard?: (item: T) => ReactNode;
  renderKanbanCard?: (item: T) => ReactNode;
  onItemClick?: (item: T) => void;
  availableViews?: ViewMode[];
}

export const MultiViewDataTable = React.forwardRef<HTMLDivElement, MultiViewDataTableProps<any>>(
  (
    {
      title,
      data,
      initialFilters,
      filterFn,
      reportColumns,
      listFields,
      kanbanColumns,
      getItemId = (_, i) => String(i),
      getItemColumn = (item) => (item as any).status || 'default',
      renderListCard,
      renderKanbanCard,
      onItemClick,
      availableViews = ['report', 'list', 'kanban'],
    },
    ref
  ) => {
    const [viewMode, setViewMode] = useState<ViewMode>(
      (availableViews[0] as ViewMode) || 'report'
    );
    const {
      filters,
      toggleFilter,
      setFilterValue,
      clearAllFilters,
      clearFilter,
      filteredData,
      activeFilterCount,
    } = useFilters(data, initialFilters, filterFn);

    return (
      <div ref={ref} className="w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <ViewModeSelector
            currentView={viewMode}
            onViewChange={setViewMode}
            availableViews={availableViews}
          />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onToggleFilter={toggleFilter}
          onSetFilterValue={setFilterValue}
          onClearAllFilters={clearAllFilters}
          onClearFilter={clearFilter}
          activeFilterCount={activeFilterCount}
        />

        {/* Data Display Based on View Mode */}
        <div className="bg-white dark:bg-gray-900 rounded-lg">
          {viewMode === 'report' && availableViews.includes('report') && (
            <ReportView
              columns={reportColumns}
              data={filteredData}
              getRowId={getItemId}
              selectable={true}
              striped={true}
            />
          )}

          {viewMode === 'list' && availableViews.includes('list') && (
            <div className="p-4">
              <ListView
                items={filteredData}
                fields={listFields}
                getItemId={getItemId}
                selectable={true}
                renderCard={renderListCard}
                onItemClick={onItemClick}
              />
            </div>
          )}

          {viewMode === 'kanban' && availableViews.includes('kanban') && (
            <div className="p-4">
              <KanbanView
                items={filteredData}
                columns={kanbanColumns}
                getItemColumn={getItemColumn}
                getItemId={getItemId}
                renderCard={renderKanbanCard || ((item) => <div>{String(item)}</div>)}
                onCardClick={onItemClick}
              />
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredData.length} of {data.length} items
          </span>
          {activeFilterCount > 0 && (
            <span>
              {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    );
  }
);

MultiViewDataTable.displayName = 'MultiViewDataTable';

export default MultiViewDataTable;

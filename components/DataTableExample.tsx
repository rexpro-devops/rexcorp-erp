import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ViewModeSelector, type ViewMode } from './ViewModeSelector';
import { FilterPanel } from './FilterPanel';
import { ReportView, type ColumnDef } from './ReportView';
import { ListView, type ListItemFieldDef } from './ListView';
import { KanbanView, type KanbanColumn } from './KanbanView';
import { useFilters, type FilterState } from '../hooks/useFilters';

// Example data type
export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  title: string;
  customer: string;
  company: string;
  grandTotal: number;
  status: 'Paid' | 'Overdue' | 'Draft' | 'Return';
  currency: string;
  customerName: string;
  lastUpdated: string;
}

// Status color mapping
const getStatusColor = (status: SalesInvoice['status']) => {
  const colors: Record<SalesInvoice['status'], string> = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    Return: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };
  return colors[status];
};

interface DataTableExampleProps {
  title: string;
  data: SalesInvoice[];
  initialFilters?: FilterState;
  filterFn?: (item: SalesInvoice, filters: FilterState) => boolean;
}

export const DataTableExample: React.FC<DataTableExampleProps> = ({
  title,
  data,
  initialFilters = {
    status: {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      options: [
        { id: 'Paid', label: 'Paid', checked: false },
        { id: 'Overdue', label: 'Overdue', checked: false },
        { id: 'Draft', label: 'Draft', checked: false },
        { id: 'Return', label: 'Return', checked: false },
      ],
    },
    currency: {
      id: 'currency',
      label: 'Currency',
      type: 'checkbox',
      options: [
        { id: 'INR', label: 'INR', checked: false },
        { id: 'EUR', label: 'EUR', checked: false },
        { id: 'USD', label: 'USD', checked: false },
      ],
    },
  },
  filterFn,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('report');
  const {
    filters,
    toggleFilter,
    setFilterValue,
    clearAllFilters,
    clearFilter,
    filteredData,
    activeFilterCount,
  } = useFilters(data, initialFilters, filterFn);

  // Report View Columns
  const reportColumns: ColumnDef<SalesInvoice>[] = [
    {
      id: 'invoiceNumber',
      header: 'Invoice #',
      accessorKey: 'invoiceNumber',
      sortable: true,
      width: 'w-24',
    },
    {
      id: 'title',
      header: 'Title',
      accessorKey: 'title',
      sortable: true,
    },
    {
      id: 'customer',
      header: 'Customer',
      accessorKey: 'customer',
      sortable: true,
    },
    {
      id: 'company',
      header: 'Company',
      accessorKey: 'company',
      sortable: true,
    },
    {
      id: 'grandTotal',
      header: 'Grand Total',
      render: (row) => (
        <span className="font-medium">
          {row.currency} {row.grandTotal.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row) => (
        <Badge className={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      ),
    },
  ];

  // List View Fields
  const listFields: ListItemFieldDef<SalesInvoice>[] = [
    {
      id: 'title',
      accessorKey: 'title',
      className: 'flex flex-col gap-1',
      render: (item) => (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {item.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.invoiceNumber}
          </p>
        </div>
      ),
    },
    {
      id: 'customer',
      label: 'Customer',
      accessorKey: 'customer',
      className: 'text-sm',
    },
    {
      id: 'status',
      render: (item) => (
        <Badge className={getStatusColor(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      id: 'grandTotal',
      label: 'Amount',
      render: (item) => (
        <span className="font-semibold">
          {item.currency} {item.grandTotal.toLocaleString()}
        </span>
      ),
    },
  ];

  // Kanban View Columns
  const kanbanColumns: KanbanColumn[] = [
    { id: 'Draft', title: 'Draft', color: 'bg-gray-50 dark:bg-gray-800' },
    { id: 'Paid', title: 'Paid', color: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'Overdue', title: 'Overdue', color: 'bg-red-50 dark:bg-red-900/20' },
    { id: 'Return', title: 'Return', color: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <ViewModeSelector currentView={viewMode} onViewChange={setViewMode} />
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
        {viewMode === 'report' && (
          <ReportView
            columns={reportColumns}
            data={filteredData}
            getRowId={(row) => row.id}
            selectable={true}
            striped={true}
          />
        )}

        {viewMode === 'list' && (
          <div className="p-4">
            <ListView
              items={filteredData}
              fields={listFields}
              getItemId={(item) => item.id}
              selectable={true}
              renderCard={(item) => (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.invoiceNumber}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.customer}
                    </span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.currency}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="p-4">
            <KanbanView
              items={filteredData}
              columns={kanbanColumns}
              getItemColumn={(item) => item.status}
              getItemId={(item) => item.id}
              renderCard={(item) => (
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.customer}
                  </p>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {item.currency} {item.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
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
};

export default DataTableExample;

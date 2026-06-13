import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { SortIcon } from './IconLibrary';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (item: T) => any;
  width?: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface ReportViewProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string;
  onRowSelect?: (selectedIds: string[]) => void;
  selectable?: boolean;
  hoverable?: boolean;
  striped?: boolean;
}

export const ReportView = React.forwardRef<HTMLDivElement, ReportViewProps<any>>(
  (
    {
      columns,
      data,
      getRowId = (_, i) => String(i),
      onRowSelect,
      selectable = true,
      hoverable = true,
      striped = true,
    },
    ref
  ) => {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<{
      columnId: string | null;
      direction: 'asc' | 'desc';
    }>({ columnId: null, direction: 'asc' });

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        const allIds = new Set(data.map((row, i) => getRowId(row, i)));
        setSelectedRows(allIds);
        onRowSelect?.(Array.from(allIds));
      } else {
        setSelectedRows(new Set());
        onRowSelect?.([]);
      }
    };

    const handleSelectRow = (rowId: string, checked: boolean) => {
      const newSelected = new Set(selectedRows);
      if (checked) {
        newSelected.add(rowId);
      } else {
        newSelected.delete(rowId);
      }
      setSelectedRows(newSelected);
      onRowSelect?.(Array.from(newSelected));
    };

    const handleSort = (columnId: string) => {
      setSortConfig((prev) => ({
        columnId,
        direction:
          prev.columnId === columnId && prev.direction === 'asc' ? 'desc' : 'asc',
      }));
    };

    // Sort data if a sort config is set
    const sortedData = React.useMemo(() => {
      if (!sortConfig.columnId) return data;

      const sortColumn = columns.find((col) => col.id === sortConfig.columnId);
      if (!sortColumn) return data;

      return [...data].sort((a, b) => {
        const aVal = sortColumn.accessorFn
          ? sortColumn.accessorFn(a)
          : (a as any)[sortColumn.accessorKey as string];
        const bVal = sortColumn.accessorFn
          ? sortColumn.accessorFn(b)
          : (b as any)[sortColumn.accessorKey as string];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }, [data, sortConfig, columns]);

    return (
      <div
        ref={ref}
        className="overflow-x-auto border border-gray-200 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === data.length && data.length > 0}
                    indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked as boolean)
                    }
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={`font-semibold text-gray-900 dark:text-white ${
                    column.width ? column.width : ''
                  }`}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.id)}
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {column.header}
                      <SortIcon className="text-gray-400" size="sm" />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  className="py-8 text-center text-gray-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => {
                const rowId = getRowId(row, index);
                const isSelected = selectedRows.has(rowId);

                return (
                  <TableRow
                    key={rowId}
                    className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                      hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''
                    } ${
                      striped && index % 2 === 1
                        ? 'bg-gray-50 dark:bg-gray-800/50'
                        : ''
                    } ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : ''
                    }`}
                  >
                    {selectable && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowId, checked as boolean)
                          }
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className="text-gray-900 dark:text-gray-100"
                      >
                        {column.render ? column.render(row) : (
                          <>{(row as any)[column.accessorKey as string]}</>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);

ReportView.displayName = 'ReportView';

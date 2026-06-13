
import React, { useState, useMemo } from 'react';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    AlignLeftIcon,
    AlignRightIcon,
    RefreshIcon,
    DotsHorizontalIcon,
} from '../constants';
import type { Invoice } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ViewModeSelector, type ViewMode } from './ViewModeSelector';
import { FilterPanel } from './FilterPanel';
import { ReportView, type ColumnDef } from './ReportView';
import { ListView, type ListItemFieldDef } from './ListView';
import { KanbanView, type KanbanColumn } from './KanbanView';
import { StatusBadge } from './StatusBadge';
import { useFilters, type FilterState } from '../hooks/useFilters';

interface ClientInvoicingListViewProps {
    invoices: Invoice[];
    onInvoiceSelect: (invoiceId: string) => void;
    onNewInvoice: () => void;
}

const ClientInvoicingListView: React.FC<ClientInvoicingListViewProps> = ({ invoices, onInvoiceSelect, onNewInvoice }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('report');
    const [isSubPanelOpen, setIsSubPanelOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    // Extract unique statuses and customers for filter options
    const statusOptions = useMemo(
        () => Array.from(new Set(invoices.map((inv) => inv.status)))
            .map((status) => ({ id: status, label: status, checked: false })),
        [invoices]
    );

    const customerOptions = useMemo(
        () => Array.from(new Set(invoices.map((inv) => inv.billedToName)))
            .slice(0, 5) // Limit to 5 for demo
            .map((name) => ({ id: name, label: name, checked: false })),
        [invoices]
    );

    const initialFilters: FilterState = {
        status: {
            id: 'status',
            label: 'Status',
            type: 'checkbox',
            options: statusOptions,
        },
        customer: {
            id: 'billedToName',
            label: 'Customer',
            type: 'checkbox',
            options: customerOptions,
        },
    };

    // Custom filter function
    const filterFn = (item: Invoice, filters: FilterState) => {
        const statusFilter = filters.status?.options.filter((opt) => opt.checked);
        const customerFilter = filters.customer?.options.filter((opt) => opt.checked);

        if (statusFilter && statusFilter.length > 0) {
            if (!statusFilter.some((opt) => opt.id === item.status)) {
                return false;
            }
        }

        if (customerFilter && customerFilter.length > 0) {
            if (!customerFilter.some((opt) => opt.id === item.billedToName)) {
                return false;
            }
        }

        return true;
    };

    const {
        filters,
        toggleFilter,
        setFilterValue,
        clearAllFilters,
        clearFilter,
        filteredData,
        activeFilterCount,
    } = useFilters(invoices, initialFilters, filterFn);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    // Report view columns
    const reportColumns: ColumnDef<Invoice>[] = [
        {
            id: 'invoiceNumber',
            header: 'Invoice #',
            accessorKey: 'invoiceNumber',
            sortable: true,
            width: 'w-28',
            render: (item) => (
                <button
                    onClick={() => onInvoiceSelect(item.id)}
                    className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                >
                    {item.invoiceNumber}
                </button>
            ),
        },
        {
            id: 'billedToName',
            header: 'Billed To',
            accessorKey: 'billedToName',
            sortable: true,
        },
        {
            id: 'status',
            header: 'Status',
            render: (item) => (
                <StatusBadge status={item.status as any} size="sm" />
            ),
        },
        {
            id: 'invoiceDate',
            header: 'Date',
            accessorKey: 'invoiceDate',
            sortable: true,
        },
        {
            id: 'totalAmount',
            header: 'Total',
            render: (item) => (
                <span className="font-medium">{formatCurrency(item.totalAmount)}</span>
            ),
        },
    ];

    // List view fields
    const listFields: ListItemFieldDef<Invoice>[] = [
        {
            id: 'invoiceNumber',
            accessorKey: 'invoiceNumber',
            render: (item) => (
                <button
                    onClick={() => onInvoiceSelect(item.id)}
                    className="text-blue-600 hover:underline dark:text-blue-400 font-semibold"
                >
                    {item.invoiceNumber}
                </button>
            ),
        },
        {
            id: 'billedToName',
            label: 'Billed To',
            accessorKey: 'billedToName',
        },
        {
            id: 'invoiceDate',
            label: 'Date',
            accessorKey: 'invoiceDate',
        },
    ];

    // Kanban columns
    const kanbanColumns: KanbanColumn[] = [
        { id: 'Draft', title: 'Draft', color: 'bg-gray-50 dark:bg-gray-800' },
        { id: 'Unpaid', title: 'Unpaid', color: 'bg-orange-50 dark:bg-orange-900/20' },
        { id: 'Paid', title: 'Paid', color: 'bg-green-50 dark:bg-green-900/20' },
        { id: 'Overdue', title: 'Overdue', color: 'bg-red-50 dark:bg-red-900/20' },
    ];

    return (
        <div className="flex h-full flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4">
                <div className="flex items-center space-x-2">
                    <button
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        onClick={() => setIsSubPanelOpen(!isSubPanelOpen)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered ? (
                            isSubPanelOpen ? (
                                <ChevronDoubleLeftIcon className="h-5 w-5" />
                            ) : (
                                <ChevronDoubleRightIcon className="h-5 w-5" />
                            )
                        ) : isSubPanelOpen ? (
                            <AlignLeftIcon className="h-5 w-5" />
                        ) : (
                            <AlignRightIcon className="h-5 w-5" />
                        )}
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Client Invoices</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <ViewModeSelector currentView={viewMode} onViewChange={setViewMode} />
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                        <RefreshIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={onNewInvoice} className="bg-black hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                        + New Invoice
                    </Button>
                </div>
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

            {/* Main Content */}
            <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-4 pb-4">
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
                    <div className="overflow-y-auto h-full pt-4">
                        <ListView
                            items={filteredData}
                            fields={listFields}
                            getItemId={(item) => item.id}
                            selectable={true}
                            renderCard={(item) => (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {item.billedToName}
                                        </h4>
                                        <StatusBadge status={item.status as any} size="sm" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.invoiceNumber}
                                    </p>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-xs text-gray-500">{item.invoiceDate}</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(item.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            onItemClick={(item) => onInvoiceSelect(item.id)}
                        />
                    </div>
                )}

                {viewMode === 'kanban' && (
                    <div className="overflow-x-auto h-full pt-4">
                        <KanbanView
                            items={filteredData}
                            columns={kanbanColumns}
                            getItemColumn={(item) => item.status}
                            getItemId={(item) => item.id}
                            renderCard={(item) => (
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                        {item.billedToName}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.invoiceNumber}
                                    </p>
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(item.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            onCardClick={(item) => onInvoiceSelect(item.id)}
                        />
                    </div>
                )}

                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>
                        Showing {filteredData.length} of {invoices.length} invoices
                    </span>
                    {activeFilterCount > 0 && (
                        <span>
                            {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientInvoicingListView;

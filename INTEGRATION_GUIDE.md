# Integration Guide: Applying Multi-View Components to Your Data Views

This guide shows exactly how to refactor your existing views to use the new multi-view component system.

## Quick Reference: Component Location

```
NEW COMPONENTS LOCATION:
- components/IconLibrary.tsx          ← Use icons from here
- components/FilterPanel.tsx          ← Filter UI
- components/ReportView.tsx           ← Table view
- components/ListView.tsx             ← Card list view
- components/KanbanView.tsx           ← Status columns view
- components/ViewModeSelector.tsx     ← View switcher
- components/StatusBadge.tsx          ← Status badges
- components/MultiViewDataTable.tsx   ← All-in-one wrapper
- hooks/useFilters.ts                 ← Filter hook

EXAMPLE:
- components/DataTableExample.tsx     ← Working example with Sales Invoice data
- components/ClientInvoicingListView.tsx ← Real implementation
```

---

## Step-by-Step Refactoring Checklist

### Step 1: Replace Icon Imports

**Before:**
```tsx
import { 
  FilterIcon, 
  ListIcon 
} from '../constants';
```

**After:**
```tsx
import { 
  FilterIcon,
  ListViewIcon,
  ReportViewIcon,
  KanbanViewIcon 
} from './IconLibrary';
```

**Why:** Ensures consistent stroke width (1.5) across the app.

---

### Step 2: Add Filter Hook

**Before:**
```tsx
const [statusFilter, setStatusFilter] = useState('');
const [customerFilter, setCustomerFilter] = useState('');
// Manual filter logic in render...
```

**After:**
```tsx
import { useFilters, type FilterState } from '../hooks/useFilters';

const initialFilters: FilterState = {
  status: {
    id: 'status',
    label: 'Status',
    type: 'checkbox',
    options: [
      { id: 'Paid', label: 'Paid', checked: false },
      { id: 'Overdue', label: 'Overdue', checked: false },
    ],
  },
};

const { filters, toggleFilter, filteredData, activeFilterCount, ... } = useFilters(
  invoices,
  initialFilters,
  (item, filters) => {
    // Custom filter logic here
    return true;
  }
);
```

**Why:** Centralized filter state management with built-in helpers.

---

### Step 3: Add View Mode State

**Before:**
```tsx
// Only one view, no switching
<InvoiceTable data={invoices} />
```

**After:**
```tsx
import { ViewModeSelector, type ViewMode } from './ViewModeSelector';

const [viewMode, setViewMode] = useState<ViewMode>('report');

// Then in JSX:
<ViewModeSelector 
  currentView={viewMode} 
  onViewChange={setViewMode}
  availableViews={['report', 'list', 'kanban']}
/>
```

**Why:** Easy switching between views while preserving filter state.

---

### Step 4: Define Columns & Fields

**For ReportView (Table):**
```tsx
import { ReportView, type ColumnDef } from './ReportView';

const reportColumns: ColumnDef<Invoice>[] = [
  {
    id: 'invoiceNumber',
    header: 'Invoice #',
    accessorKey: 'invoiceNumber',
    sortable: true,
    width: 'w-28',
  },
  {
    id: 'status',
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    id: 'total',
    header: 'Total',
    render: (item) => formatCurrency(item.amount),
  },
];

<ReportView
  columns={reportColumns}
  data={filteredData}
  getRowId={(row) => row.id}
  selectable={true}
/>
```

**For ListView (Cards):**
```tsx
import { ListView, type ListItemFieldDef } from './ListView';

const listFields: ListItemFieldDef<Invoice>[] = [
  {
    id: 'invoiceNumber',
    label: 'Invoice #',
    accessorKey: 'invoiceNumber',
  },
  {
    id: 'total',
    label: 'Total',
    render: (item) => formatCurrency(item.amount),
  },
];

<ListView
  items={filteredData}
  fields={listFields}
  getItemId={(item) => item.id}
  renderCard={(item) => (
    <div>
      <h4>{item.billedToName}</h4>
      <StatusBadge status={item.status} />
      <p>{formatCurrency(item.amount)}</p>
    </div>
  )}
/>
```

**For KanbanView (Columns):**
```tsx
import { KanbanView, type KanbanColumn } from './KanbanView';

const kanbanColumns: KanbanColumn[] = [
  { id: 'Draft', title: 'Draft' },
  { id: 'Pending', title: 'Pending' },
  { id: 'Paid', title: 'Paid' },
];

<KanbanView
  items={filteredData}
  columns={kanbanColumns}
  getItemColumn={(item) => item.status}
  getItemId={(item) => item.id}
  renderCard={(item) => (
    <div>
      <h4>{item.billedToName}</h4>
      <p>{formatCurrency(item.amount)}</p>
    </div>
  )}
/>
```

---

### Step 5: Add FilterPanel

**Before:**
```tsx
// Manual filter UI
<Select value={statusFilter} onChange={...}>
  <SelectItem>Status...</SelectItem>
</Select>
```

**After:**
```tsx
import { FilterPanel } from './FilterPanel';

<FilterPanel
  filters={filters}
  onToggleFilter={toggleFilter}
  onSetFilterValue={setFilterValue}
  onClearAllFilters={clearAllFilters}
  onClearFilter={clearFilter}
  activeFilterCount={activeFilterCount}
/>
```

**Why:** Consistent filter UI that works with checkbox, select, date, and search filters.

---

### Step 6: Render Views Based on ViewMode

**Before:**
```tsx
return (
  <div>
    <InvoiceTable data={invoices} />
  </div>
);
```

**After:**
```tsx
return (
  <div className="space-y-4">
    <div className="flex justify-between">
      <h2>Invoices</h2>
      <ViewModeSelector {...props} />
    </div>

    <FilterPanel {...filterProps} />

    {viewMode === 'report' && (
      <ReportView columns={reportColumns} data={filteredData} />
    )}

    {viewMode === 'list' && (
      <ListView items={filteredData} fields={listFields} />
    )}

    {viewMode === 'kanban' && (
      <KanbanView items={filteredData} columns={kanbanColumns} />
    )}

    <div className="text-sm text-gray-600">
      Showing {filteredData.length} of {invoices.length} items
    </div>
  </div>
);
```

---

## Complete Refactored Example

Here's a minimal complete example showing the pattern:

```tsx
import React, { useState, useMemo } from 'react';
import { ViewModeSelector, type ViewMode } from './ViewModeSelector';
import { FilterPanel } from './FilterPanel';
import { ReportView, type ColumnDef } from './ReportView';
import { ListView, type ListItemFieldDef } from './ListView';
import { KanbanView, type KanbanColumn } from './KanbanView';
import { StatusBadge } from './StatusBadge';
import { useFilters, type FilterState } from '../hooks/useFilters';

interface MyDataViewProps {
  data: any[];
  onItemSelect: (id: string) => void;
}

export const MyDataView: React.FC<MyDataViewProps> = ({ data, onItemSelect }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('report');

  // 1. Setup filters
  const statusOptions = useMemo(
    () => Array.from(new Set(data.map((item) => item.status)))
      .map((status) => ({ id: status, label: status, checked: false })),
    [data]
  );

  const initialFilters: FilterState = {
    status: {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      options: statusOptions,
    },
  };

  const { filters, toggleFilter, filteredData, activeFilterCount, clearAllFilters, clearFilter } = 
    useFilters(data, initialFilters);

  // 2. Define views
  const reportColumns: ColumnDef<any>[] = [
    { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
    { id: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
  ];

  const listFields: ListItemFieldDef<any>[] = [
    { id: 'name', label: 'Name', accessorKey: 'name' },
  ];

  const kanbanColumns: KanbanColumn[] = [
    { id: 'Draft', title: 'Draft' },
    { id: 'Active', title: 'Active' },
  ];

  // 3. Render
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">My Data</h2>
        <ViewModeSelector currentView={viewMode} onViewChange={setViewMode} />
      </div>

      <FilterPanel
        filters={filters}
        onToggleFilter={toggleFilter}
        onSetFilterValue={() => {}}
        onClearAllFilters={clearAllFilters}
        onClearFilter={clearFilter}
        activeFilterCount={activeFilterCount}
      />

      {viewMode === 'report' && (
        <ReportView columns={reportColumns} data={filteredData} getRowId={(row) => row.id} />
      )}
      {viewMode === 'list' && (
        <ListView items={filteredData} fields={listFields} getItemId={(item) => item.id} />
      )}
      {viewMode === 'kanban' && (
        <KanbanView
          items={filteredData}
          columns={kanbanColumns}
          getItemColumn={(item) => item.status}
          getItemId={(item) => item.id}
          renderCard={(item) => <div>{item.name}</div>}
        />
      )}
    </div>
  );
};
```

---

## Apply to Specific Views

### For ReceivablesView

```tsx
import { MultiViewDataTable } from '@/components/MultiViewDataTable';

const ReceivablesView = () => {
  // Extract all receivables data into a flat list
  const receivablesData = extractReceivablesData(); // Convert from nested structure

  return (
    <MultiViewDataTable
      title="Receivables"
      data={receivablesData}
      initialFilters={... /* define based on receivables fields */ ...}
      reportColumns={... /* invoice/receivables columns */ ...}
      listFields={... /* receivables card fields */ ...}
      kanbanColumns={... /* status columns */ ...}
      renderListCard={(item) => <ReceivableCard item={item} />}
      renderKanbanCard={(item) => <ReceivableCard item={item} />}
    />
  );
};
```

### For FinancialReportsView

Currently shows report links. To convert to a data table:

```tsx
// If you have actual financial report data to display
<MultiViewDataTable
  title="Financial Reports"
  data={financialReports}
  initialFilters={accountFilters}
  reportColumns={reportColumns}
  listFields={listFields}
  kanbanColumns={typeColumns}
/>
```

### For PayablesView

```tsx
<MultiViewDataTable
  title="Payables"
  data={payablesData}
  initialFilters={payableFilters}
  reportColumns={payableColumns}
  listFields={payableFields}
  kanbanColumns={statusColumns}
/>
```

---

## Common Filter Patterns

### Checkbox Filters (Status, Category, etc.)
```tsx
const initialFilters = {
  status: {
    id: 'status',
    label: 'Status',
    type: 'checkbox',
    options: [
      { id: 'Active', label: 'Active', checked: false },
      { id: 'Inactive', label: 'Inactive', checked: false },
    ],
  },
};
```

### Select Filters (Single value)
```tsx
const initialFilters = {
  company: {
    id: 'company',
    label: 'Company',
    type: 'select',
    options: companies.map(c => ({ id: c.id, label: c.name, checked: false })),
    value: '',
  },
};
```

### Date Range Filters
```tsx
const initialFilters = {
  dateRange: {
    id: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    options: [],
    value: { start: '', end: '' },
  },
};
```

### Search Filters
```tsx
const initialFilters = {
  search: {
    id: 'search',
    label: 'Search',
    type: 'search',
    options: [],
    value: '',
  },
};
```

---

## Status Badge Colors

The `StatusBadge` component automatically handles these statuses:

```
INVOICES:          SHIPMENTS:              ORDERS:
- Paid (green)     - Booked (blue)         - Open (blue)
- Overdue (red)    - In Transit (purple)   - Confirmed (green)
- Draft (gray)     - Customs Clearance     - Cancelled (red)
- Return (orange)  - Delivered (green)     - Expired (gray)
                    - On Hold (orange)
```

If you need custom statuses, extend `StatusBadge.tsx` with more colors in the `STATUS_COLORS` object.

---

## Performance Tips

1. **Large Lists (1000+ items)**: Use `ListView` instead of `ReportView`
2. **Many Columns**: Set explicit `width` on columns to prevent layout shift
3. **Custom Filters**: Provide `filterFn` to skip default filtering
4. **Memoize Callbacks**: Wrap `onItemClick`, `onCardClick` in `useCallback`

---

## Testing the Implementation

After integrating, verify:

- ✅ View switcher changes views smoothly
- ✅ Filters actually filter the displayed data
- ✅ Active filter count updates
- ✅ Clear filters button works
- ✅ All icons render consistently
- ✅ Status badges show correct colors
- ✅ Dark mode works (toggle in your app)

---

## Troubleshooting

### Filters not working
- Check `filterFn` logic
- Verify field names match data structure
- Check that `toggleFilter` is called with correct groupId and optionId

### Icons not showing
- Import from `IconLibrary.tsx`, not from constants
- Check icon component is wrapped properly

### Columns overflow
- Set `width` property on ColumnDef
- Use `getRowId` with correct property

### Data not showing
- Check `getRowId` and `getItemId` return unique values
- Verify `accessorKey` or `accessorFn` matches data structure

---

## Need Help?

- **Reference**: See `COMPONENT_GUIDE.md` for full API
- **Example**: See `DataTableExample.tsx` for working example
- **Real Usage**: See `ClientInvoicingListView.tsx` for real implementation

Happy integrating! 🚀

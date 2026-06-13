# UI Component Guide

This guide explains the new reusable UI components built for the RexCorp ERP system, focusing on multi-view data tables, filters, and consistent iconography.

## Table of Contents

1. [Icon Library](#icon-library)
2. [Filters Hook](#filters-hook)
3. [View Components](#view-components)
4. [Complete Examples](#complete-examples)

---

## Icon Library

**File:** `components/IconLibrary.tsx`

Standardized icon components with consistent stroke widths (1.5) and sizing.

### Available Icons

- **View Modes:** `ReportViewIcon`, `ListViewIcon`, `KanbanViewIcon`
- **Actions:** `FilterIcon`, `ChevronDownIcon`, `ChevronUpIcon`, `CloseIcon`, `CheckIcon`
- **Visual:** `GripIcon`, `SortIcon`, `VisibleIcon`, `HiddenIcon`

### Size Constants

```typescript
const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};
```

### Usage

```tsx
import { ReportViewIcon, FilterIcon } from '@/components/IconLibrary';

// Basic usage
<ReportViewIcon size="md" />
<FilterIcon className="text-blue-600" size="lg" />

// Custom size via className
<FilterIcon className="w-8 h-8" />
```

---

## Filters Hook

**File:** `hooks/useFilters.ts`

Custom React hook for managing filter state and applying filters to data.

### FilterState Structure

```typescript
interface FilterState {
  [groupId: string]: {
    id: string;
    label: string;
    type: 'checkbox' | 'select' | 'date-range' | 'search';
    options: { id: string; label: string; checked: boolean }[];
    value?: string | string[] | { start: string; end: string };
  };
}
```

### Usage

```tsx
import { useFilters } from '@/hooks/useFilters';

const MyComponent = () => {
  const initialFilters = {
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

  const {
    filters,
    toggleFilter,
    setFilterValue,
    clearAllFilters,
    clearFilter,
    filteredData,
    activeFilterCount,
  } = useFilters(data, initialFilters);

  // Use filtered data and update filters
};
```

### Hook Methods

- `toggleFilter(groupId, optionId)` - Toggle checkbox option
- `setFilterValue(groupId, value)` - Set select/date/search value
- `clearAllFilters()` - Clear all active filters
- `clearFilter(groupId)` - Clear specific filter group
- `filteredData` - Memoized filtered array
- `activeFilterCount` - Number of active filters

---

## View Components

### FilterPanel

**File:** `components/FilterPanel.tsx`

Renders interactive filter controls with support for checkboxes, selects, date ranges, and search fields.

```tsx
import { FilterPanel } from '@/components/FilterPanel';

<FilterPanel
  filters={filters}
  onToggleFilter={toggleFilter}
  onSetFilterValue={setFilterValue}
  onClearAllFilters={clearAllFilters}
  onClearFilter={clearFilter}
  activeFilterCount={activeFilterCount}
/>
```

### ReportView

**File:** `components/ReportView.tsx`

Table-based view with sortable columns, row selection, and horizontal scrolling.

```tsx
import { ReportView, type ColumnDef } from '@/components/ReportView';

const columns: ColumnDef<Item>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
    width: 'w-48',
  },
  {
    id: 'status',
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} />,
  },
];

<ReportView
  columns={columns}
  data={filteredData}
  getRowId={(row) => row.id}
  selectable={true}
  striped={true}
  hoverable={true}
/>
```

### ListView

**File:** `components/ListView.tsx`

Card-based list view with customizable fields and optional custom rendering.

```tsx
import { ListView, type ListItemFieldDef } from '@/components/ListView';

const fields: ListItemFieldDef<Item>[] = [
  {
    id: 'name',
    label: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'status',
    render: (item) => <StatusBadge status={item.status} />,
  },
];

<ListView
  items={filteredData}
  fields={fields}
  getItemId={(item) => item.id}
  selectable={true}
  renderCard={(item) => (
    <div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  )}
/>
```

### KanbanView

**File:** `components/KanbanView.tsx`

Column-based view grouped by status with drag-and-drop support.

```tsx
import { KanbanView, type KanbanColumn } from '@/components/KanbanView';

const columns: KanbanColumn[] = [
  { id: 'Draft', title: 'Draft' },
  { id: 'Pending', title: 'Pending' },
  { id: 'Done', title: 'Done' },
];

<KanbanView
  items={filteredData}
  columns={columns}
  getItemColumn={(item) => item.status}
  getItemId={(item) => item.id}
  renderCard={(item) => (
    <div>
      <h4>{item.title}</h4>
      <p>{item.amount}</p>
    </div>
  )}
/>
```

### ViewModeSelector

**File:** `components/ViewModeSelector.tsx`

Segmented control for switching between view modes.

```tsx
import { ViewModeSelector } from '@/components/ViewModeSelector';

<ViewModeSelector
  currentView={viewMode}
  onViewChange={setViewMode}
  availableViews={['report', 'list', 'kanban']}
/>
```

### StatusBadge

**File:** `components/StatusBadge.tsx`

Semantic status badges with predefined colors for common statuses.

```tsx
import { StatusBadge } from '@/components/StatusBadge';

// Supported statuses: 'Paid', 'Overdue', 'Draft', 'Return', 
// 'Booked', 'In Transit', 'Customs Clearance', 'Delivered', 'On Hold'

<StatusBadge status="Paid" size="md" />
<StatusBadge status="Overdue" size="lg" />
```

---

## Complete Examples

### Example 1: Sales Invoice List with All Features

**File:** `components/DataTableExample.tsx`

A complete working example combining all components for a sales invoice report view.

```tsx
import { DataTableExample } from '@/components/DataTableExample';

// Use with your data
<DataTableExample
  title="Sales Invoices"
  data={invoicesData}
  initialFilters={initialFilters}
/>
```

### Example 2: Custom Multi-View Data Table

**File:** `components/MultiViewDataTable.tsx`

A wrapper component that manages all the view logic for you.

```tsx
import { MultiViewDataTable } from '@/components/MultiViewDataTable';

<MultiViewDataTable
  title="Sales Invoices"
  data={invoices}
  initialFilters={initialFilters}
  filterFn={(item, filters) => {
    // Custom filter logic
    return true;
  }}
  reportColumns={reportColumns}
  listFields={listFields}
  kanbanColumns={kanbanColumns}
  renderListCard={(item) => <YourListCardComponent item={item} />}
  renderKanbanCard={(item) => <YourKanbanCardComponent item={item} />}
  availableViews={['report', 'list', 'kanban']}
/>
```

### Example 3: Building Your Own View

```tsx
import { useState } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { ViewModeSelector } from '@/components/ViewModeSelector';
import { FilterPanel } from '@/components/FilterPanel';
import { ReportView } from '@/components/ReportView';
import { ListView } from '@/components/ListView';
import { KanbanView } from '@/components/KanbanView';

export const CustomDataView = () => {
  const [viewMode, setViewMode] = useState('report');
  
  const { filters, toggleFilter, filteredData, ... } = useFilters(
    myData,
    myInitialFilters,
    myCustomFilterFunction
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>My Data</h2>
        <ViewModeSelector 
          currentView={viewMode} 
          onViewChange={setViewMode}
        />
      </div>

      <FilterPanel {...filterProps} />

      {viewMode === 'report' && (
        <ReportView columns={columns} data={filteredData} />
      )}
      {viewMode === 'list' && (
        <ListView items={filteredData} fields={fields} />
      )}
      {viewMode === 'kanban' && (
        <KanbanView 
          items={filteredData}
          columns={kanbanColumns}
          getItemColumn={(item) => item.status}
          renderCard={(item) => <YourCard item={item} />}
        />
      )}
    </div>
  );
};
```

---

## Design Patterns

### 1. Consistent Icon Usage

Always import icons from `IconLibrary.tsx` to maintain consistent stroke widths:

```tsx
// ✅ Good
import { FilterIcon, ReportViewIcon } from '@/components/IconLibrary';

// ❌ Avoid
import { Filter } from 'lucide-react';
```

### 2. Status Colors

Use `StatusBadge` component for consistent status styling instead of inline styles:

```tsx
// ✅ Good
<StatusBadge status="Paid" />

// ❌ Avoid
<Badge className="bg-green-100 text-green-800">{status}</Badge>
```

### 3. Filter Implementation

Always use the `useFilters` hook with `FilterPanel` component:

```tsx
// ✅ Good
const { filters, toggleFilter, filteredData } = useFilters(data, initialFilters);
<FilterPanel {...filterProps} />

// ❌ Avoid - Manual filter state management without hook
const [status, setStatus] = useState('');
```

### 4. View Switching

Use the full wrapper for common cases, or build custom logic as needed:

```tsx
// ✅ For simple cases
<MultiViewDataTable {...props} />

// ✅ For complex cases with custom logic
const [viewMode, setViewMode] = useState('report');
{viewMode === 'report' && <ReportView {...} />}
```

---

## Performance Tips

1. **Memoize Callbacks** - When using `onItemClick` or `onCardClick`, wrap in `useCallback`
2. **Lazy Load Large Lists** - Use `ListView` for large datasets instead of `ReportView`
3. **Column Width Optimization** - Set explicit widths on high-count tables to prevent layout shift
4. **Filter Optimization** - Provide a custom `filterFn` instead of relying on default checkbox matching

---

## Accessibility

All components follow WAI-ARIA guidelines:

- ✅ Keyboard navigation support
- ✅ Screen reader friendly labels
- ✅ Semantic HTML structure
- ✅ Proper color contrast (WCAG AA)
- ✅ Focus management in modals and panels

---

## Component Dependencies

- `@/components/ui/*` - shadcn/ui base components
- `lucide-react` - Icon library
- `react` - Core React features

All components are built with TypeScript and include full type definitions.

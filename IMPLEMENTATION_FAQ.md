# Implementation FAQ & Troubleshooting

## Frequently Asked Questions

### Q: Do I need to use all three views (Report, List, Kanban)?

**A:** No! You can use just one view if you prefer:

```tsx
// Only report view
<ViewModeSelector 
  currentView={viewMode} 
  onViewChange={setViewMode}
  availableViews={['report']}  // Only report available
/>
```

Or skip the ViewModeSelector entirely and just render one view.

---

### Q: How do I implement drag-and-drop for Kanban?

**A:** The KanbanView supports drag events, but doesn't handle the drop:

```tsx
<KanbanView
  items={filteredData}
  columns={kanbanColumns}
  getItemColumn={(item) => item.status}
  getItemId={(item) => item.id}
  renderCard={(item) => <div>{item.name}</div>}
  onDragStart={(item, columnId) => {
    console.log('Dragging', item.id, 'from', columnId);
    // Save to state or send to API
  }}
/>
```

You'll need to implement the drop handling and update the data source when items move between columns.

---

### Q: Can I customize the column colors in Kanban?

**A:** Yes! Set the `color` property on KanbanColumn:

```tsx
const kanbanColumns: KanbanColumn[] = [
  { 
    id: 'Draft', 
    title: 'Draft',
    color: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  { 
    id: 'Paid', 
    title: 'Paid',
    color: 'bg-green-50 dark:bg-green-900/20'
  },
];
```

---

### Q: How do I add more filter types?

**A:** Extend the FilterState type and add rendering in FilterPanel:

```tsx
// In hooks/useFilters.ts
export interface FilterState {
  type: 'checkbox' | 'select' | 'date-range' | 'search' | 'slider'; // Add 'slider'
}

// In components/FilterPanel.tsx
{group.type === 'slider' && (
  <input
    type="range"
    min={group.value?.min}
    max={group.value?.max}
    onChange={(e) => onSetFilterValue(groupId, { ...group.value, current: e.target.value })}
  />
)}
```

---

### Q: How do I make filters case-insensitive?

**A:** The default filtering is case-sensitive. Use a custom filterFn:

```tsx
const filterFn = (item: Invoice, filters: FilterState) => {
  const statusFilter = filters.status?.options.filter((opt) => opt.checked);
  
  if (statusFilter && statusFilter.length > 0) {
    if (!statusFilter.some((opt) => 
      opt.id.toLowerCase() === String(item.status).toLowerCase()
    )) {
      return false;
    }
  }
  
  return true;
};
```

---

### Q: Can I combine multiple filter groups with AND logic?

**A:** Yes, that's the default behavior. All checked filters must match for an item to show.

To implement OR logic (any filter matches):

```tsx
const filterFn = (item: Invoice, filters: FilterState) => {
  let matchesAnyFilter = false;
  
  Object.values(filters).forEach((group) => {
    const checkedOptions = group.options.filter((opt) => opt.checked);
    if (checkedOptions.length === 0) return;
    
    if (checkedOptions.some((opt) => opt.id === (item as any)[group.id])) {
      matchesAnyFilter = true;
    }
  });
  
  return matchesAnyFilter;
};
```

---

### Q: How do I save filter presets?

**A:** Store the filters state to localStorage or your database:

```tsx
const [savedFilters, setSavedFilters] = useState([]);

const saveFilter = (name: string) => {
  setSavedFilters([...savedFilters, { name, filters }]);
  localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
};

const loadFilter = (name: string) => {
  const saved = savedFilters.find((f) => f.name === name);
  if (saved) setFilters(saved.filters);
};
```

---

### Q: Can I export filtered data to CSV?

**A:** Yes! Here's a simple implementation:

```tsx
const exportToCSV = () => {
  const headers = columns.map((col) => col.header);
  const rows = filteredData.map((row) =>
    columns.map((col) => {
      if (col.accessorKey) return (row as any)[col.accessorKey];
      if (col.accessorFn) return col.accessorFn(row);
      return '';
    })
  );

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.csv';
  a.click();
};
```

---

## Troubleshooting

### Issue: Filters not filtering anything

**Check:**
1. `getRowId` returns unique values
2. `filterFn` logic is correct
3. Filter options have correct `id` values matching data
4. Field names in data match filter group `id`

**Test:**
```tsx
console.log('[v0] Filters:', filters);
console.log('[v0] Filtered Data:', filteredData);
console.log('[v0] Data:', data);
```

---

### Issue: Sorting not working in ReportView

**Check:**
1. Column has `sortable: true`
2. Column has either `accessorKey` or `accessorFn` defined
3. Data types are comparable (strings, numbers)

**Solution:**
```tsx
// Custom sort function
const sortedData = [...data].sort((a, b) => {
  const aVal = a.amount;
  const bVal = b.amount;
  // Custom logic here
  return aVal - bVal;
});
```

---

### Issue: Icons not rendering

**Check:**
1. Import from `./IconLibrary`, not `constants`
2. Component receives `size` or `className`
3. Tailwind classes are available

**Before:**
```tsx
import { FilterIcon } from '../constants';
```

**After:**
```tsx
import { FilterIcon } from './IconLibrary';
```

---

### Issue: Dark mode not working

**Check:**
1. Dark mode toggle exists in your app
2. `<html>` has `dark` class when dark mode active
3. Components use `dark:` Tailwind classes

The components include dark mode classes automatically.

---

### Issue: List/Kanban view slow with many items

**Solution:** Virtualization with React Window:

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={filteredData.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ListViewItem item={filteredData[index]} />
    </div>
  )}
</FixedSizeList>
```

---

### Issue: Custom render function not being called

**Check:**
1. `render` property is defined on column/field
2. Function is properly typed
3. Try console.log inside render function

---

### Issue: Status badges showing wrong color

**Check:**
1. Status string matches exactly (case-sensitive)
2. View the STATUS_COLORS object in StatusBadge.tsx
3. Ensure status prop is one of the supported values

**Supported Status Values:**
```
Paid, Overdue, Draft, Return,           // Invoices
Booked, In Transit, Customs Clearance, Delivered, On Hold  // Shipments
Open, Confirmed, Cancelled, Expired     // Orders
```

To add custom statuses, edit StatusBadge.tsx:

```tsx
const STATUS_COLORS: Record<string, string> = {
  'Paid': '...',
  'MyCustomStatus': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  // Add more here
};
```

---

### Issue: Table scrolling is janky

**Check:**
1. Avoid rendering huge lists (use pagination)
2. Set fixed column widths
3. Use `striped` prop for better UX

**Solution:**
```tsx
<ReportView
  columns={columns.map(col => ({
    ...col,
    width: 'w-32'  // Fixed widths
  }))}
  data={filteredData}
  striped={true}
/>
```

---

### Issue: Filter panel too wide on mobile

**Check:**
1. FilterPanel uses responsive grid (`md:grid-cols-2`)
2. Parent container has max-width constraint

**Solution:**
```tsx
<div className="max-w-full md:max-w-7xl mx-auto">
  <FilterPanel {...props} />
</div>
```

---

## Performance Optimization Tips

### 1. Use useMemo for computed values
```tsx
const kanbanColumns = useMemo(() => [
  { id: 'Draft', title: 'Draft' },
  // ...
], [dependencies]);
```

### 2. Virtualize large lists
```tsx
// Scroll performance for 1000+ items
import { FixedSizeList } from 'react-window';
```

### 3. Debounce search filters
```tsx
import { useDebouncedValue } from 'some-library';

const debouncedSearch = useDebouncedValue(searchValue, 300);
const { filteredData } = useFilters(data, filters);
```

### 4. Lazy load images in list/kanban
```tsx
<img 
  loading="lazy"
  src={item.imageUrl}
  alt={item.name}
/>
```

---

## Type Safety

All components are fully typed with TypeScript:

```tsx
import type { ColumnDef } from '@/components/ReportView';
import type { ListItemFieldDef } from '@/components/ListView';
import type { KanbanColumn } from '@/components/KanbanView';
import type { FilterState } from '@/hooks/useFilters';

// Full type checking in your IDE!
const columns: ColumnDef<MyType>[] = [...];
```

---

## Accessibility

All components follow WCAG AA standards:

- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ Screen reader support with ARIA labels
- ✅ Color contrast ratios meet guidelines
- ✅ Focus indicators visible
- ✅ Semantic HTML

For custom implementations, ensure:
1. Proper label associations with inputs
2. ARIA roles on custom components
3. Keyboard handlers for interactive elements

---

## When to Use What

| View | Best For | Example |
|------|----------|---------|
| **Report** | Many columns, sorting needed | Invoice table with 10+ columns |
| **List** | Details important, mobile | Customer list with photos |
| **Kanban** | Status-based workflow | Task board with To-Do/Done |

---

## Getting Help

1. **Check examples**: `DataTableExample.tsx` and `ClientInvoicingListView.tsx`
2. **Read docs**: `COMPONENT_GUIDE.md` and `INTEGRATION_GUIDE.md`
3. **Type hints**: Hover over components in VS Code for auto-documentation
4. **Debug**: Add `console.log("[v0] ...")` statements to trace state

---

## Common Patterns

### Pattern 1: Master-Detail
```tsx
const [selectedId, setSelectedId] = useState<string | null>(null);

<ListView
  items={filteredData}
  onItemClick={(item) => setSelectedId(item.id)}
  renderCard={(item) => (...)}
/>

{selectedId && <DetailView id={selectedId} />}
```

### Pattern 2: Bulk Actions
```tsx
<ReportView
  selectable={true}
  onRowSelect={(selectedIds) => {
    setSelectedRows(selectedIds);
  }}
/>

{selectedRows.length > 0 && (
  <Button onClick={() => bulkDelete(selectedRows)}>
    Delete {selectedRows.length} items
  </Button>
)}
```

### Pattern 3: Real-time Updates
```tsx
useEffect(() => {
  const subscription = watchData().subscribe((newData) => {
    setData(newData);  // Filters automatically reapply
  });
  return () => subscription.unsubscribe();
}, []);
```

---

## Need More Help?

Refer to:
- `IMPLEMENTATION_SUMMARY.md` - Overview of what was built
- `COMPONENT_GUIDE.md` - API reference
- `INTEGRATION_GUIDE.md` - Step-by-step integration
- Example files - `DataTableExample.tsx`, `ClientInvoicingListView.tsx`

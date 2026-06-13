# 📸 Visual Guide to New Components

This document provides a visual/text representation of how each component works.

---

## ViewModeSelector

```
┌─────────────────────────────────────┐
│  [📊] [📋] [🃏]                    │  ← Click to switch views
│ Report List Kanban                 │
└─────────────────────────────────────┘
```

**Use:** Switch between different data views while keeping filters active

---

## FilterPanel

```
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Filters                                    Clear all       │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Status                Customer          Company              │
│  ☑ Paid                ☑ Acme...        (empty)              │
│  ☐ Overdue             ☐ Tech...                              │
│  ☐ Draft               ☐ Global...                            │
│  ☐ Return              Clear                                  │
│  Clear                                                         │
│                                                                │
│  [5 active filters]                                            │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

**Use:** Filter data by multiple criteria

---

## ReportView (Table)

```
┌─────────────────────────────────────────────────────────────────┐
│ ☑ Invoice #↑↓  Billed To↑↓     Status      Total↑↓             │
├─────────────────────────────────────────────────────────────────┤
│ ☐ INV-001     Acme Industries   ✓ Paid     $ 2,249.10           │
│ ☐ INV-002     Tech Corp         ⚠ Overdue  € 606.93             │
│ ☐ INV-003     Global Systems    ⚠ Overdue  € 606.93             │
│ ☐ INV-004     Apex Solutions    ⚠ Overdue  ₹ 10,08,000.00       │
│ ☐ INV-005     Infinite...       ✓ Paid     ₹ 4,66,988.00        │
│                                                                   │
│ Showing 5 of 55 items   |  1 active filter                       │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- ☑ Select rows
- ↑↓ Click headers to sort
- ✓ Status badges
- Striped rows

---

## ListView (Cards)

```
┌──────────────────────────────────────┐
│ ☑ Select all  |  2 selected          │
├──────────────────────────────────────┤
│                                      │
│ ☑ Acme Industries                    │
│   Invoice #: INV-001                 │
│   Status: ✓ Paid                     │
│   Date: 2026-06-14                   │
│   Amount: $ 2,249.10                 │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ ☐ Tech Corp                          │
│   Invoice #: INV-002                 │
│   Status: ⚠ Overdue                  │
│   Date: 2026-05-15                   │
│   Amount: € 606.93                   │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ ☐ Global Systems                     │
│   Invoice #: INV-003                 │
│   Status: ⚠ Overdue                  │
│   Date: 2026-04-20                   │
│   Amount: € 606.93                   │
│                                      │
└──────────────────────────────────────┘
```

**Features:**
- ☑ Select items
- Custom field display
- Mobile-friendly
- Full item details

---

## KanbanView (Status Columns)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│     Draft       │      Unpaid      │      Paid       │    Overdue      │
│     (2)         │      (5)         │      (8)        │     (12)        │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│                 │                 │                 │                 │
│ ≡ Acme Indus.  │ ≡ Tech Corp     │ ≡ Apex Soln.   │ ≡ Global Sys.  │
│   INV-001      │   INV-002       │   INV-005      │   INV-003      │
│ $ 2,249.10     │ € 606.93        │ ₹ 4,66,988     │ € 606.93       │
│                 │                 │                 │                 │
│ ≡ Infinite...  │ ≡ Global Sys.   │ ≡ Infinite...  │ ≡ Apex Soln.   │
│   INV-004      │   INV-006       │   INV-009      │   INV-007      │
│ $ 1,500.00     │ ₹ 10,08,000     │ € 1,234.56     │ $ 10,000.00    │
│                 │                 │                 │                 │
│                 │ ≡ Apex Soln.    │ ≡ Tech Corp    │                 │
│                 │   INV-008       │   INV-010      │                 │
│                 │ $ 5,000.00      │ ₹ 25,000.00    │                 │
│                 │                 │                 │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
         ↓ Drag & Drop Ready
```

**Features:**
- Group by status
- Item counts per column
- Drag-and-drop ready
- Custom card display

---

## StatusBadge Colors

```
INVOICE STATUSES:
├─ ✓ Paid       → 🟢 Green   (success, complete)
├─ ⏳ Overdue   → 🔴 Red     (alert, needs action)
├─ ✏️  Draft    → ⚪ Gray    (inactive, pending)
└─ ↩️  Return   → 🟠 Orange  (warning)

SHIPMENT STATUSES:
├─ 📦 Booked    → 🔵 Blue    (info, scheduled)
├─ 🚚 In Transit → 🟣 Purple (processing)
├─ 📍 Customs   → 🟡 Yellow  (warning, delay)
├─ ✓ Delivered  → 🟢 Green   (complete)
└─ ⏸️  On Hold   → 🟠 Orange  (warning)

ORDER STATUSES:
├─ 🔓 Open      → 🔵 Blue    (available)
├─ ✓ Confirmed  → 🟢 Green   (approved)
├─ ❌ Cancelled → 🔴 Red     (invalid)
└─ ⏰ Expired   → ⚪ Gray    (closed)
```

---

## Icon System

```
CONSISTENT SIZING:
├─ xs  → 12px  (small text, secondary)
├─ sm  → 16px  (buttons, labels)
├─ md  → 20px  (default, most uses)
├─ lg  → 24px  (headers, emphasis)
└─ xl  → 28px  (large headers, icons)

CONSISTENT STROKE:
└─ All icons have stroke-width: 1.5
   (not default 2, for visual consistency)

VIEW MODE ICONS:
├─ 📊 Report  (grid layout)
├─ 📋 List    (lines/bullets)
└─ 🃏 Kanban  (columns/cards)

ACTION ICONS:
├─ 🔍 Filter  (filter controls)
├─ ↑↓ Sort    (column sorting)
├─ ≡ Grip     (drag handle)
├─ ✓ Check    (selection)
└─ ✕ Close    (clear/remove)
```

---

## Data Flow Diagram

```
                            DATA SOURCE
                                │
                                ↓
                        ┌───────────────┐
                        │  Input Data   │
                        │  (invoices)   │
                        └───────────────┘
                                │
                                ↓
                        ┌───────────────┐
                        │  useFilters   │
                        │  Hook         │
                        └───────────────┘
                          ↙      ↓      ↖
                         /       │        \
                        /        │         \
                ┌──────────┐  ┌──────────┐  ┌──────────┐
                │ Filtered │  │ Active   │  │ Filter   │
                │ Data     │  │ Count    │  │ State    │
                └──────────┘  └──────────┘  └──────────┘
                       │            │              │
                       └────────────┼──────────────┘
                                    ↓
                        ┌───────────────────┐
                        │  ViewModeSelector │
                        └───────────────────┘
                                    ↓
                    ┌───────────────┬───────────────┐
                    ↓               ↓               ↓
              ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
              │ ReportView  │  │ ListView    │  │ KanbanView  │
              │ (Sortable   │  │ (Cards)     │  │ (Status     │
              │ Table)      │  │             │  │ Columns)    │
              └─────────────┘  └─────────────┘  └─────────────┘
                    ↓               ↓               ↓
                    └───────────────┬───────────────┘
                                    ↓
                            USER INTERACTS
                            (view, select,
                             sort, filter)
```

---

## Filter State Structure

```
FILTER STATE:
{
  status: {
    id: 'status',
    label: 'Status',
    type: 'checkbox',
    options: [
      { id: 'Paid', label: 'Paid', checked: true },
      { id: 'Overdue', label: 'Overdue', checked: false },
      { id: 'Draft', label: 'Draft', checked: false },
    ]
  },
  customer: {
    id: 'customer',
    label: 'Customer',
    type: 'select',
    options: [
      { id: 'acme', label: 'Acme Inc', checked: false },
      { id: 'tech', label: 'Tech Corp', checked: true },
    ],
    value: 'tech'
  },
  dateRange: {
    id: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    options: [],
    value: {
      start: '2026-01-01',
      end: '2026-12-31'
    }
  }
}
```

---

## Component Integration Flow

```
YOUR PAGE/VIEW
    │
    ├─ useFilters Hook
    │   ├─ Manages filter state
    │   ├─ Applies filters to data
    │   └─ Tracks active filters
    │
    ├─ State: viewMode
    │   ├─ 'report'
    │   ├─ 'list'
    │   └─ 'kanban'
    │
    └─ Render:
       │
       ├─ ViewModeSelector
       │   └─ Allows switching views
       │
       ├─ FilterPanel
       │   └─ Shows filter options
       │
       └─ View (based on viewMode):
          ├─ If 'report':
          │  └─ ReportView
          │     ├─ Sortable columns
          │     ├─ Row selection
          │     └─ Striped rows
          │
          ├─ If 'list':
          │  └─ ListView
          │     ├─ Custom fields
          │     ├─ Custom cards
          │     └─ Item selection
          │
          └─ If 'kanban':
             └─ KanbanView
                ├─ Status columns
                ├─ Item counts
                └─ Drag-ready cards
```

---

## Before & After Comparison

### BEFORE (Old Implementation)

```
┌────────────────────────────────────┐
│  Filter Sidebar (DISABLED)         │
├────────────────────────────────────┤
│                                    │
│  Customer Name    [Select - DISABLED]
│  Status           [Select - DISABLED]
│  Edit Filters (link, non-functional)
│                                    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  List View (ONLY OPTION)           │
├────────────────────────────────────┤
│                                    │
│  [Table with no sorting]           │
│  [All invoices shown]              │
│  [Inline status colors]            │
│  [No alternative views]            │
│                                    │
└────────────────────────────────────┘
```

### AFTER (New Implementation)

```
┌────────────────────────────────────┐
│ 📊 📋 🃏  ← View Mode Selector     │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 🔍 Filters          [Clear all]    │
├────────────────────────────────────┤
│ Status              Customer       │
│ ☑ Paid              ☑ Acme Inc    │
│ ☐ Overdue           ☐ Tech Corp   │
│ ☐ Draft             ☐ Global Sys  │
│ [2 active filters]                 │
└────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  REPORT VIEW (Current)                      │
├─────────────────────────────────────────────┤
│ ☑ Invoice ↑↓  Customer ↑↓  Status  Total ↑↓│
│ ☐ INV-001    Acme Inc    ✓ Paid   $2,249  │
│ ☐ INV-002    Tech Corp   ⚠ Overdue €607  │
│ [Plus ListView & KanbanView options]        │
└─────────────────────────────────────────────┘
```

---

## Component Size Reference

```
FilterPanel (across full width):
┌─────────────────────────────────────────────┐
│ Width: 100% of container                    │
│ Height: ~120px (auto-responsive)            │
│ Grid: 1 column mobile, 2 md, 4 lg          │
└─────────────────────────────────────────────┘

ReportView (table):
┌─────────────────────────────────────────────┐
│ Width: 100% (with horizontal scroll)        │
│ Height: Flexible (auto-grow with data)      │
│ Row Height: ~44px per item                  │
│ Header: ~40px sticky                        │
└─────────────────────────────────────────────┘

ListView (cards):
┌─────────────────────────────────────────────┐
│ Card Width: 100% of container               │
│ Card Height: ~100-150px (flexible)          │
│ Spacing: 12px between cards                 │
└─────────────────────────────────────────────┘

KanbanView (columns):
┌─────────────────────────────────────────────┐
│ Column Width: 320px fixed                   │
│ Column Height: Flexible (with scroll)       │
│ Spacing: 16px between columns               │
│ Card Height: ~120px                         │
└─────────────────────────────────────────────┘
```

---

## Color Palette

```
STATUS COLORS (with semantic meaning):
├─ Green (#10b981)     ← Success/Complete (Paid, Delivered, Confirmed)
├─ Red (#ef4444)       ← Alert/Action Needed (Overdue, Cancelled)
├─ Blue (#3b82f6)      ← Info/Scheduled (Booked, Open)
├─ Purple (#a855f7)    ← Processing (In Transit)
├─ Orange (#f97316)    ← Warning/Caution (Draft, On Hold, Return)
└─ Gray (#6b7280)      ← Inactive/Closed (Expired, Draft)

UI COLORS:
├─ Background: #ffffff / dark: #1f2937
├─ Surface: #f9fafb / dark: #111827
├─ Border: #e5e7eb / dark: #374151
├─ Text: #111827 / dark: #f3f4f6
└─ Hover: #f3f4f6 / dark: #1f2937
```

---

## Responsive Breakpoints

```
MOBILE (<768px):
├─ Filter Panel: 1 column
├─ ListView: Full width cards
├─ KanbanView: Horizontal scroll (2 columns)
└─ ReportView: Horizontal scroll

TABLET (768px-1024px):
├─ Filter Panel: 2 columns
├─ ListView: Full width cards
├─ KanbanView: Horizontal scroll (3-4 columns)
└─ ReportView: Horizontal scroll

DESKTOP (>1024px):
├─ Filter Panel: 4 columns
├─ ListView: Full width cards
├─ KanbanView: Full horizontal display (all columns visible)
└─ ReportView: Auto-fit columns
```

---

## Dark Mode Support

```
ALL COMPONENTS INCLUDE:
├─ dark:bg-gray-900      (dark backgrounds)
├─ dark:text-gray-100    (dark text)
├─ dark:border-gray-700  (dark borders)
├─ dark:hover:bg-gray-800 (dark hover states)
└─ Automatic when <html class="dark">

COLOR ADJUSTMENTS IN DARK MODE:
├─ Status Badges: Adjusted opacity & saturation
├─ Backgrounds: Darker (gray-800/900)
├─ Text: Lighter (gray-100/200)
└─ Borders: Darker (gray-700)
```

---

This visual guide helps you understand how each component looks and behaves. See the actual code in the components and examples for full implementation details!

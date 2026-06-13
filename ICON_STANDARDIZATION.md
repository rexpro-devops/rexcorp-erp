# Icon Standardization Guide

## Standard Icon Pattern

All dashboard card icons should follow the **monochrome neutral gray** pattern used in the Finance view and Home dashboard.

### ✅ CORRECT Pattern

```tsx
<div className="flex-shrink-0">
    <IconName className="h-6 w-6 text-gray-500 dark:text-gray-400" />
</div>
```

**Key properties:**
- No colored background (`bg-blue-50`, `bg-green-50`, etc.)
- Icon color: `text-gray-500` (light mode), `text-gray-400` (dark mode)
- Container: `flex-shrink-0` for proper sizing
- Consistent sizing: `h-6 w-6` for dashboard cards

### ❌ INCORRECT Pattern (Old)

```tsx
<div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/40">
    <IconName className="h-6 w-6 text-blue-600 dark:text-blue-400" />
</div>
```

This pattern uses colorful backgrounds which makes the interface look inconsistent.

## Components Updated

### 1. ProcurementView.tsx
**Fixed:** Partner Directory, Vendor Rates, Purchase Orders card icons
- Changed from: `bg-blue-50`, `bg-indigo-50`, `bg-emerald-50` with colored icons
- Changed to: Neutral gray icons on transparent background

### 2. CommercialView.tsx  
**Fixed:** Client Accounts, Service Quotations, Client Contracts card icons
- Changed from: `bg-blue-50`, `bg-green-50`, `bg-indigo-50` with colored icons
- Changed to: Neutral gray icons on transparent background

### 3. ComplianceView.tsx
**Fixed:** Trade Licenses, Duty Tariffs card icons
- Changed from: `bg-blue-50`, `bg-amber-50` with colored icons
- Changed to: Neutral gray icons on transparent background

## Exceptions (These Are OK)

### Status Badges
Status badges with colors are SEMANTIC and should remain:
```tsx
// ✅ These stay colored - they communicate meaning
<Badge className="bg-green-100 text-green-800">Paid</Badge>
<Badge className="bg-red-100 text-red-800">Overdue</Badge>
<Badge className="bg-blue-100 text-blue-700">Booked</Badge>
```

### Avatar Initials
Avatar circles with background colors are acceptable:
```tsx
// ✅ Colored avatars are OK
<span className="bg-purple-100 text-purple-600 rounded-full">JD</span>
```

### Button Colors
Call-to-action buttons with colors remain:
```tsx
// ✅ Button colors stay
<button className="bg-blue-600 hover:bg-blue-700 text-white">Action</button>
```

## References

- **Home Dashboard:** Neutral gray icons for summary cards
- **Finance View:** Neutral gray icon backgrounds for dashboard sections
- Uses Tailwind: `text-gray-500 dark:text-gray-400`

## Verification Checklist

When adding new dashboard card sections:

- [ ] Icon uses `text-gray-500 dark:text-gray-400`
- [ ] Icon container is `flex-shrink-0` (no rounded-lg bg-*)
- [ ] No colored background on icon wrapper
- [ ] CTA link color matches component hover state (usually `text-blue-600`)
- [ ] Tested in both light and dark modes

import React from 'react';
import {
  Eye,
  EyeOff,
  Grid3x3,
  List,
  Trello,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  GripVertical,
  ArrowUpDown,
  Check,
} from 'lucide-react';

// Icon size constants
export const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
} as const;

// Standard stroke width for consistency
const STROKE_WIDTH = 1.5;

interface IconProps {
  className?: string;
  size?: keyof typeof ICON_SIZES;
}

// View Mode Icons
export const ReportViewIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <Grid3x3 className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const ListViewIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <List className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const KanbanViewIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <Trello className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

// Filter & Action Icons
export const FilterIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <Filter className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <ChevronDown className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <ChevronUp className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const CloseIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <X className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const GripIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <GripVertical className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const SortIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <ArrowUpDown className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const CheckIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <Check className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const VisibleIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <Eye className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

export const HiddenIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <EyeOff className={className || ICON_SIZES[size]} strokeWidth={STROKE_WIDTH} />
);

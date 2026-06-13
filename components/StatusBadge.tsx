import React from 'react';
import { Badge } from '@/components/ui/badge';

export type InvoiceStatus = 'Paid' | 'Overdue' | 'Draft' | 'Return';
export type ShipmentStatus = 'Booked' | 'In Transit' | 'Customs Clearance' | 'Delivered' | 'On Hold';
export type OrderStatus = 'Open' | 'Confirmed' | 'Cancelled' | 'Expired';

type Status = InvoiceStatus | ShipmentStatus | OrderStatus | string;

const STATUS_COLORS: Record<string, string> = {
  // Invoice statuses
  'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  'Return': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  
  // Shipment statuses
  'Booked': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'In Transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Customs Clearance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  
  // Order statuses
  'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Confirmed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Expired': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

interface StatusBadgeProps {
  status: Status;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md',
}) => {
  const className = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <Badge className={`${className} ${sizeClasses[size]} font-medium`}>
      {status}
    </Badge>
  );
};

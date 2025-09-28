import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

// Currency formatting
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Number formatting
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';

  return new Intl.NumberFormat('en-IN').format(number);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';

  return `${Number(value).toFixed(decimals)}%`;
};

// Date formatting
export const formatDate = (date, type = 'default') => {
  if (!date) return '';

  const dateObj = new Date(date);

  switch (type) {
    case 'relative':
      return formatDistanceToNow(dateObj, { addSuffix: true });

    case 'short':
      return format(dateObj, 'MMM dd, yyyy');

    case 'long':
      return format(dateObj, 'MMMM dd, yyyy');

    case 'datetime':
      return format(dateObj, 'MMM dd, yyyy HH:mm');

    case 'time':
      return format(dateObj, 'HH:mm');

    case 'smart':
      if (isToday(dateObj)) {
        return `Today ${format(dateObj, 'HH:mm')}`;
      } else if (isYesterday(dateObj)) {
        return `Yesterday ${format(dateObj, 'HH:mm')}`;
      } else {
        return format(dateObj, 'MMM dd, yyyy');
      }

    default:
      return format(dateObj, 'dd/MM/yyyy');
  }
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
};

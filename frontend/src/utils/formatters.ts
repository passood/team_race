import { format, parseISO } from 'date-fns';

/**
 * Format a number as currency (USD)
 *
 * @param value - The number to format (can be in any unit)
 * @param compact - If true, use compact notation (e.g., $1.2T, $500B, $10M)
 *
 * @example
 * formatCurrency(1234567890) // "$1,234,567,890"
 * formatCurrency(1234567890, true) // "$1.23B"
 * formatCurrency(1234567890000, true) // "$1.23T"
 */
export const formatCurrency = (value: number, compact = false): string => {
  if (!isFinite(value)) return '$0';

  if (compact) {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1e12) {
      // Trillions
      return `${sign}$${(absValue / 1e12).toFixed(2)}T`;
    } else if (absValue >= 1e9) {
      // Billions
      return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
      // Millions
      return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
    } else if (absValue >= 1e3) {
      // Thousands
      return `${sign}$${(absValue / 1e3).toFixed(2)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a date string or Date object
 *
 * @param date - Date string (ISO format) or Date object
 * @param formatString - date-fns format string (default: 'MMM d, yyyy')
 *
 * @example
 * formatDate('2024-01-15') // "Jan 15, 2024"
 * formatDate('2024-01-15', 'yyyy-MM-dd') // "2024-01-15"
 * formatDate(new Date(), 'PPP') // "January 15th, 2024"
 */
export const formatDate = (
  date: string | Date,
  formatString = 'MMM d, yyyy'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a number as a percentage
 *
 * @param value - The decimal value to format (e.g., 0.1234 for 12.34%)
 * @param decimals - Number of decimal places (default: 2)
 * @param showSign - If true, show + for positive values (default: false)
 *
 * @example
 * formatPercentage(0.1234) // "12.34%"
 * formatPercentage(0.1234, 1) // "12.3%"
 * formatPercentage(0.1234, 2, true) // "+12.34%"
 * formatPercentage(-0.0567, 2, true) // "-5.67%"
 */
export const formatPercentage = (
  value: number,
  decimals = 2,
  showSign = false
): string => {
  if (!isFinite(value)) return '0%';

  const percentage = value * 100;
  const formatted = percentage.toFixed(decimals);

  if (showSign && value > 0) {
    return `+${formatted}%`;
  }

  return `${formatted}%`;
};

/**
 * Format a large number with compact notation
 *
 * @param value - The number to format
 *
 * @example
 * formatCompactNumber(1234) // "1.2K"
 * formatCompactNumber(1234567) // "1.2M"
 * formatCompactNumber(1234567890) // "1.2B"
 */
export const formatCompactNumber = (value: number): string => {
  if (!isFinite(value)) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e12) {
    return `${sign}${(absValue / 1e12).toFixed(1)}T`;
  } else if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(1)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(1)}K`;
  }

  return value.toString();
};

/**
 * Format a decimal as a price (e.g., stock price)
 *
 * @param value - The price to format
 * @param decimals - Number of decimal places (default: 2)
 *
 * @example
 * formatPrice(123.456) // "$123.46"
 * formatPrice(123.456, 3) // "$123.456"
 */
export const formatPrice = (value: number, decimals = 2): string => {
  if (!isFinite(value)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number with thousands separators
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.567, 2) // "1,234.57"
 */
export const formatNumber = (value: number, decimals = 0): string => {
  if (!isFinite(value)) return '0';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

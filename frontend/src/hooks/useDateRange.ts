import { useMemo } from 'react';
import { isWithinInterval, parseISO, isValid } from 'date-fns';
import { useFilterStore } from '@/stores/useFilterStore';

export interface DateRangeValidation {
  isValid: boolean;
  error: string | null;
}

export interface UseDateRangeReturn {
  dateRange: { start: string; end: string } | null;
  isValidRange: boolean;
  validationError: string | null;
  isDateInRange: (date: string) => boolean;
  startDate: Date | null;
  endDate: Date | null;
}

/**
 * Hook for managing and validating date ranges from the filter store
 *
 * Usage:
 * ```tsx
 * const { dateRange, isValidRange, isDateInRange } = useDateRange();
 *
 * if (isDateInRange('2024-01-15')) {
 *   // Date is within selected range
 * }
 * ```
 */
export const useDateRange = (): UseDateRangeReturn => {
  const { dateRange } = useFilterStore();

  // Parse dates
  const startDate = useMemo(() => {
    if (!dateRange?.start) return null;
    try {
      const parsed = parseISO(dateRange.start);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, [dateRange?.start]);

  const endDate = useMemo(() => {
    if (!dateRange?.end) return null;
    try {
      const parsed = parseISO(dateRange.end);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, [dateRange?.end]);

  // Validate date range
  const validation = useMemo((): DateRangeValidation => {
    if (!dateRange) {
      return {
        isValid: false,
        error: 'No date range selected',
      };
    }

    if (!startDate || !endDate) {
      return {
        isValid: false,
        error: 'Invalid date format',
      };
    }

    if (startDate > endDate) {
      return {
        isValid: false,
        error: 'Start date must be before end date',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }, [dateRange, startDate, endDate]);

  // Check if a date is within the selected range
  const isDateInRange = useMemo(() => {
    return (dateString: string): boolean => {
      if (!validation.isValid || !startDate || !endDate) {
        return false;
      }

      try {
        const date = parseISO(dateString);
        if (!isValid(date)) return false;

        return isWithinInterval(date, { start: startDate, end: endDate });
      } catch {
        return false;
      }
    };
  }, [validation.isValid, startDate, endDate]);

  return {
    dateRange,
    isValidRange: validation.isValid,
    validationError: validation.error,
    isDateInRange,
    startDate,
    endDate,
  };
};

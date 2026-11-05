import {
  addDays,
  differenceInCalendarDays,
  format,
  isSameYear,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';

export type Period = 'day' | 'week' | 'month' | 'year';

export const PERIODS: { value: Period; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export type DateRange = {
  start: Date;
  end: Date;
};

const subtractors: Record<Period, (date: Date, amount: number) => Date> = {
  day: subDays,
  week: subWeeks,
  month: subMonths,
  year: subYears,
};

export function getRange(period: Period, index: number, now = new Date()): DateRange {
  const today = startOfDay(now);
  const subtract = subtractors[period];

  return {
    start: addDays(subtract(today, index + 1), 1),
    end: subtract(today, index),
  };
}

export function toQueryDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

const PLURAL_UNITS: Record<Period, string> = {
  day: 'days',
  week: 'weeks',
  month: 'months',
  year: 'years',
};

export function getRangeTitle(period: Period, index: number, range: DateRange, now = new Date()) {
  if (period === 'day') {
    const daysAgo = differenceInCalendarDays(now, range.start);
    if (daysAgo === 0) {
      return 'Today';
    }
    if (daysAgo === 1) {
      return 'Yesterday';
    }
    if (daysAgo < 7) {
      return format(range.start, 'EEEE');
    }
    return format(range.start, 'MMMM d');
  }

  if (index === 0) {
    return `Past ${period}`;
  }

  if (index === 1) {
    return `Previous ${period}`;
  }

  return `${index} ${PLURAL_UNITS[period]} ago`;
}

export function formatRange(range: DateRange, now = new Date()) {
  const sameYearAsNow = isSameYear(range.start, now) && isSameYear(range.end, now);
  const pattern = sameYearAsNow ? 'MMM d' : 'MMM d, yyyy';

  if (differenceInCalendarDays(range.end, range.start) === 0) {
    return format(range.start, sameYearAsNow ? 'EEE, MMM d' : 'EEE, MMM d, yyyy');
  }

  return `${format(range.start, pattern)} – ${format(range.end, pattern)}`;
}

export function getLoadLabel(title: string) {
  if (title === 'Yesterday' || title.startsWith('Previous')) {
    return title.charAt(0).toLowerCase() + title.slice(1);
  }

  return title;
}

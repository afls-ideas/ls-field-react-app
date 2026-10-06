const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const numberFormat = new Intl.NumberFormat();

function parse(iso?: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(iso?: string | null): string {
  const date = parse(iso);
  return date ? dateTimeFormat.format(date) : '—';
}

/** Date-only values arrive as UTC midnight; format in UTC so the day doesn't shift. */
export function formatDate(iso?: string | null): string {
  const date = parse(iso);
  return date ? dateFormat.format(date) : '—';
}

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function formatPercent(part: number, whole: number): string {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : '—';
}

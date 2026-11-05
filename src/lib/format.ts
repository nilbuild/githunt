const compactFormatter = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fullFormatter = new Intl.NumberFormat('en');

export function formatCompact(value: number) {
  return compactFormatter.format(value).toLowerCase();
}

export function formatFull(value: number) {
  return fullFormatter.format(value);
}

import { formatNumber } from '@/lib/format';
import type { CountBucket } from '@/api/fieldData';

const BAR_COLORS = [
  '[&::-webkit-progress-value]:bg-chart-1 [&::-moz-progress-bar]:bg-chart-1',
  '[&::-webkit-progress-value]:bg-chart-2 [&::-moz-progress-bar]:bg-chart-2',
  '[&::-webkit-progress-value]:bg-chart-3 [&::-moz-progress-bar]:bg-chart-3',
  '[&::-webkit-progress-value]:bg-chart-4 [&::-moz-progress-bar]:bg-chart-4',
  '[&::-webkit-progress-value]:bg-chart-5 [&::-moz-progress-bar]:bg-chart-5',
];

export function BarList({ items, unit }: { items: CountBucket[]; unit: string }) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = Math.max(1, ...sorted.map((item) => item.value));
  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {sorted.map((item, index) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="tabular-nums text-muted-foreground">
              {formatNumber(item.value)} {unit}
            </span>
          </div>
          <progress
            value={item.value}
            max={max}
            aria-label={`${item.label}: ${formatNumber(item.value)} ${unit}`}
            className={`block h-2.5 w-full appearance-none overflow-hidden rounded-full bg-muted [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:rounded-full ${BAR_COLORS[index % BAR_COLORS.length]}`}
          />
        </li>
      ))}
    </ul>
  );
}

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TONES: Record<string, string> = {
  completed: 'bg-primary/10 text-primary border-primary/20',
  submitted: 'bg-primary/10 text-primary border-primary/20',
  planned: 'bg-chart-3/25 text-foreground border-chart-3/50',
  inprogress: 'bg-chart-2/20 text-accent-foreground border-chart-2/40',
  abandoned: 'bg-destructive/10 text-destructive border-destructive/30',
  high: 'bg-chart-2/25 text-accent-foreground border-chart-2/50',
};

export function StatusBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const tone = TONES[value.toLowerCase().replace(/\s+/g, '')];
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', tone ?? 'bg-muted text-muted-foreground')}
    >
      {value}
    </Badge>
  );
}

import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  label: string;
  value: string | null;
  hint?: string;
  icon: ReactNode;
  index?: 0 | 1 | 2 | 3 | 4 | 5;
}

const STAGGER = ['', 'rise-1', 'rise-2', 'rise-3', 'rise-4', 'rise-5'] as const;

export function StatCard({ label, value, hint, icon, index = 0 }: StatCardProps) {
  return (
    <Card className={`rise ${STAGGER[index]} gap-2 p-5`}>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-semibold uppercase tracking-widest">
          {label}
        </span>
        <span aria-hidden="true">{icon}</span>
      </div>
      {value === null ? (
        <Skeleton className="h-10 w-24" />
      ) : (
        <p className="font-display text-4xl font-semibold tabular-nums text-primary">
          {value}
        </p>
      )}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </Card>
  );
}

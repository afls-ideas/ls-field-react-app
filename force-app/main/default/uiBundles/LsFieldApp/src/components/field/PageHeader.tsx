import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="rise mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
      </div>
      {actions}
    </header>
  );
}

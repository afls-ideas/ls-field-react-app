import { useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not found | Field Ledger';
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-display text-7xl font-semibold text-accent-foreground">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-primary">
        That page isn&apos;t in the ledger
      </h1>
      <p className="mt-3 text-muted-foreground">
        Head back to the dashboard to see your visits and samples.
      </p>
      <Button asChild className="mt-8 min-h-11">
        <Link to="/">Back to dashboard</Link>
      </Button>
    </main>
  );
}

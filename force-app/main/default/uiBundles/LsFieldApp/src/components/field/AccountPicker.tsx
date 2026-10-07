import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { fetchAccountsPage } from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface PickedAccount {
  id: string;
  name: string;
}

interface AccountPickerProps {
  value: PickedAccount | null;
  onChange: (account: PickedAccount | null) => void;
  id?: string;
}

/** Type-ahead account search backed by the Account GraphQL query. */
export function AccountPicker({ value, onChange, id }: AccountPickerProps) {
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term), 250);
    return () => clearTimeout(timer);
  }, [term]);

  const results = useAsyncData(
    () => (debounced.trim().length >= 2 ? fetchAccountsPage(debounced) : Promise.resolve(null)),
    [debounced]
  );

  if (value) {
    return (
      <div className="flex h-11 items-center justify-between rounded-md border border-input bg-card px-3 text-sm">
        <span className="font-medium">{value.name}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear account"
          onClick={() => onChange(null)}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  const rows = results.data?.rows.slice(0, 8) ?? [];
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search accounts by name"
          className="h-11 pl-9"
        />
      </div>
      {results.error && <p className="text-sm text-destructive">{results.error}</p>}
      {rows.length > 0 && (
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => onChange({ id: row.id, name: row.name })}
                className="flex min-h-11 w-full items-center justify-between px-3 text-left text-sm hover:bg-secondary"
              >
                <span className="font-medium">{row.name}</span>
                <span className="text-muted-foreground">
                  {[row.kind, row.location].filter(Boolean).join(' · ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {debounced.trim().length >= 2 && !results.loading && rows.length === 0 && !results.error && (
        <p className="text-sm text-muted-foreground">No accounts found.</p>
      )}
    </div>
  );
}

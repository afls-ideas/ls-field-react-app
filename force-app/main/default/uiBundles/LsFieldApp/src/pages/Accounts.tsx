import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { fetchAccountsPage, type AccountRow } from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ExtraPages {
  search: string;
  rows: AccountRow[];
  endCursor: string | null;
  hasNextPage: boolean;
}

export default function Accounts() {
  useEffect(() => {
    document.title = 'Accounts | Field Ledger';
  }, []);

  const [term, setTerm] = useState('');
  const [search, setSearch] = useState('');
  const [extra, setExtra] = useState<ExtraPages | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(term), 300);
    return () => clearTimeout(timer);
  }, [term]);

  const first = useAsyncData(() => fetchAccountsPage(search), [search]);
  const extraForSearch = extra?.search === search ? extra : null;
  const rows = [...(first.data?.rows ?? []), ...(extraForSearch?.rows ?? [])];
  const endCursor = extraForSearch ? extraForSearch.endCursor : first.data?.endCursor;
  const hasNextPage = extraForSearch
    ? extraForSearch.hasNextPage
    : (first.data?.hasNextPage ?? false);

  const loadMore = async () => {
    if (!endCursor) return;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const page = await fetchAccountsPage(search, endCursor);
      setExtra({
        search,
        rows: [...(extraForSearch?.rows ?? []), ...page.rows],
        endCursor: page.endCursor,
        hasNextPage: page.hasNextPage,
      });
    } catch (err) {
      setMoreError(err instanceof Error ? err.message : 'Unable to load more accounts');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Customers"
        title="Accounts"
        description="Search healthcare professionals and organizations, then open an account to see its territories, addresses and visit history."
      />

      <Card className="rise rise-1 gap-0 overflow-hidden p-0">
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search accounts by name"
              aria-label="Search accounts"
              className="h-11 pl-9"
            />
          </div>
        </div>

        {(first.error || moreError) && (
          <div className="p-4">
            <StatusAlert>{first.error ?? moreError}</StatusAlert>
          </div>
        )}

        {first.loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table aria-label="Accounts">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No accounts match this search.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/accounts/${row.id}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.kind ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{row.location ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{row.phone ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{row.email ?? '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {hasNextPage && (
          <div className="border-t border-border p-4 text-center">
            <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading…' : 'Load more'}
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}

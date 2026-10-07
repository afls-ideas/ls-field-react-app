import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { fetchVisitsPage, type Call } from '@/api/fieldData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime, formatNumber } from '@/lib/format';

const ALL = 'all';
const STATUSES = ['Planned', 'Completed'];
const CHANNELS = ['In-Person', 'Remote', 'Phone'];

interface ExtraPages {
  key: string;
  rows: Call[];
  endCursor: string | null;
  hasNextPage: boolean;
}

export default function Calls() {
  useEffect(() => {
    document.title = 'Visits | Field Ledger';
  }, []);

  const [status, setStatus] = useState(ALL);
  const [channel, setChannel] = useState(ALL);
  const [query, setQuery] = useState('');
  const [extra, setExtra] = useState<ExtraPages | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);

  const key = `${status}|${channel}`;
  const filters = useMemo(
    () => ({
      status: status === ALL ? undefined : status,
      channel: channel === ALL ? undefined : channel,
    }),
    [status, channel]
  );
  const first = useAsyncData(() => fetchVisitsPage(filters), [key]);

  const extraForFilters = extra?.key === key ? extra : null;
  const rows = [...(first.data?.rows ?? []), ...(extraForFilters?.rows ?? [])];
  const endCursor = extraForFilters ? extraForFilters.endCursor : first.data?.endCursor;
  const hasNextPage = extraForFilters
    ? extraForFilters.hasNextPage
    : (first.data?.hasNextPage ?? false);

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? rows.filter((call) =>
        [call.account, call.name, call.territory]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(needle))
      )
    : rows;

  const loadMore = async () => {
    if (!endCursor) return;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const page = await fetchVisitsPage(filters, endCursor);
      setExtra({
        key,
        rows: [...(extraForFilters?.rows ?? []), ...page.rows],
        endCursor: page.endCursor,
        hasNextPage: page.hasNextPage,
      });
    } catch (err) {
      setMoreError(err instanceof Error ? err.message : 'Unable to load more visits');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Visit reporting"
        title="Visits"
        description="Every planned and completed visit. Filter by status or channel, or search by account and territory."
      />

      <Card className="rise rise-1 gap-0 overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search account, visit, or territory"
              aria-label="Search loaded visits"
              className="h-11 pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-11 w-40" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="h-11 w-40" aria-label="Filter by channel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All channels</SelectItem>
              {CHANNELS.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {first.error && (
          <div className="p-4">
            <StatusAlert>{first.error}</StatusAlert>
          </div>
        )}

        {first.loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table aria-label="Visits">
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Visit</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Planned</TableHead>
                <TableHead>Territory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No visits match these filters.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">{call.account ?? '—'}</TableCell>
                    <TableCell className="tabular-nums">
                      <Link to={`/visits/${call.id}`} className="text-primary underline-offset-4 hover:underline">
                        {call.name}
                      </Link>
                    </TableCell>
                    <TableCell>{call.channel ?? '—'}</TableCell>
                    <TableCell>
                      <StatusBadge value={call.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={call.priority} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(call.plannedStart)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {call.territory ?? '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-sm text-muted-foreground">
          <span aria-live="polite">
            Showing {formatNumber(visible.length)} of {formatNumber(rows.length)} loaded
            {hasNextPage ? ' (more available)' : ''}
          </span>
          {moreError && <span className="text-destructive">{moreError}</span>}
          {hasNextPage && (
            <Button
              variant="outline"
              className="min-h-11"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load more visits'}
            </Button>
          )}
        </div>
      </Card>
    </main>
  );
}

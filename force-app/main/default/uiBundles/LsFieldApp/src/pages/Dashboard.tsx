import { useEffect } from 'react';
import { Link } from 'react-router';
import { CalendarClock, CheckCircle2, PhoneCall, Pill } from 'lucide-react';
import {
  fetchAllSamples,
  fetchSampleUnitsByProduct,
  fetchUpcomingVisits,
  fetchVisitChannelCounts,
  fetchVisitStatusCounts,
  type CountBucket,
} from '@/api/fieldData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { BarList } from '@/components/field/BarList';
import { PageHeader } from '@/components/field/PageHeader';
import { StatCard } from '@/components/field/StatCard';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
} from '@/lib/format';

const sum = (buckets: CountBucket[] | null | undefined, match?: string) =>
  (buckets ?? [])
    .filter((bucket) => match === undefined || bucket.label === match)
    .reduce((total, bucket) => total + bucket.value, 0);

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard | Field Ledger';
  }, []);

  const status = useAsyncData(fetchVisitStatusCounts, []);
  const channels = useAsyncData(fetchVisitChannelCounts, []);
  const products = useAsyncData(fetchSampleUnitsByProduct, []);
  const upcoming = useAsyncData(
    () => fetchUpcomingVisits(new Date().toISOString()),
    []
  );
  const samples = useAsyncData(fetchAllSamples, []);

  const totalCalls = status.data ? sum(status.data) : null;
  const completed = sum(status.data, 'Completed');
  const planned = sum(status.data, 'Planned');
  const totalUnits = products.data ? sum(products.data) : null;
  const error = status.error ?? channels.error ?? products.error ?? samples.error;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Field activity"
        title="Your territory at a glance"
        description="Visit volume, channel mix, and sample disbursements across every account you cover."
      />

      {error && <StatusAlert>{error}</StatusAlert>}

      <section
        aria-label="Key figures"
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          index={0}
          label="Total visits"
          value={totalCalls === null ? null : formatNumber(totalCalls)}
          hint="All logged and planned"
          icon={<PhoneCall className="size-5" />}
        />
        <StatCard
          index={1}
          label="Completed"
          value={status.data ? formatNumber(completed) : null}
          hint={
            totalCalls ? `${formatPercent(completed, totalCalls)} of all visits` : undefined
          }
          icon={<CheckCircle2 className="size-5" />}
        />
        <StatCard
          index={2}
          label="Planned"
          value={status.data ? formatNumber(planned) : null}
          hint="Still on the calendar"
          icon={<CalendarClock className="size-5" />}
        />
        <StatCard
          index={3}
          label="Units sampled"
          value={totalUnits === null ? null : formatNumber(totalUnits)}
          hint="Across all products"
          icon={<Pill className="size-5" />}
        />
      </section>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card className="rise rise-4">
          <CardHeader>
            <CardTitle className="text-xl">How you reach HCPs</CardTitle>
          </CardHeader>
          <CardContent>
            {channels.loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <BarList items={channels.data ?? []} unit="visits" />
            )}
          </CardContent>
        </Card>
        <Card className="rise rise-5">
          <CardHeader>
            <CardTitle className="text-xl">Samples by product</CardTitle>
          </CardHeader>
          <CardContent>
            {products.loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <BarList items={products.data ?? []} unit="units" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Next up</CardTitle>
            <Link to="/visits" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              All visits
            </Link>
          </CardHeader>
          <CardContent>
            {upcoming.loading ? (
              <Skeleton className="h-48 w-full" />
            ) : upcoming.data && upcoming.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {upcoming.data.map((call) => (
                  <li key={call.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{call.account ?? call.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(call.plannedStart)}
                        {call.channel ? ` · ${call.channel}` : ''}
                      </p>
                    </div>
                    <StatusBadge value={call.priority} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nothing planned from today onward.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Latest samples</CardTitle>
            <Link to="/samples" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              All samples
            </Link>
          </CardHeader>
          <CardContent>
            {samples.loading ? (
              <Skeleton className="h-48 w-full" />
            ) : samples.data && samples.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {samples.data.slice(0, 6).map((sample) => (
                  <li key={sample.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {sample.product ?? sample.name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {sample.account ?? 'Unknown recipient'} · {formatDate(sample.date)}
                      </p>
                    </div>
                    <span className="font-display text-lg font-semibold tabular-nums text-primary">
                      ×{formatNumber(sample.quantityDisbursed)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No samples disbursed yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

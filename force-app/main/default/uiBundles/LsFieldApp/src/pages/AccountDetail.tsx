import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { CalendarPlus, HelpCircle, MapPin } from 'lucide-react';
import {
  fetchAccountAddresses,
  fetchAccountDetail,
  fetchAccountTerritories,
  fetchAccountVisits,
} from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatDateTime } from '@/lib/format';

export default function AccountDetail() {
  const { accountId = '' } = useParams();
  const account = useAsyncData(() => fetchAccountDetail(accountId), [accountId]);
  const territories = useAsyncData(() => fetchAccountTerritories(accountId), [accountId]);
  const addresses = useAsyncData(() => fetchAccountAddresses(accountId), [accountId]);
  const visits = useAsyncData(() => fetchAccountVisits(accountId), [accountId]);

  const name = account.data?.name;
  useEffect(() => {
    document.title = `${name ?? 'Account'} | Field Ledger`;
  }, [name]);

  const error = account.error ?? territories.error ?? addresses.error ?? visits.error;

  if (account.loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!account.data) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <StatusAlert>{account.error ?? 'Account not found.'}</StatusAlert>
        <Link to="/accounts" className="mt-4 inline-block text-primary underline">
          Back to accounts
        </Link>
      </main>
    );
  }

  const detail = account.data;
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow={detail.kind ?? 'Account'}
        title={detail.name}
        description={[detail.type, detail.address ?? detail.location].filter(Boolean).join(' · ') || 'No address on file'}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to={`/visits/new?accountId=${detail.id}`}>
                <CalendarPlus className="size-4" aria-hidden="true" /> New visit
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`/inquiries?accountId=${detail.id}`}>
                <HelpCircle className="size-4" aria-hidden="true" /> New inquiry
              </Link>
            </Button>
          </div>
        }
      />

      {error && <div className="mb-4"><StatusAlert>{error}</StatusAlert></div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rise rise-1">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Phone: </span>{detail.phone ?? '—'}</p>
            <p><span className="text-muted-foreground">Email: </span>{detail.email ?? '—'}</p>
            <h3 className="pt-3 font-medium">Addresses</h3>
            {addresses.loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (addresses.data ?? []).length === 0 ? (
              <p className="text-muted-foreground">No active addresses.</p>
            ) : (
              <ul className="space-y-2">
                {addresses.data!.map((address) => (
                  <li key={address.id} className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span>
                      {address.text}
                      {address.primary && <span className="ml-2 text-xs text-muted-foreground">Primary</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rise rise-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Territories</CardTitle>
          </CardHeader>
          <CardContent>
            {territories.loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (territories.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">This account is not aligned to a territory.</p>
            ) : (
              <ul className="divide-y divide-border">
                {territories.data!.map((territory) => (
                  <li key={territory.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span className="font-medium">
                      {territory.territoryName ?? territory.territoryId ?? 'Territory'}
                      {territory.targeted && <span className="ml-2 text-xs text-accent-foreground">Targeted</span>}
                    </span>
                    <span className="text-muted-foreground">
                      Last visit {formatDate(territory.lastVisitDate)} · Next {formatDate(territory.nextVisitDate)} · {territory.ytdVisits} YTD
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rise rise-3 lg:col-span-3">
          <CardHeader>
            <CardTitle>Visits</CardTitle>
          </CardHeader>
          <CardContent>
            {visits.loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (visits.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No visits yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {visits.data!.map((visit) => (
                  <li key={visit.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <Link to={`/visits/${visit.id}`} className="font-medium text-primary underline-offset-4 hover:underline">{formatDateTime(visit.start)}</Link>
                    <span className="text-muted-foreground">
                      {[visit.channel, visit.callType, visit.territory].filter(Boolean).join(' · ')}
                    </span>
                    <StatusBadge value={visit.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

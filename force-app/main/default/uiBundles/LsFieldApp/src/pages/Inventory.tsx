import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Boxes, CalendarClock, Pill } from 'lucide-react';
import {
  fetchInventory,
  fetchInventoryCounts,
  fetchInventoryOperations,
  fetchProductRequests,
  EXPIRING_SOON_DAYS,
  type ExpiryState,
  type InventoryItem,
} from '@/api/inventoryData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { StatCard } from '@/components/field/StatCard';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatDateTime, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

const EXPIRY_LABEL: Record<ExpiryState, string> = {
  expired: 'Expired',
  soon: 'Expiring soon',
  ok: 'OK',
  none: 'No expiry',
};
const EXPIRY_TONE: Record<ExpiryState, string> = {
  expired: 'bg-destructive/10 text-destructive border-destructive/30',
  soon: 'bg-chart-3/25 text-foreground border-chart-3/50',
  ok: 'bg-primary/10 text-primary border-primary/20',
  none: 'bg-muted text-muted-foreground',
};

function TableState({
  loading,
  error,
  empty,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty: boolean;
  children: React.ReactNode;
}) {
  if (error) return <StatusAlert>{error}</StatusAlert>;
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (empty) return <p className="py-8 text-center text-sm text-muted-foreground">Nothing to show.</p>;
  return <Card className="overflow-hidden">{children}</Card>;
}

function InventoryTab({ items, loading, error }: { items: InventoryItem[] | null; loading: boolean; error: string | null }) {
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (items ?? []).filter(
      (item) =>
        !needle ||
        [item.product, item.batch, item.assignee, item.location].some((v) => v?.toLowerCase().includes(needle))
    );
  }, [items, query]);

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product, batch, location, or rep"
        aria-label="Search inventory"
        className="max-w-md"
      />
      <TableState loading={loading} error={error} empty={!loading && visible.length === 0}>
        <Table aria-label="Sample inventory">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rep</TableHead>
              <TableHead className="text-right">On hand</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Condition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.product ?? '—'}</TableCell>
                <TableCell>{item.batch ?? '—'}</TableCell>
                <TableCell>{item.location ?? '—'}</TableCell>
                <TableCell>{item.assignee ?? '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(item.quantity)}</TableCell>
                <TableCell>{item.expiration ? formatDate(item.expiration) : '—'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', EXPIRY_TONE[item.expiry])}>
                    {EXPIRY_LABEL[item.expiry]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableState>
    </div>
  );
}

export default function Inventory() {
  useEffect(() => {
    document.title = 'Inventory | Field Ledger';
  }, []);

  const inventory = useAsyncData(fetchInventory, []);
  const operations = useAsyncData(fetchInventoryOperations, []);
  const requests = useAsyncData(fetchProductRequests, []);
  const counts = useAsyncData(fetchInventoryCounts, []);

  const items = inventory.data;
  const onHand = items?.reduce((total, item) => total + item.quantity, 0);
  const products = items ? new Set(items.map((i) => i.product).filter(Boolean)).size : null;
  const soon = items?.filter((i) => i.expiry === 'soon' && i.quantity > 0).length;
  const expired = items?.filter((i) => i.expiry === 'expired' && i.quantity > 0).length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Sample inventory management"
        title="Inventory"
        description="Sample batches assigned to reps, with inventory operations, product requests and counts."
      />

      <section aria-label="Inventory totals" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Units on hand" value={onHand === undefined ? null : formatNumber(onHand)} icon={<Pill className="size-5" />} />
        <StatCard index={1} label="Products" value={products === null ? null : formatNumber(products)} hint="Distinct sample products" icon={<Boxes className="size-5" />} />
        <StatCard
          index={2}
          label="Expiring soon"
          value={soon === undefined ? null : formatNumber(soon)}
          hint={`Batches within ${EXPIRING_SOON_DAYS} days`}
          icon={<CalendarClock className="size-5" />}
        />
        <StatCard index={3} label="Expired" value={expired === undefined ? null : formatNumber(expired)} hint="Batches with stock on hand" icon={<AlertTriangle className="size-5" />} />
      </section>

      <Tabs defaultValue="inventory">
        <TabsList aria-label="Inventory sections">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="counts">Counts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-4">
          <InventoryTab items={items} loading={inventory.loading} error={inventory.error} />
        </TabsContent>

        <TabsContent value="operations" className="mt-4">
          <TableState loading={operations.loading} error={operations.error} empty={!operations.loading && (operations.data ?? []).length === 0}>
            <Table aria-label="Inventory operations">
              <TableHeader>
                <TableRow>
                  <TableHead>Operation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(operations.data ?? []).map((op) => (
                  <TableRow key={op.id}>
                    <TableCell className="font-medium">{op.name}</TableCell>
                    <TableCell>{op.type ?? '—'}</TableCell>
                    <TableCell><StatusBadge value={op.status} /></TableCell>
                    <TableCell>{op.from ?? '—'}</TableCell>
                    <TableCell>{op.to ?? '—'}</TableCell>
                    <TableCell>{formatDateTime(op.created)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableState>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <TableState loading={requests.loading} error={requests.error} empty={!requests.loading && (requests.data ?? []).length === 0}>
            <Table aria-label="Product requests">
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Deliver to</TableHead>
                  <TableHead>Need by</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(requests.data ?? []).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.number}</TableCell>
                    <TableCell><StatusBadge value={request.status} /></TableCell>
                    <TableCell>{request.shipment ?? '—'}</TableCell>
                    <TableCell>{request.destination ?? '—'}</TableCell>
                    <TableCell>{request.needBy ? formatDate(request.needBy) : '—'}</TableCell>
                    <TableCell>{formatDateTime(request.created)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableState>
        </TabsContent>

        <TabsContent value="counts" className="mt-4">
          <TableState loading={counts.loading} error={counts.error} empty={!counts.loading && (counts.data ?? []).length === 0}>
            <Table aria-label="Inventory counts">
              <TableHeader>
                <TableRow>
                  <TableHead>Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rep</TableHead>
                  <TableHead>Planned</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(counts.data ?? []).map((count) => (
                  <TableRow key={count.id}>
                    <TableCell className="font-medium">{count.name}</TableCell>
                    <TableCell><StatusBadge value={count.status} /></TableCell>
                    <TableCell>{count.type ?? '—'}</TableCell>
                    <TableCell>{count.purpose ?? '—'}</TableCell>
                    <TableCell>{count.location ?? '—'}</TableCell>
                    <TableCell>{count.user ?? '—'}</TableCell>
                    <TableCell>{count.planned ? formatDate(count.planned) : '—'}</TableCell>
                    <TableCell>{count.completed ? formatDate(count.completed) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableState>
        </TabsContent>
      </Tabs>
    </main>
  );
}

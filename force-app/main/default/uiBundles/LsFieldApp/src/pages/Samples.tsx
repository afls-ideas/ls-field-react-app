import { useEffect } from 'react';
import { fetchAllSamples } from '@/api/fieldData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { StatCard } from '@/components/field/StatCard';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PenLine, Pill, Users } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/format';

export default function Samples() {
  useEffect(() => {
    document.title = 'Samples | Field Ledger';
  }, []);

  const { data, loading, error } = useAsyncData(fetchAllSamples, []);

  const units = data?.reduce((total, sample) => total + sample.quantityDisbursed, 0);
  const recipients = data
    ? new Set(data.map((sample) => sample.account).filter(Boolean)).size
    : null;
  const signed = data?.filter((sample) => sample.signatureCaptured).length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Sample accountability"
        title="Samples"
        description="Product disbursements to HCPs and accounts, with quantities and signature status."
      />

      <section
        aria-label="Sample totals"
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          index={0}
          label="Units disbursed"
          value={units === undefined ? null : formatNumber(units)}
          icon={<Pill className="size-5" />}
        />
        <StatCard
          index={1}
          label="Recipients"
          value={recipients === null ? null : formatNumber(recipients)}
          hint="Distinct HCPs and accounts"
          icon={<Users className="size-5" />}
        />
        <StatCard
          index={2}
          label="Signatures captured"
          value={signed === undefined ? null : formatNumber(signed)}
          hint={data ? `of ${formatNumber(data.length)} disbursements` : undefined}
          icon={<PenLine className="size-5" />}
        />
      </section>

      {error && <StatusAlert>{error}</StatusAlert>}

      <Card className="rise rise-3 gap-0 overflow-hidden p-0">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table aria-label="Sample disbursements">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Signature</TableHead>
                <TableHead>Record</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No sample disbursements found.
                  </TableCell>
                </TableRow>
              ) : (
                data!.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.product ?? '—'}</TableCell>
                    <TableCell>{sample.account ?? '—'}</TableCell>
                    <TableCell className="text-right font-display text-base font-semibold tabular-nums text-primary">
                      {formatNumber(sample.quantityDisbursed)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={sample.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(sample.date)}
                    </TableCell>
                    <TableCell>{sample.signatureCaptured ? 'Captured' : 'Not captured'}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {sample.name}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </main>
  );
}

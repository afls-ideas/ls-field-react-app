import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { deleteVisit, fetchVisitDetail, updateVisit } from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { VisitForm, minutesBetween } from '@/components/field/VisitForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { explainErrors, isLockedError } from '@/lib/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/format';

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 py-2 text-sm">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="text-right font-medium">{children || '—'}</dd>
    </div>
  );
}

export default function VisitDetail() {
  const { visitId = '' } = useParams();
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const visit = useAsyncData(() => fetchVisitDetail(visitId), [visitId, version]);
  const data = visit.data;
  // A submitted provider visit (or a completed visit) is locked by the org.
  const locked = !!data && (!!data.providerVisit?.submitted || data.status === 'Completed');

  const remove = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteVisit(visitId);
      toast.success('Visit deleted');
      navigate('/calendar');
    } catch (error) {
      setDeleteError(explainErrors(error).map((e) => e.message).join(' '));
      setDeleting(false);
    }
  };

  useEffect(() => {
    document.title = `${data?.account ?? 'Visit'} | Field Ledger`;
  }, [data?.account]);

  if (visit.loading) {
    return (
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <StatusAlert>{visit.error ?? 'Visit not found.'}</StatusAlert>
        <Link to="/calendar" className="mt-4 inline-block text-primary underline">
          Back to calendar
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow={`Visit ${data.name}`}
        title={data.account ?? 'Visit'}
        description={formatDateTime(data.start)}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge value={data.status} />
            {!editing && !locked && (
              <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
            )}
            {!editing && (
              <Button variant="outline" onClick={() => { setDeleteError(null); setConfirmingDelete(true); }}>
                Delete
              </Button>
            )}
            {data.accountId && (
              <Button asChild variant="outline">
                <Link to={`/accounts/${data.accountId}`}>View account</Link>
              </Button>
            )}
          </div>
        }
      />

      {visit.error && <div className="mb-4"><StatusAlert>{visit.error}</StatusAlert></div>}

      {locked && (
        <div className="mb-4">
          <StatusAlert variant="info">
            This visit is submitted and locked, so it can't be changed.
          </StatusAlert>
        </div>
      )}

      {editing ? (
        <Card className="rise rise-1 p-6">
          <VisitForm
            accountLocked
            initial={{
              account: data.accountId ? { id: data.accountId, name: data.account ?? 'Account' } : null,
              placeId: data.placeId,
              placeLabel: data.place,
              territoryId: data.territoryId,
              territoryLabel: data.territory,
              channel: data.channel ?? 'In-Person',
              start: data.start ? new Date(data.start) : new Date(),
              durationMinutes: minutesBetween(data.start, data.end),
              notes: data.instructions ?? '',
              brandIds: [...data.products]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .flatMap((p) => (p.productId ? [p.productId] : [])),
            }}
            submitLabel="Save changes"
            savingLabel="Saving…"
            cancel={<Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>}
            onSubmit={async (values) => {
              try {
                await updateVisit(data, values);
              } catch (error) {
                // The org may have locked the visit since we loaded it; show the
                // reason and refresh so the page reflects reality.
                if (isLockedError(error)) setVersion((v) => v + 1);
                else if (error instanceof Error && error.cause) setVersion((v) => v + 1);
                throw error;
              }
              toast.success('Visit updated');
              setEditing(false);
              setVersion((v) => v + 1);
            }}
          />
        </Card>
      ) : (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rise rise-1">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              <Row term="Planned start">{formatDateTime(data.start)}</Row>
              <Row term="Planned end">{formatDateTime(data.end)}</Row>
              {data.actualStart && <Row term="Actual start">{formatDateTime(data.actualStart)}</Row>}
              {data.actualEnd && <Row term="Actual end">{formatDateTime(data.actualEnd)}</Row>}
              <Row term="Channel">{data.channel}</Row>
              <Row term="Call type">{data.callType}</Row>
              <Row term="Priority">{data.priority}</Row>
              <Row term="Territory">{data.territory}</Row>
              <Row term="Place">{data.place}</Row>
              {data.providerVisit && (
                <Row term="Provider visit">
                  <StatusBadge value={data.providerVisit.status} />
                </Row>
              )}
              {data.providerVisit?.submitted && (
                <Row term="Submitted">{formatDateTime(data.providerVisit.submitted)}</Row>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card className="rise rise-2">
          <CardHeader><CardTitle>Products detailed</CardTitle></CardHeader>
          <CardContent>
            {data.products.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products were added to this visit.</p>
            ) : (
              <ol className="divide-y divide-border">
                {data.products.map((product) => (
                  <li key={product.id} className="flex items-center gap-3 py-3 text-sm">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {product.order ?? '·'}
                    </span>
                    <span className="font-medium">{product.name}</span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {(data.instructions || data.remarks || data.providerVisit?.notes) && (
          <Card className="rise rise-3 md:col-span-2">
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {data.instructions && <p><span className="text-muted-foreground">Instructions: </span>{data.instructions}</p>}
              {data.providerVisit?.notes && <p><span className="text-muted-foreground">Pre-visit notes: </span>{data.providerVisit.notes}</p>}
              {data.remarks && <p><span className="text-muted-foreground">Status remarks: </span>{data.remarks}</p>}
            </CardContent>
          </Card>
        )}
      </div>
      )}

      <Dialog open={confirmingDelete} onOpenChange={(open) => !deleting && setConfirmingDelete(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this visit?</DialogTitle>
            <DialogDescription>
              {data.name} and its products will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <StatusAlert>{deleteError}</StatusAlert>}
          <DialogFooter>
            <Button variant="outline" disabled={deleting} onClick={() => setConfirmingDelete(false)}>Cancel</Button>
            <Button variant="destructive" disabled={deleting} onClick={remove}>
              {deleting ? 'Deleting…' : 'Delete visit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

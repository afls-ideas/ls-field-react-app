import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { createVisit, fetchAccountDetail } from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { VisitForm } from '@/components/field/VisitForm';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function defaultStart(param: string | null): Date {
  const parsed = param ? new Date(param) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
  const next = new Date();
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}

export default function NewVisit() {
  useEffect(() => {
    document.title = 'New visit | Field Ledger';
  }, []);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetId = params.get('accountId');
  const preset = useAsyncData(
    () => (presetId ? fetchAccountDetail(presetId) : Promise.resolve(null)),
    [presetId]
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Planner"
        title="New visit"
        description="Schedule a visit. Products you select become the detailing order for the visit."
      />
      <Card className="rise rise-1 p-6">
        {preset.loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <VisitForm
            initial={{
              account: preset.data ? { id: preset.data.id, name: preset.data.name } : null,
              placeId: null,
              placeLabel: null,
              territoryId: null,
              territoryLabel: null,
              channel: 'In-Person',
              start: defaultStart(params.get('start')),
              durationMinutes: 30,
              notes: '',
              brandIds: [],
            }}
            submitLabel="Schedule visit"
            savingLabel="Scheduling…"
            cancel={<Button asChild variant="outline"><Link to="/calendar">Cancel</Link></Button>}
            onSubmit={async (values, account) => {
              const created = await createVisit({
                accountId: values.accountId,
                placeId: values.placeId,
                territoryId: values.territoryId,
                channel: values.channel,
                callType: null,
                start: values.start,
                end: values.end,
                notes: values.notes,
                brandIds: values.brandIds,
              });
              toast.success(`Visit scheduled with ${account.name}`);
              navigate(`/visits/${created.visitId}`);
            }}
          />
        )}
      </Card>
    </main>
  );
}

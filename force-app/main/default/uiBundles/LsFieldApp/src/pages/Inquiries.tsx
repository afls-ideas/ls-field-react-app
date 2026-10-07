import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { Plus } from 'lucide-react';
import {
  createInquiry,
  fetchAccountDetail,
  fetchAccountTerritories,
  fetchInquiriesPage,
  fetchInquiryRecordTypes,
  type InquiryRow,
} from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { AccountPicker, type PickedAccount } from '@/components/field/AccountPicker';
import { PageHeader } from '@/components/field/PageHeader';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
import { formatDateTime } from '@/lib/format';

const TYPES = ['Efficacy', 'Safety', 'Others'];
const CHANNELS = ['Field Request', 'Call Center', 'Email', 'Fax', 'Web'];
const textareaClass =
  'min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

export default function Inquiries() {
  useEffect(() => {
    document.title = 'Inquiries | Field Ledger';
  }, []);

  const [params, setParams] = useSearchParams();
  const presetId = params.get('accountId');

  const [version, setVersion] = useState(0);
  const [extra, setExtra] = useState<{ version: number; rows: InquiryRow[]; cursor: string | null; more: boolean } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const first = useAsyncData(() => fetchInquiriesPage(), [version]);
  const extraNow = extra?.version === version ? extra : null;
  const rows = [...(first.data?.rows ?? []), ...(extraNow?.rows ?? [])];
  const cursor = extraNow ? extraNow.cursor : first.data?.endCursor;
  const hasMore = extraNow ? extraNow.more : (first.data?.hasNextPage ?? false);

  const [open, setOpen] = useState(Boolean(presetId));
  const [pickedAccount, setAccount] = useState<PickedAccount | null | undefined>(undefined);
  const [type, setType] = useState('Efficacy');
  const [channel, setChannel] = useState('Field Request');
  const [urgent, setUrgent] = useState(false);
  const [question, setQuestion] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preset = useAsyncData(
    () => (presetId ? fetchAccountDetail(presetId) : Promise.resolve(null)),
    [presetId]
  );
  const account =
    pickedAccount !== undefined
      ? pickedAccount
      : preset.data
        ? { id: preset.data.id, name: preset.data.name }
        : null;

  const recordTypes = useAsyncData(fetchInquiryRecordTypes, []);
  const accountId = account?.id ?? null;
  const territories = useAsyncData(
    () => (accountId ? fetchAccountTerritories(accountId) : Promise.resolve([])),
    [accountId]
  );

  const loadMore = async () => {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const page = await fetchInquiriesPage(cursor);
      setExtra({
        version,
        rows: [...(extraNow?.rows ?? []), ...page.rows],
        cursor: page.endCursor,
        more: page.hasNextPage,
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && presetId) setParams({}, { replace: true });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!account) return setError('Choose the account the inquiry is for.');
    if (!question.trim()) return setError('Enter the question to be answered.');
    setSaving(true);
    setError(null);
    try {
      const territory = territories.data?.[0];
      await createInquiry({
        accountId: account.id,
        recordTypes: recordTypes.data ?? { caseId: null, inquiryId: null },
        type,
        urgent,
        channel,
        question,
        comment,
        territoryId: territory?.territoryId ?? null,
        territoryName: territory?.territoryName ?? null,
        contactPointId: null,
      });
      toast.success('Inquiry saved as a draft');
      setQuestion('');
      setComment('');
      setUrgent(false);
      setAccount(null);
      onOpenChange(false);
      setVersion((v) => v + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create the inquiry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Medical"
        title="Inquiries"
        description="Medical inquiries raised for healthcare professionals. New inquiries start as drafts."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" aria-hidden="true" /> New inquiry
          </Button>
        }
      />

      <Card className="rise rise-1 gap-0 overflow-hidden p-0">
        {first.error && <div className="p-4"><StatusAlert>{first.error}</StatusAlert></div>}
        {first.loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <Table aria-label="Inquiries">
            <TableHeader>
              <TableRow>
                <TableHead>Inquiry</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Urgent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No inquiries yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="tabular-nums text-muted-foreground">{row.name}</TableCell>
                    <TableCell className="font-medium">{row.account ?? '—'}</TableCell>
                    <TableCell>{row.type ?? '—'}</TableCell>
                    <TableCell>{row.priority ?? '—'}</TableCell>
                    <TableCell><StatusBadge value={row.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{row.channel ?? '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDateTime(row.submitted)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        {hasMore && (
          <div className="border-t border-border p-4 text-center">
            <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading…' : 'Load more'}
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New inquiry</DialogTitle>
            <DialogDescription>Creates a draft case, the inquiry and its first question.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {error && <StatusAlert>{error}</StatusAlert>}
            {recordTypes.data && !recordTypes.data.caseId && (
              <StatusAlert variant="info">
                No Case and Inquiry record type share a name in this org, so the inquiry may not link to its case.
              </StatusAlert>
            )}
            <div className="space-y-2">
              <Label htmlFor="inquiry-account">Account</Label>
              <AccountPicker id="inquiry-account" value={account} onChange={setAccount} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-11 w-full" aria-label="Type"><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="h-11 w-full" aria-label="Channel"><SelectValue /></SelectTrigger>
                  <SelectContent>{CHANNELS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <Checkbox checked={urgent} onCheckedChange={(c) => setUrgent(c === true)} />
              Mark as urgent
            </label>
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} className={textareaClass} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className={textareaClass} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save draft'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

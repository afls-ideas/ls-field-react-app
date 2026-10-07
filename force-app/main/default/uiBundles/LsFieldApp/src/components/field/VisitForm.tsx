import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { addMinutes, differenceInMinutes, format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  fetchAccountAddresses,
  fetchAccountTerritories,
  fetchBrands,
  type VisitFormValues,
} from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { AccountPicker, type PickedAccount } from '@/components/field/AccountPicker';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { explainErrors } from '@/lib/validation';

const CHANNELS = ['In-Person', 'Remote', 'Phone', 'Email', 'SMS', 'WeChat', 'WhatsApp'];
const DURATIONS = [15, 30, 45, 60, 90];
const NONE = 'none';
const toInput = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

const textareaClass =
  'min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

export interface VisitFormInitial {
  account: PickedAccount | null;
  placeId: string | null;
  placeLabel: string | null;
  territoryId: string | null;
  territoryLabel: string | null;
  channel: string;
  start: Date;
  durationMinutes: number;
  notes: string;
  brandIds: string[];
}

interface VisitFormProps {
  initial: VisitFormInitial;
  /** Editing keeps the visit on its account. */
  accountLocked?: boolean;
  submitLabel: string;
  savingLabel: string;
  onSubmit: (values: VisitFormValues, account: PickedAccount) => Promise<void>;
  cancel: ReactNode;
}

export function VisitForm({
  initial,
  accountLocked = false,
  submitLabel,
  savingLabel,
  onSubmit,
  cancel,
}: VisitFormProps) {
  const startErrorId = useId();
  const [account, setAccount] = useState(initial.account);
  const [placeChoice, setPlaceChoice] = useState<string | null>(initial.placeId);
  const [territoryChoice, setTerritoryChoice] = useState<string | null>(initial.territoryId);
  const [channel, setChannel] = useState(initial.channel);
  const [start, setStart] = useState(() => toInput(initial.start));
  const [duration, setDuration] = useState(String(initial.durationMinutes));
  const [brandIds, setBrandIds] = useState(initial.brandIds);
  const [notes, setNotes] = useState(initial.notes);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [startErrors, setStartErrors] = useState<string[]>([]);

  const accountId = account?.id ?? null;
  const addresses = useAsyncData(
    () => (accountId ? fetchAccountAddresses(accountId) : Promise.resolve([])),
    [accountId]
  );
  const territories = useAsyncData(
    () => (accountId ? fetchAccountTerritories(accountId) : Promise.resolve([])),
    [accountId]
  );
  const brands = useAsyncData(fetchBrands, []);

  const placeOptions = [...(addresses.data ?? [])].map((a) => ({ id: a.id, text: a.text }));
  if (initial.placeId && !placeOptions.some((o) => o.id === initial.placeId) && accountId === initial.account?.id) {
    placeOptions.unshift({ id: initial.placeId, text: initial.placeLabel ?? 'Current place' });
  }
  const territoryOptions = (territories.data ?? []).flatMap((t) =>
    t.territoryId ? [{ id: t.territoryId, text: t.territoryName ?? t.territoryId }] : []
  );
  if (
    initial.territoryId &&
    !territoryOptions.some((o) => o.id === initial.territoryId) &&
    accountId === initial.account?.id
  ) {
    territoryOptions.unshift({ id: initial.territoryId, text: initial.territoryLabel ?? 'Current territory' });
  }

  const placeId =
    placeChoice ?? (addresses.data?.find((a) => a.primary) ?? addresses.data?.[0])?.id ?? NONE;
  const territoryId = territoryChoice ?? territories.data?.[0]?.territoryId ?? NONE;

  const durationChoices = DURATIONS.includes(Number(duration))
    ? DURATIONS
    : [...DURATIONS, Number(duration)].sort((a, b) => a - b);

  const brandName = (id: string) => brands.data?.find((b) => b.id === id)?.name ?? id;
  const toggleBrand = (id: string, checked: boolean) =>
    setBrandIds((current) =>
      checked ? (current.includes(id) ? current : [...current, id]) : current.filter((b) => b !== id)
    );
  const move = (index: number, delta: number) =>
    setBrandIds((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormErrors([]);
    setStartErrors([]);
    if (!account) return setFormErrors(['Choose an account for this visit.']);
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return setStartErrors(['Enter a valid start time.']);

    setSaving(true);
    try {
      await onSubmit(
        {
          accountId: account.id,
          placeId: placeId === NONE ? null : placeId,
          territoryId: territoryId === NONE ? null : territoryId,
          channel,
          start: startDate,
          end: addMinutes(startDate, Number(duration)),
          notes,
          brandIds,
        },
        account
      );
    } catch (error) {
      const explained = explainErrors(error);
      setStartErrors(explained.filter((e) => e.field === 'start').map((e) => e.message));
      setFormErrors(explained.filter((e) => e.field !== 'start').map((e) => e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {formErrors.length > 0 && (
        <StatusAlert>
          {formErrors.length === 1 ? (
            formErrors[0]
          ) : (
            <ul className="list-disc pl-4">
              {formErrors.map((message) => <li key={message}>{message}</li>)}
            </ul>
          )}
        </StatusAlert>
      )}

      <div className="space-y-2">
        <Label htmlFor="account">Account</Label>
        {accountLocked && account ? (
          <p className="flex h-11 items-center rounded-md border border-input bg-muted px-3 text-sm font-medium">
            {account.name}
          </p>
        ) : (
          <AccountPicker
            id="account"
            value={account}
            onChange={(next) => {
              setAccount(next);
              setPlaceChoice(null);
              setTerritoryChoice(null);
            }}
          />
        )}
      </div>

      {account && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Place</Label>
            <Select value={placeId} onValueChange={setPlaceChoice}>
              <SelectTrigger className="h-11 w-full" aria-label="Place"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>No place</SelectItem>
                {placeOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.text}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Territory</Label>
            <Select value={territoryId} onValueChange={setTerritoryChoice}>
              <SelectTrigger className="h-11 w-full" aria-label="Territory"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>No territory</SelectItem>
                {territoryOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.text}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="start">Start</Label>
          <Input
            id="start"
            type="datetime-local"
            value={start}
            onChange={(e) => { setStart(e.target.value); setStartErrors([]); }}
            className="h-11"
            required
            aria-invalid={startErrors.length > 0}
            aria-describedby={startErrors.length > 0 ? startErrorId : undefined}
          />
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="h-11 w-full" aria-label="Duration"><SelectValue /></SelectTrigger>
            <SelectContent>
              {durationChoices.map((m) => <SelectItem key={m} value={String(m)}>{m} minutes</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Channel</Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="h-11 w-full" aria-label="Channel"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(CHANNELS.includes(channel) ? CHANNELS : [channel, ...CHANNELS]).map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {startErrors.length > 0 && (
          <p id={startErrorId} role="alert" className="text-sm text-destructive sm:col-span-3">
            {startErrors.join(' ')}
          </p>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Products to detail</legend>
        {brands.error && <p className="text-sm text-destructive">{brands.error}</p>}
        {(brands.data ?? []).length === 0 && !brands.loading && (
          <p className="text-sm text-muted-foreground">No active brands available.</p>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          {(brands.data ?? []).map((brand) => (
            <label key={brand.id} className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-card px-3 text-sm">
              <Checkbox
                checked={brandIds.includes(brand.id)}
                onCheckedChange={(checked) => toggleBrand(brand.id, checked === true)}
              />
              {brand.name}
            </label>
          ))}
        </div>
        {brandIds.length > 1 && (
          <div className="pt-2">
            <p className="mb-1 text-sm text-muted-foreground">Detailing order</p>
            <ol className="divide-y divide-border rounded-md border border-border bg-card">
              {brandIds.map((id, index) => (
                <li key={id} className="flex items-center gap-2 px-3 py-1 text-sm">
                  <span className="w-5 text-muted-foreground">{index + 1}.</span>
                  <span className="flex-1 font-medium">{brandName(id)}</span>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Move ${brandName(id)} up`} disabled={index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Move ${brandName(id)} down`} disabled={index === brandIds.length - 1} onClick={() => move(index, 1)}>
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="notes">Special instructions</Label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className={textareaClass} />
      </div>

      <div className="flex justify-end gap-2">
        {cancel}
        <Button type="submit" disabled={saving}>{saving ? savingLabel : submitLabel}</Button>
      </div>
    </form>
  );
}

export const minutesBetween = (start: string | null, end: string | null, fallback = 30) => {
  if (!start || !end) return fallback;
  const minutes = differenceInMinutes(new Date(end), new Date(start));
  return minutes > 0 ? minutes : fallback;
};

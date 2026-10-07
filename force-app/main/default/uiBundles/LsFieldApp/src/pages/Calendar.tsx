import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  setHours,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  fetchEventsInRange,
  fetchVisitsInRange,
  type CalendarEvent,
  type VisitItem,
} from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PageHeader } from '@/components/field/PageHeader';
import { StatusBadge } from '@/components/field/StatusBadge';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const dayKey = (date: Date) => format(date, 'yyyy-MM-dd');
const timeLabel = (iso: string | null) => (iso ? format(new Date(iso), 'h:mm a') : '');

function groupByDay<T>(items: T[], startOf: (item: T) => string | null): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const start = startOf(item);
    if (!start) continue;
    const key = dayKey(new Date(start));
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return groups;
}

type View = 'day' | 'week' | 'month';

type Entry =
  | { kind: 'visit'; key: string; start: string | null; visit: VisitItem }
  | { kind: 'event'; key: string; start: string | null; event: CalendarEvent };

function EntryRow({ entry, compact = false }: { entry: Entry; compact?: boolean }) {
  if (entry.kind === 'visit') {
    const { visit } = entry;
    return (
      <li className="relative -mx-2 space-y-1 rounded-md px-2 py-3 text-sm transition-colors hover:bg-secondary focus-within:bg-secondary">
        <div className="flex items-center justify-between gap-2">
          {/* Stretched link: the whole row opens the visit. */}
          <Link
            to={`/visits/${visit.id}`}
            className="font-medium text-primary underline underline-offset-4 after:absolute after:inset-0 after:content-['']"
          >
            {visit.account ?? visit.name}
          </Link>
          {!compact && <StatusBadge value={visit.status} />}
        </div>
        <p className="text-muted-foreground">
          {timeLabel(visit.start)}{visit.end ? ` – ${timeLabel(visit.end)}` : ''}
          {visit.channel ? ` · ${visit.channel}` : ''}
        </p>
        {compact && <StatusBadge value={visit.status} />}
      </li>
    );
  }
  const { event } = entry;
  return (
    <li className="space-y-1 py-3 text-sm">
      <span className="font-medium">{event.subject}</span>
      <p className="text-muted-foreground">
        {event.allDay ? 'All day' : `${timeLabel(event.start)}${event.end ? ` – ${timeLabel(event.end)}` : ''}`}
        {event.location ? ` · ${event.location}` : ''}
      </p>
    </li>
  );
}

function rangeFor(view: View, anchor: Date): { from: Date; to: Date } {
  if (view === 'day') return { from: startOfDay(anchor), to: addDays(startOfDay(anchor), 1) };
  if (view === 'week') return { from: startOfWeek(anchor), to: addDays(startOfWeek(anchor), 7) };
  return { from: startOfWeek(startOfMonth(anchor)), to: addDays(endOfWeek(endOfMonth(anchor)), 1) };
}

function titleFor(view: View, anchor: Date): string {
  if (view === 'day') return format(anchor, 'EEEE, MMMM d, yyyy');
  if (view === 'month') return format(anchor, 'MMMM yyyy');
  const first = startOfWeek(anchor);
  const last = addDays(first, 6);
  return isSameMonth(first, last)
    ? `${format(first, 'MMM d')} – ${format(last, 'd, yyyy')}`
    : `${format(first, 'MMM d')} – ${format(last, 'MMM d, yyyy')}`;
}

function shift(view: View, anchor: Date, direction: 1 | -1): Date {
  if (view === 'day') return addDays(anchor, direction);
  if (view === 'week') return addWeeks(anchor, direction);
  return addMonths(anchor, direction);
}

export default function Calendar() {
  useEffect(() => {
    document.title = 'Calendar | Field Ledger';
  }, []);

  const [view, setView] = useState<View>('month');
  const [anchor, setAnchor] = useState(() => new Date());

  const { from, to } = rangeFor(view, anchor);
  const rangeKey = `${from.toISOString()}|${to.toISOString()}`;

  const visits = useAsyncData(() => fetchVisitsInRange(from, to), [rangeKey]);
  const events = useAsyncData(() => fetchEventsInRange(from, to), [rangeKey]);

  const entriesByDay = useMemo(() => {
    const entries: Entry[] = [
      ...(visits.data ?? []).map((visit): Entry => ({ kind: 'visit', key: visit.id, start: visit.start, visit })),
      ...(events.data ?? []).map((event): Entry => ({ kind: 'event', key: event.id, start: event.start, event })),
    ].sort((a, b) => (a.start ?? '').localeCompare(b.start ?? ''));
    return groupByDay<Entry>(entries, (entry) => entry.start);
  }, [visits.data, events.data]);

  const days = eachDayOfInterval({ start: from, end: addDays(to, -1) });
  const loading = visits.loading || events.loading;
  const dayEntries = entriesByDay.get(dayKey(anchor)) ?? [];
  const newVisitStart = setHours(startOfDay(anchor), 9);
  const newVisitLink = `/visits/new?start=${encodeURIComponent(newVisitStart.toISOString())}`;
  const unit = view;

  const openDay = (day: Date) => {
    setAnchor(day);
    setView('day');
  };

  const agenda = (entries: Entry[]) =>
    loading ? (
      <Skeleton className="h-32 w-full" />
    ) : entries.length === 0 ? (
      <p className="text-sm text-muted-foreground">Nothing scheduled.</p>
    ) : (
      <ul className="divide-y divide-border">
        {entries.map((entry) => <EntryRow key={`${entry.kind}-${entry.key}`} entry={entry} />)}
      </ul>
    );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Planner"
        title="Calendar"
        description="Planned and completed visits alongside your calendar events, by day, week or month."
        actions={
          <Button asChild>
            <Link to={newVisitLink}>
              <CalendarPlus className="size-4" aria-hidden="true" /> New visit
            </Link>
          </Button>
        }
      />

      {(visits.error || events.error) && (
        <div className="mb-4"><StatusAlert>{visits.error ?? events.error}</StatusAlert></div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label={`Previous ${unit}`} onClick={() => setAnchor(shift(view, anchor, -1))}>
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" onClick={() => setAnchor(new Date())}>Today</Button>
          <Button variant="outline" size="icon" aria-label={`Next ${unit}`} onClick={() => setAnchor(shift(view, anchor, 1))}>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
          <h2 className="ml-3 font-heading text-xl" aria-live="polite">{titleFor(view, anchor)}</h2>
        </div>
        <Tabs value={view} onValueChange={(value) => setView(value as View)}>
          <TabsList aria-label="Calendar view">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'day' && (
        <Card className="rise rise-1">
          <CardContent className="pt-6">
            {agenda(dayEntries)}
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to={newVisitLink}>Schedule a visit on this day</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {view === 'week' && (
        <div className="rise rise-1 grid gap-3 md:grid-cols-7">
          {days.map((day) => {
            const entries = entriesByDay.get(dayKey(day)) ?? [];
            const today = isSameDay(day, new Date());
            return (
              <Card key={dayKey(day)} className={cn(today && 'ring-2 ring-primary')}>
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm">
                    <button
                      type="button"
                      onClick={() => openDay(day)}
                      className="text-left underline-offset-4 hover:underline"
                      aria-label={`Open ${format(day, 'EEEE, MMMM d')}`}
                    >
                      {format(day, 'EEE d')}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : entries.length === 0 ? (
                    <p className="py-3 text-xs text-muted-foreground">Nothing scheduled.</p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {entries.map((entry) => <EntryRow key={`${entry.kind}-${entry.key}`} entry={entry} compact />)}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {view === 'month' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rise rise-1 lg:col-span-2">
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-muted-foreground">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px rounded-md bg-border">
                {days.map((day) => {
                  const key = dayKey(day);
                  const entries = entriesByDay.get(key) ?? [];
                  const visitCount = entries.filter((e) => e.kind === 'visit').length;
                  const eventCount = entries.length - visitCount;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAnchor(day)}
                      onDoubleClick={() => openDay(day)}
                      aria-label={`${format(day, 'EEEE, MMMM d')}: ${visitCount} visits, ${eventCount} events`}
                      aria-pressed={isSameDay(day, anchor)}
                      className={cn(
                        'flex min-h-20 flex-col items-start gap-1 bg-card p-2 text-left text-sm transition-colors hover:bg-secondary',
                        !isSameMonth(day, anchor) && 'text-muted-foreground/60',
                        isSameDay(day, anchor) && 'ring-2 ring-inset ring-primary'
                      )}
                    >
                      <span className={cn('font-medium', isSameDay(day, new Date()) && 'rounded-full bg-primary px-1.5 text-primary-foreground')}>
                        {format(day, 'd')}
                      </span>
                      {visitCount > 0 && (
                        <span className="rounded bg-primary/10 px-1.5 text-xs text-primary">{visitCount} visit{visitCount > 1 ? 's' : ''}</span>
                      )}
                      {eventCount > 0 && (
                        <span className="rounded bg-chart-2/20 px-1.5 text-xs text-accent-foreground">{eventCount} event{eventCount > 1 ? 's' : ''}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rise rise-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{format(anchor, 'EEEE, MMM d')}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => openDay(anchor)}>Day view</Button>
            </CardHeader>
            <CardContent>
              {agenda(dayEntries)}
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to={newVisitLink}>Schedule a visit on this day</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

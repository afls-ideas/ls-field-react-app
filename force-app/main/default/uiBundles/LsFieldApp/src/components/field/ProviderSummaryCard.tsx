import { Sparkles } from 'lucide-react';
import { fetchProviderSummary, type SummarySection } from '@/api/engagementData';
import { useAsyncData } from '@/hooks/useAsyncData';
import { StatusAlert } from '@/components/alerts/status-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/format';

function Sections({ sections }: { sections: SummarySection[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <section key={`${section.name}-${index}`} className="space-y-2">
          {section.name && <h3 className="font-heading text-base text-primary">{section.name}</h3>}
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
            {section.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      ))}
    </>
  );
}

/** AI-generated rep briefing, stored on Provider Account Territory Summary. */
export function ProviderSummaryCard({ accountId }: { accountId: string }) {
  const summary = useAsyncData(() => fetchProviderSummary(accountId), [accountId]);
  const data = summary.data;

  return (
    <Card className="rise rise-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Provider Summary
          <Sparkles className="size-4 text-primary" aria-label="AI generated" role="img" />
        </CardTitle>
        {data?.generated && (
          <p className="text-xs text-muted-foreground">
            Summary generated on {formatDateTime(data.generated)}
            {data.territory ? ` · ${data.territory}` : ''}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {summary.error ? (
          <StatusAlert>{summary.error}</StatusAlert>
        ) : summary.loading ? (
          <Skeleton className="h-40 w-full" />
        ) : !data ? (
          <p className="text-sm text-muted-foreground">
            No summary has been generated for this account yet.
          </p>
        ) : (
          <>
            <Sections sections={data.keyInfo} />
            {data.changeInfo.length > 0 && (
              <div className="space-y-6 border-t border-border pt-6">
                <Sections sections={data.changeInfo} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

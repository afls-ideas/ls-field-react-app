/**
 * Data layer for Field Ledger. Every query lives in src/api/queries/*.graphql
 * (compiled against the org schema) and is typed by graphql:codegen.
 */
import { executeGraphQL } from './graphqlClient';
import type {
  GetDisbursementsQuery,
  GetDisbursementsQueryVariables,
  GetSamplesByProductQuery,
  GetUpcomingVisitsQuery,
  GetUpcomingVisitsQueryVariables,
  GetVisitChannelCountsQuery,
  GetVisitStatusCountsQuery,
  GetVisitsQuery,
  GetVisitsQueryVariables,
} from './graphql-operations-types';
import GET_DISBURSEMENTS from './queries/GetDisbursements.graphql?raw';
import GET_SAMPLES_BY_PRODUCT from './queries/GetSamplesByProduct.graphql?raw';
import GET_UPCOMING_VISITS from './queries/GetUpcomingVisits.graphql?raw';
import GET_VISIT_CHANNEL_COUNTS from './queries/GetVisitChannelCounts.graphql?raw';
import GET_VISIT_STATUS_COUNTS from './queries/GetVisitStatusCounts.graphql?raw';
import GET_VISITS from './queries/GetVisits.graphql?raw';

type Field<T> = { value?: T | null; displayValue?: string | null } | null | undefined;

const raw = <T>(field: Field<T>): T | null => field?.value ?? null;
const label = (field: Field<string>): string | null =>
  field?.displayValue ?? field?.value ?? null;

export interface Call {
  id: string;
  name: string;
  account: string | null;
  status: string | null;
  channel: string | null;
  callType: string | null;
  priority: string | null;
  plannedStart: string | null;
  actualStart: string | null;
  territory: string | null;
  remarks: string | null;
}

export interface Sample {
  id: string;
  name: string;
  product: string | null;
  account: string | null;
  status: string | null;
  quantityDisbursed: number;
  quantityRequested: number | null;
  date: string | null;
  signatureCaptured: boolean;
  comments: string | null;
}

export interface CountBucket {
  label: string;
  value: number;
}

export interface Page<T> {
  rows: T[];
  endCursor: string | null;
  hasNextPage: boolean;
}

type VisitNode = NonNullable<
  NonNullable<
    NonNullable<GetVisitsQuery['uiapi']['query']['Visit']>['edges']
  >[number]
>['node'];

function toCall(node: VisitNode): Call | null {
  if (!node) return null;
  return {
    id: node.Id,
    name: label(node.Name) ?? node.Id,
    account: label(node.Account?.Name),
    status: raw(node.Status),
    channel: raw(node.Channel),
    callType: label(node.Call_type__c),
    priority: raw(node.VisitPriority),
    plannedStart: raw(node.PlannedVisitStartTime),
    actualStart: raw(node.ActualVisitStartTime),
    territory: label(node.LS_Territory_Name__c),
    remarks: label(node.StatusRemarks),
  };
}

export async function fetchVisitsPage(
  filters: { status?: string; channel?: string },
  after?: string | null
): Promise<Page<Call>> {
  const data = await executeGraphQL<GetVisitsQuery, GetVisitsQueryVariables>(
    GET_VISITS,
    {
      after: after ?? undefined,
      status: filters.status,
      channel: filters.channel,
    }
  );
  const connection = data.uiapi.query.Visit;
  return {
    rows: (connection?.edges ?? [])
      .map((edge) => toCall(edge?.node))
      .filter((call): call is Call => call !== null),
    endCursor: connection?.pageInfo.endCursor ?? null,
    hasNextPage: connection?.pageInfo.hasNextPage ?? false,
  };
}

export async function fetchUpcomingVisits(fromIso: string): Promise<Call[]> {
  const data = await executeGraphQL<
    GetUpcomingVisitsQuery,
    GetUpcomingVisitsQueryVariables
  >(GET_UPCOMING_VISITS, { from: { value: fromIso } });
  return (data.uiapi.query.Visit?.edges ?? [])
    .map((edge) => toCall(edge?.node))
    .filter((call): call is Call => call !== null);
}

export async function fetchVisitStatusCounts(): Promise<CountBucket[]> {
  const data = await executeGraphQL<GetVisitStatusCountsQuery, undefined>(
    GET_VISIT_STATUS_COUNTS
  );
  return (data.uiapi.aggregate.Visit?.edges ?? []).map((edge) => ({
    label: edge?.node?.aggregate?.Status?.value ?? 'Unspecified',
    value: edge?.node?.aggregate?.total?.count?.value ?? 0,
  }));
}

export async function fetchVisitChannelCounts(): Promise<CountBucket[]> {
  const data = await executeGraphQL<GetVisitChannelCountsQuery, undefined>(
    GET_VISIT_CHANNEL_COUNTS
  );
  return (data.uiapi.aggregate.Visit?.edges ?? []).map((edge) => ({
    label: edge?.node?.aggregate?.Channel?.value ?? 'Unspecified',
    value: edge?.node?.aggregate?.total?.count?.value ?? 0,
  }));
}

export async function fetchSampleUnitsByProduct(): Promise<CountBucket[]> {
  const data = await executeGraphQL<GetSamplesByProductQuery, undefined>(
    GET_SAMPLES_BY_PRODUCT
  );
  return (data.uiapi.aggregate.ProductDisbursement?.edges ?? []).map(
    (edge) => ({
      label: edge?.node?.aggregate?.ProductName?.value ?? 'Unspecified',
      value: edge?.node?.aggregate?.units?.sum?.value ?? 0,
    })
  );
}

type DisbursementNode = NonNullable<
  NonNullable<
    NonNullable<
      GetDisbursementsQuery['uiapi']['query']['ProductDisbursement']
    >['edges']
  >[number]
>['node'];

function toSample(node: DisbursementNode): Sample | null {
  if (!node) return null;
  return {
    id: node.Id,
    name: label(node.Name) ?? node.Id,
    product: label(node.ProductName),
    account: label(node.DisbursementToAccount?.Name),
    status: raw(node.Status),
    quantityDisbursed: raw(node.QuantityDisbursed) ?? 0,
    quantityRequested: raw(node.QuantityRequested),
    date: raw(node.DisbursementDate),
    signatureCaptured: raw(node.IsSignatureCaptured) ?? false,
    comments: label(node.Comments),
  };
}

/** Follows pageInfo until the org has no more disbursements (volume is small). */
export async function fetchAllSamples(): Promise<Sample[]> {
  const samples: Sample[] = [];
  let after: string | undefined;
  do {
    const data = await executeGraphQL<
      GetDisbursementsQuery,
      GetDisbursementsQueryVariables
    >(GET_DISBURSEMENTS, { after });
    const connection = data.uiapi.query.ProductDisbursement;
    for (const edge of connection?.edges ?? []) {
      const sample = toSample(edge?.node);
      if (sample) samples.push(sample);
    }
    after = connection?.pageInfo.hasNextPage
      ? (connection.pageInfo.endCursor ?? undefined)
      : undefined;
  } while (after);
  return samples;
}

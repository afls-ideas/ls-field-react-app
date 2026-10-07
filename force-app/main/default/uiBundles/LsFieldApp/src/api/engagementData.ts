/**
 * Data layer for the LSC-style screens: Accounts, Calendar, Inquiries and the
 * New Visit flow. Queries live in src/api/queries/*.graphql and are typed by
 * graphql:codegen. Record creation is sequential (parent first, then children
 * using the returned Id) so a failure names exactly which step broke.
 */
import { executeGraphQL } from './graphqlClient';
import type {
  CreateCaseMutation,
  CreateCaseMutationVariables,
  CreateInquiryMutation,
  CreateInquiryMutationVariables,
  CreateInquiryQuestionMutationVariables,
  CreateProviderVisitMutation,
  CreateProviderVisitMutationVariables,
  CreateProviderVisitProdDetailingMutationVariables,
  CreateVisitMutation,
  DeleteProviderVisitProdDetailingMutationVariables,
  DeleteVisitMutationVariables,
  UpdateProviderVisitProdDetailingMutationVariables,
  UpdateVisitMutationVariables,
  CreateVisitMutationVariables,
  GetAccountAddressesQuery,
  GetAccountAddressesQueryVariables,
  GetAccountDetailQuery,
  GetAccountDetailQueryVariables,
  GetAccountsQuery,
  GetAccountsQueryVariables,
  GetAccountTerritoriesQuery,
  GetAccountTerritoriesQueryVariables,
  GetAccountVisitsQuery,
  GetAccountVisitsQueryVariables,
  GetBrandsQuery,
  GetEventsInRangeQuery,
  GetEventsInRangeQueryVariables,
  GetInquiriesQuery,
  GetInquiriesQueryVariables,
  GetInquiryRecordTypesQuery,
  GetAccountAffiliationsQuery,
  GetAccountAffiliationsQueryVariables,
  GetAccountInquiriesQuery,
  GetAccountInquiriesQueryVariables,
  GetProviderSummaryQuery,
  GetProviderSummaryQueryVariables,
  GetVisitDetailQuery,
  GetVisitDetailQueryVariables,
  GetVisitsInRangeQuery,
  GetVisitsInRangeQueryVariables,
} from './graphql-operations-types';
import CREATE_CASE from './queries/CreateCase.graphql?raw';
import CREATE_INQUIRY from './queries/CreateInquiry.graphql?raw';
import CREATE_INQUIRY_QUESTION from './queries/CreateInquiryQuestion.graphql?raw';
import CREATE_PROVIDER_VISIT from './queries/CreateProviderVisit.graphql?raw';
import CREATE_PVPD from './queries/CreateProviderVisitProdDetailing.graphql?raw';
import DELETE_PVPD from './queries/DeleteProviderVisitProdDetailing.graphql?raw';
import DELETE_VISIT from './queries/DeleteVisit.graphql?raw';
import UPDATE_PVPD from './queries/UpdateProviderVisitProdDetailing.graphql?raw';
import UPDATE_VISIT from './queries/UpdateVisit.graphql?raw';
import CREATE_VISIT from './queries/CreateVisit.graphql?raw';
import GET_ACCOUNT_ADDRESSES from './queries/GetAccountAddresses.graphql?raw';
import GET_ACCOUNT_DETAIL from './queries/GetAccountDetail.graphql?raw';
import GET_ACCOUNT_TERRITORIES from './queries/GetAccountTerritories.graphql?raw';
import GET_ACCOUNT_VISITS from './queries/GetAccountVisits.graphql?raw';
import GET_ACCOUNTS from './queries/GetAccounts.graphql?raw';
import GET_BRANDS from './queries/GetBrands.graphql?raw';
import GET_EVENTS_IN_RANGE from './queries/GetEventsInRange.graphql?raw';
import GET_INQUIRIES from './queries/GetInquiries.graphql?raw';
import GET_INQUIRY_RECORD_TYPES from './queries/GetInquiryRecordTypes.graphql?raw';
import GET_ACCOUNT_AFFILIATIONS from './queries/GetAccountAffiliations.graphql?raw';
import GET_ACCOUNT_INQUIRIES from './queries/GetAccountInquiries.graphql?raw';
import GET_PROVIDER_SUMMARY from './queries/GetProviderSummary.graphql?raw';
import GET_VISIT_DETAIL from './queries/GetVisitDetail.graphql?raw';
import GET_VISITS_IN_RANGE from './queries/GetVisitsInRange.graphql?raw';

type Field<T> = { value?: T | null; displayValue?: string | null } | null | undefined;

const raw = <T>(field: Field<T>): T | null => field?.value ?? null;
const label = (field: Field<string>): string | null =>
  field?.displayValue ?? field?.value ?? null;

function nodes<T>(
  connection: { edges?: ({ node?: T | null } | null)[] | null } | null | undefined
): T[] {
  return (connection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is T => node != null);
}

/* ---------------------------------- Accounts --------------------------------- */

export interface AccountRow {
  id: string;
  name: string;
  kind: string | null;
  type: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
}

export interface AccountPage {
  rows: AccountRow[];
  endCursor: string | null;
  hasNextPage: boolean;
}

const joinParts = (...parts: (string | null)[]) =>
  parts.filter(Boolean).join(', ') || null;

export async function fetchAccountsPage(
  search: string,
  after?: string | null
): Promise<AccountPage> {
  const term = search.trim();
  const data = await executeGraphQL<GetAccountsQuery, GetAccountsQueryVariables>(
    GET_ACCOUNTS,
    { after: after ?? undefined, search: term ? `%${term}%` : '%' }
  );
  const connection = data.uiapi.query.Account;
  return {
    rows: nodes(connection).map((node) => ({
      id: node.Id,
      name: label(node.Name) ?? node.Id,
      kind: raw(node.RecordType?.Name),
      type: label(node.Type),
      phone: raw(node.Phone),
      email: raw(node.PersonEmail),
      location: joinParts(raw(node.PersonMailingCity), raw(node.PersonMailingState)),
    })),
    endCursor: connection?.pageInfo.endCursor ?? null,
    hasNextPage: connection?.pageInfo.hasNextPage ?? false,
  };
}

export interface AccountDetail extends AccountRow {
  address: string | null;
}

export async function fetchAccountDetail(id: string): Promise<AccountDetail | null> {
  const data = await executeGraphQL<GetAccountDetailQuery, GetAccountDetailQueryVariables>(
    GET_ACCOUNT_DETAIL,
    { id }
  );
  const node = nodes(data.uiapi.query.Account)[0];
  if (!node) return null;
  return {
    id: node.Id,
    name: label(node.Name) ?? node.Id,
    kind: raw(node.RecordType?.Name),
    type: label(node.Type),
    phone: raw(node.Phone),
    email: raw(node.PersonEmail),
    location: joinParts(raw(node.PersonMailingCity), raw(node.PersonMailingState)),
    address: joinParts(
      raw(node.PersonMailingStreet),
      raw(node.PersonMailingCity),
      joinParts(raw(node.PersonMailingState), raw(node.PersonMailingPostalCode))
    ),
  };
}

export interface AccountTerritory {
  id: string;
  territoryId: string | null;
  territoryName: string | null;
  targeted: boolean;
  lastVisitDate: string | null;
  nextVisitDate: string | null;
  ytdVisits: number;
}

export async function fetchAccountTerritories(accountId: string): Promise<AccountTerritory[]> {
  const data = await executeGraphQL<
    GetAccountTerritoriesQuery,
    GetAccountTerritoriesQueryVariables
  >(GET_ACCOUNT_TERRITORIES, { accountId });
  return nodes(data.uiapi.query.ProviderAcctTerritoryInfo).map((node) => ({
    id: node.Id,
    territoryId: raw(node.Territory2Id),
    territoryName: raw(node.Territory2?.Name),
    targeted: raw(node.IsTargetedAccount) ?? false,
    lastVisitDate: raw(node.LastProviderVisitDate),
    nextVisitDate: raw(node.NextProviderVisitDate),
    ytdVisits: raw(node.YearToDatePrvdVisitCount) ?? 0,
  }));
}

export interface AccountAddress {
  id: string;
  name: string;
  text: string;
  primary: boolean;
}

export async function fetchAccountAddresses(accountId: string): Promise<AccountAddress[]> {
  const data = await executeGraphQL<
    GetAccountAddressesQuery,
    GetAccountAddressesQueryVariables
  >(GET_ACCOUNT_ADDRESSES, { accountId });
  return nodes(data.uiapi.query.ContactPointAddress).map((node) => {
    const text = joinParts(
      raw(node.Street),
      raw(node.City),
      joinParts(raw(node.State), raw(node.PostalCode))
    );
    return {
      id: node.Id,
      name: raw(node.Name) ?? text ?? node.Id,
      text: text ?? raw(node.Name) ?? node.Id,
      primary: raw(node.IsPrimary) ?? false,
    };
  });
}

/* ---------------------------------- Visits ----------------------------------- */

export interface VisitItem {
  id: string;
  name: string;
  account: string | null;
  status: string | null;
  channel: string | null;
  callType: string | null;
  territory: string | null;
  start: string | null;
  end: string | null;
}

type VisitNode = NonNullable<
  NonNullable<GetVisitsInRangeQuery['uiapi']['query']['Visit']>['edges']
>[number] extends infer E
  ? E extends { node?: infer N | null }
    ? NonNullable<N>
    : never
  : never;

const toVisitItem = (node: VisitNode): VisitItem => ({
  id: node.Id,
  name: raw(node.Name) ?? node.Id,
  account: raw(node.Account?.Name),
  status: raw(node.Status),
  channel: raw(node.Channel),
  callType: label(node.Call_type__c),
  territory: raw(node.LS_Territory_Name__c),
  start: raw(node.PlannedVisitStartTime),
  end: raw(node.PlannedVisitEndTime),
});

export async function fetchVisitsInRange(from: Date, to: Date): Promise<VisitItem[]> {
  const data = await executeGraphQL<GetVisitsInRangeQuery, GetVisitsInRangeQueryVariables>(
    GET_VISITS_IN_RANGE,
    { from: from.toISOString(), to: to.toISOString() }
  );
  return nodes(data.uiapi.query.Visit).map(toVisitItem);
}

export async function fetchAccountVisits(accountId: string): Promise<VisitItem[]> {
  const data = await executeGraphQL<GetAccountVisitsQuery, GetAccountVisitsQueryVariables>(
    GET_ACCOUNT_VISITS,
    { accountId }
  );
  return nodes(data.uiapi.query.Visit).map((node) =>
    toVisitItem({ ...node, PlannedVisitEndTime: undefined })
  );
}

export interface VisitDetail {
  id: string;
  name: string;
  accountId: string | null;
  account: string | null;
  status: string | null;
  channel: string | null;
  callType: string | null;
  priority: string | null;
  start: string | null;
  end: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  territory: string | null;
  place: string | null;
  placeId: string | null;
  territoryId: string | null;
  instructions: string | null;
  remarks: string | null;
  providerVisit: { id: string; status: string | null; submitted: string | null; notes: string | null } | null;
  products: { id: string; productId: string | null; name: string; order: number | null }[];
}

export async function fetchVisitDetail(id: string): Promise<VisitDetail | null> {
  const data = await executeGraphQL<GetVisitDetailQuery, GetVisitDetailQueryVariables>(
    GET_VISIT_DETAIL,
    { id }
  );
  const visit = nodes(data.uiapi.query.Visit)[0];
  if (!visit) return null;
  const providerVisit = nodes(data.uiapi.query.ProviderVisit)[0];
  return {
    id: visit.Id,
    name: raw(visit.Name) ?? visit.Id,
    accountId: raw(visit.AccountId),
    account: raw(visit.Account?.Name),
    status: raw(visit.Status),
    channel: raw(visit.Channel),
    callType: label(visit.Call_type__c),
    priority: label(visit.VisitPriority),
    start: raw(visit.PlannedVisitStartTime),
    end: raw(visit.PlannedVisitEndTime),
    actualStart: raw(visit.ActualVisitStartTime),
    actualEnd: raw(visit.ActualVisitEndTime),
    territory: raw(visit.LS_Territory_Name__c),
    place: raw(visit.ContactPointAddress),
    placeId: raw(visit.PlaceId),
    territoryId: raw(visit.TerritoryId),
    instructions: raw(visit.InstructionDescription),
    remarks: raw(visit.StatusRemarks),
    providerVisit: providerVisit
      ? {
          id: providerVisit.Id,
          status: raw(providerVisit.Status),
          submitted: raw(providerVisit.VisitSubmitDateTime),
          notes: raw(providerVisit.PreProviderVisitNotes),
        }
      : null,
    products: nodes(data.uiapi.query.ProviderVisitProdDetailing).map((node) => ({
      id: node.Id,
      productId: raw(node.ProductId),
      name: raw(node.Product?.Name) ?? raw(node.Name) ?? node.Id,
      order: raw(node.Priority),
    })),
  };
}

export interface CalendarEvent {
  id: string;
  subject: string;
  start: string | null;
  end: string | null;
  allDay: boolean;
  location: string | null;
}

export async function fetchEventsInRange(from: Date, to: Date): Promise<CalendarEvent[]> {
  const data = await executeGraphQL<GetEventsInRangeQuery, GetEventsInRangeQueryVariables>(
    GET_EVENTS_IN_RANGE,
    { from: from.toISOString(), to: to.toISOString() }
  );
  return nodes(data.uiapi.query.Event).map((node) => ({
    id: node.Id,
    subject: raw(node.Subject) ?? '(No subject)',
    start: raw(node.StartDateTime),
    end: raw(node.EndDateTime),
    allDay: raw(node.IsAllDayEvent) ?? false,
    location: raw(node.Location),
  }));
}

export interface Brand {
  id: string;
  name: string;
}

export async function fetchBrands(): Promise<Brand[]> {
  const data = await executeGraphQL<GetBrandsQuery, undefined>(GET_BRANDS);
  return nodes(data.uiapi.query.LifeSciMarketableProduct).map((node) => ({
    id: node.Id,
    name: raw(node.Name) ?? node.Id,
  }));
}

export interface NewVisitInput {
  accountId: string;
  placeId: string | null;
  territoryId: string | null;
  channel: string;
  callType: string | null;
  start: Date;
  end: Date;
  notes: string;
  brandIds: string[];
}

export interface NewVisitResult {
  visitId: string;
  providerVisitId: string;
}

/**
 * Mirrors the Demo Data Starter Kit's DemoVisitController: Visit, then its
 * ProviderVisit (VisitId), then one ProviderVisitProdDetailing per brand
 * (Priority is the detailing order). Planned visits stay Planned.
 */
export async function createVisit(input: NewVisitInput): Promise<NewVisitResult> {
  const visit = await executeGraphQL<CreateVisitMutation, CreateVisitMutationVariables>(
    CREATE_VISIT,
    {
      input: {
        Visit: {
          AccountId: input.accountId,
          PlaceId: input.placeId ?? undefined,
          TerritoryId: input.territoryId ?? undefined,
          Channel: input.channel,
          Call_type__c: input.callType ?? undefined,
          Status: 'Planned',
          PlannedVisitStartTime: input.start.toISOString(),
          PlannedVisitEndTime: input.end.toISOString(),
          InstructionDescription: input.notes.trim() || undefined,
        },
      },
    }
  );
  const visitId = visit.uiapi.VisitCreate?.Record?.Id;
  if (!visitId) throw new Error('Visit was not created');

  try {
    const providerVisit = await executeGraphQL<
      CreateProviderVisitMutation,
      CreateProviderVisitMutationVariables
    >(CREATE_PROVIDER_VISIT, { input: { ProviderVisit: { VisitId: visitId } } });
    const providerVisitId = providerVisit.uiapi.ProviderVisitCreate?.Record?.Id;
    if (!providerVisitId) throw new Error('Provider visit was not created');

    for (const [index, brandId] of input.brandIds.entries()) {
      await executeGraphQL<unknown, CreateProviderVisitProdDetailingMutationVariables>(
        CREATE_PVPD,
        {
          input: {
            ProviderVisitProdDetailing: {
              ProviderVisitId: providerVisitId,
              ProductId: brandId,
              Priority: index + 1,
            },
          },
        }
      );
    }
    return { visitId, providerVisitId };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Visit ${visitId} was created but a follow-up step failed: ${reason}`);
  }
}

export interface VisitFormValues {
  accountId: string;
  placeId: string | null;
  territoryId: string | null;
  channel: string;
  start: Date;
  end: Date;
  notes: string;
  /** Product ids in detailing order. */
  brandIds: string[];
}

const sameInstant = (iso: string | null, date: Date) =>
  iso !== null && new Date(iso).getTime() === date.getTime();

/**
 * Saves only what changed. The Visit goes first so the org's validation
 * (future-visit limit, start/end order, locks) rejects before any product row
 * is touched; products are then reconciled against the existing detailings.
 */
export async function updateVisit(current: VisitDetail, next: VisitFormValues): Promise<void> {
  const changes: Record<string, string | null> = {};
  if (!sameInstant(current.start, next.start)) {
    changes.PlannedVisitStartTime = next.start.toISOString();
  }
  if (!sameInstant(current.end, next.end)) {
    changes.PlannedVisitEndTime = next.end.toISOString();
  }
  if (next.channel !== current.channel) changes.Channel = next.channel;
  if (next.placeId !== current.placeId) changes.PlaceId = next.placeId;
  if (next.territoryId !== current.territoryId) changes.TerritoryId = next.territoryId;
  if (next.notes.trim() !== (current.instructions ?? '').trim()) {
    changes.InstructionDescription = next.notes.trim() || null;
  }

  if (Object.keys(changes).length > 0) {
    await executeGraphQL<unknown, UpdateVisitMutationVariables>(UPDATE_VISIT, {
      input: { Id: current.id, Visit: changes },
    });
  }

  try {
    await syncProducts(current, next.brandIds);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`The visit was saved, but updating its products failed: ${reason}`, {
      cause: error,
    });
  }
}

async function syncProducts(current: VisitDetail, brandIds: string[]): Promise<void> {
  const existing = current.products;
  const unchanged =
    existing.length === brandIds.length &&
    existing.every((row, index) => row.productId === brandIds[index] && row.order === index + 1);
  if (unchanged) return;

  let providerVisitId = current.providerVisit?.id ?? null;
  if (!providerVisitId) {
    const created = await executeGraphQL<
      CreateProviderVisitMutation,
      CreateProviderVisitMutationVariables
    >(CREATE_PROVIDER_VISIT, { input: { ProviderVisit: { VisitId: current.id } } });
    providerVisitId = created.uiapi.ProviderVisitCreate?.Record?.Id ?? null;
    if (!providerVisitId) throw new Error('Provider visit was not created');
  }

  const byProduct = new Map(existing.map((row) => [row.productId, row]));
  for (const row of existing) {
    if (!row.productId || !brandIds.includes(row.productId)) {
      await executeGraphQL<unknown, DeleteProviderVisitProdDetailingMutationVariables>(
        DELETE_PVPD,
        { input: { Id: row.id } }
      );
    }
  }
  for (const [index, brandId] of brandIds.entries()) {
    const row = byProduct.get(brandId);
    if (!row) {
      await executeGraphQL<unknown, CreateProviderVisitProdDetailingMutationVariables>(
        CREATE_PVPD,
        {
          input: {
            ProviderVisitProdDetailing: {
              ProviderVisitId: providerVisitId,
              ProductId: brandId,
              Priority: index + 1,
            },
          },
        }
      );
    } else if (row.order !== index + 1) {
      await executeGraphQL<unknown, UpdateProviderVisitProdDetailingMutationVariables>(
        UPDATE_PVPD,
        { input: { Id: row.id, ProviderVisitProdDetailing: { Priority: index + 1 } } }
      );
    }
  }
}

/** The org cascades to the visit's ProviderVisit and detailings. */
export async function deleteVisit(id: string): Promise<void> {
  await executeGraphQL<unknown, DeleteVisitMutationVariables>(DELETE_VISIT, {
    input: { Id: id },
  });
}

/* --------------------------------- Inquiries --------------------------------- */

export interface InquiryRow {
  id: string;
  name: string;
  account: string | null;
  type: string | null;
  priority: string | null;
  status: string | null;
  channel: string | null;
  submitted: string | null;
  territory: string | null;
}

export interface InquiryPage {
  rows: InquiryRow[];
  endCursor: string | null;
  hasNextPage: boolean;
}

export async function fetchInquiriesPage(after?: string | null): Promise<InquiryPage> {
  const data = await executeGraphQL<GetInquiriesQuery, GetInquiriesQueryVariables>(
    GET_INQUIRIES,
    { after: after ?? undefined }
  );
  const connection = data.uiapi.query.Inquiry;
  return {
    rows: nodes(connection).map((node) => ({
      id: node.Id,
      name: raw(node.Name) ?? node.Id,
      account: raw(node.Account?.Name),
      type: label(node.Type),
      priority: label(node.Priority),
      status: label(node.Status),
      channel: label(node.InquiryChannelType),
      submitted: raw(node.SubmittedDateTime) ?? raw(node.CreatedDate),
      territory: raw(node.TerritoryName),
    })),
    endCursor: connection?.pageInfo.endCursor ?? null,
    hasNextPage: connection?.pageInfo.hasNextPage ?? false,
  };
}

export interface InquiryRecordTypes {
  caseId: string | null;
  inquiryId: string | null;
}

/**
 * Case and Inquiry record types must share a Name (the org guide recommends
 * "Medical Inquiry"); otherwise the Case silently fails to link. Prefer a name
 * containing "inquiry" that exists on both objects.
 */
export async function fetchInquiryRecordTypes(): Promise<InquiryRecordTypes> {
  const data = await executeGraphQL<GetInquiryRecordTypesQuery, undefined>(
    GET_INQUIRY_RECORD_TYPES
  );
  const byObject: Record<string, Map<string, string>> = { Case: new Map(), Inquiry: new Map() };
  for (const node of nodes(data.uiapi.query.RecordType)) {
    const object = raw(node.SobjectType);
    const name = raw(node.Name);
    if (object && name && byObject[object]) byObject[object].set(name, node.Id);
  }
  const shared = [...byObject.Case.keys()].filter((name) => byObject.Inquiry.has(name));
  const pick = shared.find((name) => /inquiry/i.test(name)) ?? shared[0];
  return {
    caseId: pick ? (byObject.Case.get(pick) ?? null) : null,
    inquiryId: pick ? (byObject.Inquiry.get(pick) ?? null) : null,
  };
}

export interface NewInquiryInput {
  accountId: string;
  recordTypes: InquiryRecordTypes;
  type: string;
  urgent: boolean;
  channel: string;
  question: string;
  comment: string;
  territoryId: string | null;
  territoryName: string | null;
  contactPointId: string | null;
}

/** Case (Draft) -> Inquiry -> InquiryQuestion, as in DemoInquiryController. */
export async function createInquiry(input: NewInquiryInput): Promise<string> {
  const created = await executeGraphQL<CreateCaseMutation, CreateCaseMutationVariables>(
    CREATE_CASE,
    {
      input: {
        Case: {
          AccountId: input.accountId,
          RecordTypeId: input.recordTypes.caseId ?? undefined,
          Status: 'Draft',
          Origin: 'Phone',
          Priority: input.urgent ? 'High' : 'Medium',
        },
      },
    }
  );
  const caseId = created.uiapi.CaseCreate?.Record?.Id;
  if (!caseId) throw new Error('Case was not created');

  try {
    const inquiry = await executeGraphQL<CreateInquiryMutation, CreateInquiryMutationVariables>(
      CREATE_INQUIRY,
      {
        input: {
          Inquiry: {
            CaseId: caseId,
            RecordTypeId: input.recordTypes.inquiryId ?? undefined,
            Type: input.type,
            Priority: input.urgent ? 'Yes' : 'No',
            InquiryChannelType: input.channel,
            Comment: input.comment.trim() || undefined,
            SubmittedDateTime: new Date().toISOString(),
            Territory2Id: input.territoryId ?? undefined,
            TerritoryName: input.territoryName ?? undefined,
            ResponseContactPointRecId: input.contactPointId ?? undefined,
          },
        },
      }
    );
    const inquiryId = inquiry.uiapi.InquiryCreate?.Record?.Id;
    if (!inquiryId) throw new Error('Inquiry was not created');

    await executeGraphQL<unknown, CreateInquiryQuestionMutationVariables>(
      CREATE_INQUIRY_QUESTION,
      {
        input: {
          InquiryQuestion: {
            CaseId: caseId,
            InquiryId: inquiryId,
            Question: input.question.trim(),
            ResponseStatus: 'Not Responded',
          },
        },
      }
    );
    return inquiryId;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Case ${caseId} was created but a follow-up step failed: ${reason}`);
  }
}

/* ------------------------------ Provider summary ----------------------------- */

export interface SummarySection {
  name: string;
  items: string[];
}

export interface ProviderSummary {
  territory: string | null;
  generated: string | null;
  keyInfo: SummarySection[];
  changeInfo: SummarySection[];
}

/** Parses the generated {"keyInfo":[{sectionName,sectionData:[{data}]}]} payload; tolerates plain text. */
function parseSummarySections(text: string | null, group: 'keyInfo' | 'changeInfo'): SummarySection[] {
  if (!text) return [];
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const sections = (parsed[group] ?? (group === 'keyInfo' ? parsed : [])) as unknown;
    if (!Array.isArray(sections)) return [];
    return sections.flatMap((section: { sectionName?: string; sectionData?: { data?: string }[] }) => {
      const items = (section.sectionData ?? []).flatMap((d) => (d.data ? [d.data] : []));
      return items.length > 0 ? [{ name: section.sectionName ?? '', items }] : [];
    });
  } catch {
    return [{ name: '', items: [text] }];
  }
}

/**
 * The summary is generated per rep and territory, so prefer the signed-in
 * user's own record and fall back to the most recently generated one.
 */
export async function fetchProviderSummary(accountId: string): Promise<ProviderSummary | null> {
  const data = await executeGraphQL<GetProviderSummaryQuery, GetProviderSummaryQueryVariables>(
    GET_PROVIDER_SUMMARY,
    { accountId }
  );
  const rows = nodes(data.uiapi.query.PrvdAccountTerritorySummary);
  const me = data.uiapi.currentUser?.Id;
  const row = rows.find((r) => me && raw(r.UserId) === me) ?? rows[0];
  if (!row) return null;
  const keyInfo = parseSummarySections(raw(row.KeyInformationSummary), 'keyInfo');
  const changeInfo = parseSummarySections(raw(row.ChangeInformationSummary), 'changeInfo');
  if (keyInfo.length === 0 && changeInfo.length === 0) return null;
  return {
    territory: raw(row.Territory2?.Name),
    generated: raw(row.KeyInfoSummaryDateTime) ?? raw(row.ChangeInfoSummaryDateTime),
    keyInfo,
    changeInfo,
  };
}

/* ------------------------- Account related lists ------------------------- */

export interface AffiliationRow {
  id: string;
  accountId: string | null;
  account: string | null;
  type: string | null;
  role: string | null;
  influence: string | null;
  strength: string | null;
  primary: boolean;
  active: boolean;
  start: string | null;
  end: string | null;
}

export async function fetchAccountAffiliations(accountId: string): Promise<AffiliationRow[]> {
  const data = await executeGraphQL<GetAccountAffiliationsQuery, GetAccountAffiliationsQueryVariables>(
    GET_ACCOUNT_AFFILIATIONS,
    { accountId }
  );
  return nodes(data.uiapi.query.ProviderAffiliation).map((node) => ({
    id: node.Id,
    accountId: raw(node.RelatedAccountId),
    account: raw(node.RelatedAccount?.Name),
    type: label(node.AffiliationType),
    role: label(node.Role),
    influence: label(node.InfluenceType),
    strength: label(node.AffiliationStrengthType),
    primary: raw(node.IsPrimary) ?? false,
    active: raw(node.IsActive) ?? false,
    start: raw(node.EffectiveStartDate),
    end: raw(node.EffectiveEndDate),
  }));
}

export async function fetchAccountInquiries(accountId: string): Promise<InquiryRow[]> {
  const data = await executeGraphQL<GetAccountInquiriesQuery, GetAccountInquiriesQueryVariables>(
    GET_ACCOUNT_INQUIRIES,
    { accountId }
  );
  return nodes(data.uiapi.query.Inquiry).map((node) => ({
    id: node.Id,
    name: raw(node.Name) ?? node.Id,
    account: raw(node.Account?.Name),
    type: label(node.Type),
    priority: label(node.Priority),
    status: label(node.Status),
    channel: label(node.InquiryChannelType),
    submitted: raw(node.SubmittedDateTime) ?? raw(node.CreatedDate),
    territory: raw(node.TerritoryName),
  }));
}

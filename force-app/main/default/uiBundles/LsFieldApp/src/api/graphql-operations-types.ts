export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Base64: { input: string; output: string; }
  Currency: { input: number | string; output: number; }
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
  Double: { input: number | string; output: number; }
  Email: { input: string; output: string; }
  EncryptedString: { input: string; output: string; }
  /** Can be set to an ID or a Reference to the result of another mutation operation. */
  IdOrRef: { input: string; output: string; }
  JSON: { input: string; output: string; }
  Latitude: { input: number | string; output: number; }
  /** A 64-bit signed integer */
  Long: { input: number; output: number; }
  LongTextArea: { input: string; output: string; }
  Longitude: { input: number | string; output: number; }
  MultiPicklist: { input: string; output: string; }
  Percent: { input: number | string; output: number; }
  PhoneNumber: { input: string; output: string; }
  Picklist: { input: string; output: string; }
  RichTextArea: { input: string; output: string; }
  TextArea: { input: string; output: string; }
  Time: { input: string; output: string; }
  Url: { input: string; output: string; }
};

export enum DataType {
  Address = 'ADDRESS',
  Anytype = 'ANYTYPE',
  Base64 = 'BASE64',
  Boolean = 'BOOLEAN',
  Combobox = 'COMBOBOX',
  Complexvalue = 'COMPLEXVALUE',
  Currency = 'CURRENCY',
  Date = 'DATE',
  Datetime = 'DATETIME',
  Double = 'DOUBLE',
  Email = 'EMAIL',
  Encryptedstring = 'ENCRYPTEDSTRING',
  Int = 'INT',
  Json = 'JSON',
  Junctionidlist = 'JUNCTIONIDLIST',
  Location = 'LOCATION',
  Long = 'LONG',
  Multipicklist = 'MULTIPICKLIST',
  Percent = 'PERCENT',
  Phone = 'PHONE',
  Picklist = 'PICKLIST',
  Reference = 'REFERENCE',
  String = 'STRING',
  Textarea = 'TEXTAREA',
  Time = 'TIME',
  Url = 'URL'
}

export enum DateLiteral {
  Last_90Days = 'LAST_90_DAYS',
  LastFiscalQuarter = 'LAST_FISCAL_QUARTER',
  LastFiscalYear = 'LAST_FISCAL_YEAR',
  LastMonth = 'LAST_MONTH',
  LastQuarter = 'LAST_QUARTER',
  LastWeek = 'LAST_WEEK',
  LastYear = 'LAST_YEAR',
  Next_90Days = 'NEXT_90_DAYS',
  NextFiscalQuarter = 'NEXT_FISCAL_QUARTER',
  NextFiscalYear = 'NEXT_FISCAL_YEAR',
  NextMonth = 'NEXT_MONTH',
  NextQuarter = 'NEXT_QUARTER',
  NextWeek = 'NEXT_WEEK',
  NextYear = 'NEXT_YEAR',
  ThisFiscalQuarter = 'THIS_FISCAL_QUARTER',
  ThisFiscalYear = 'THIS_FISCAL_YEAR',
  ThisMonth = 'THIS_MONTH',
  ThisQuarter = 'THIS_QUARTER',
  ThisWeek = 'THIS_WEEK',
  ThisYear = 'THIS_YEAR',
  Today = 'TODAY',
  Tomorrow = 'TOMORROW',
  Yesterday = 'YESTERDAY'
}

export type DateRange = {
  last_n_days?: InputMaybe<Scalars['Int']['input']>;
  last_n_fiscal_quarters?: InputMaybe<Scalars['Int']['input']>;
  last_n_fiscal_years?: InputMaybe<Scalars['Int']['input']>;
  last_n_months?: InputMaybe<Scalars['Int']['input']>;
  last_n_quarters?: InputMaybe<Scalars['Int']['input']>;
  last_n_weeks?: InputMaybe<Scalars['Int']['input']>;
  last_n_years?: InputMaybe<Scalars['Int']['input']>;
  n_days_ago?: InputMaybe<Scalars['Int']['input']>;
  n_fiscal_quarters_ago?: InputMaybe<Scalars['Int']['input']>;
  n_fiscal_years_ago?: InputMaybe<Scalars['Int']['input']>;
  n_months_ago?: InputMaybe<Scalars['Int']['input']>;
  n_quarters_ago?: InputMaybe<Scalars['Int']['input']>;
  n_weeks_ago?: InputMaybe<Scalars['Int']['input']>;
  n_years_ago?: InputMaybe<Scalars['Int']['input']>;
  next_n_days?: InputMaybe<Scalars['Int']['input']>;
  next_n_fiscal_quarters?: InputMaybe<Scalars['Int']['input']>;
  next_n_fiscal_years?: InputMaybe<Scalars['Int']['input']>;
  next_n_months?: InputMaybe<Scalars['Int']['input']>;
  next_n_quarters?: InputMaybe<Scalars['Int']['input']>;
  next_n_weeks?: InputMaybe<Scalars['Int']['input']>;
  next_n_years?: InputMaybe<Scalars['Int']['input']>;
};

export type DateTimeInput = {
  literal?: InputMaybe<DateLiteral>;
  range?: InputMaybe<DateRange>;
  value?: InputMaybe<Scalars['DateTime']['input']>;
};

export enum FieldExtraTypeInfo {
  ExternalLookup = 'EXTERNAL_LOOKUP',
  ImageUrl = 'IMAGE_URL',
  IndirectLookup = 'INDIRECT_LOOKUP',
  Personname = 'PERSONNAME',
  Plaintextarea = 'PLAINTEXTAREA',
  Richtextarea = 'RICHTEXTAREA',
  SwitchablePersonname = 'SWITCHABLE_PERSONNAME'
}

export enum LayoutComponentType {
  Canvas = 'CANVAS',
  CustomLink = 'CUSTOM_LINK',
  EmptySpace = 'EMPTY_SPACE',
  Field = 'FIELD',
  ReportChart = 'REPORT_CHART',
  VisualforcePage = 'VISUALFORCE_PAGE'
}

export enum LayoutMode {
  Create = 'CREATE',
  Edit = 'EDIT',
  View = 'VIEW'
}

export enum LayoutType {
  Compact = 'COMPACT',
  Full = 'FULL'
}

export enum ResultOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum TabOrder {
  LeftRight = 'LEFT_RIGHT',
  TopDown = 'TOP_DOWN'
}

export enum UiBehavior {
  Edit = 'EDIT',
  Readonly = 'READONLY',
  Required = 'REQUIRED'
}

export type GetDisbursementsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDisbursementsQuery = { uiapi: { query: { ProductDisbursement?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null, displayValue?: string | null } | null, ProductName?: { value?: string | null, displayValue?: string | null } | null, QuantityDisbursed?: { value?: number | null, displayValue?: string | null } | null, QuantityRequested?: { value?: number | null, displayValue?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, DisbursementDate?: { value?: string | null, displayValue?: string | null } | null, IsSignatureCaptured?: { value?: boolean | null, displayValue?: string | null } | null, Comments?: { value?: string | null, displayValue?: string | null } | null, DisbursementToAccount?: { Name?: { value?: string | null, displayValue?: string | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetSamplesByProductQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSamplesByProductQuery = { uiapi: { aggregate: { ProductDisbursement?: { edges?: Array<{ node?: { aggregate?: { ProductName?: { value?: string | null } | null, units?: { sum?: { value?: number | null } | null } | null, total?: { count?: { value?: number | null } | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetUpcomingVisitsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<DateTimeInput>;
}>;


export type GetUpcomingVisitsQuery = { uiapi: { query: { Visit?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null, displayValue?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, Channel?: { value?: string | null, displayValue?: string | null } | null, VisitPriority?: { value?: string | null, displayValue?: string | null } | null, PlannedVisitStartTime?: { value?: string | null, displayValue?: string | null } | null, LS_Territory_Name__c?: { value?: string | null, displayValue?: string | null } | null, Account?: { Name?: { value?: string | null, displayValue?: string | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetVisitChannelCountsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetVisitChannelCountsQuery = { uiapi: { aggregate: { Visit?: { edges?: Array<{ node?: { aggregate?: { Channel?: { value?: string | null } | null, total?: { count?: { value?: number | null } | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetVisitStatusCountsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetVisitStatusCountsQuery = { uiapi: { aggregate: { Visit?: { edges?: Array<{ node?: { aggregate?: { Status?: { value?: string | null } | null, total?: { count?: { value?: number | null } | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetVisitsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Picklist']['input']>;
  channel?: InputMaybe<Scalars['Picklist']['input']>;
}>;


export type GetVisitsQuery = { uiapi: { query: { Visit?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null, displayValue?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, Channel?: { value?: string | null, displayValue?: string | null } | null, Call_type__c?: { value?: string | null, displayValue?: string | null } | null, VisitPriority?: { value?: string | null, displayValue?: string | null } | null, PlannedVisitStartTime?: { value?: string | null, displayValue?: string | null } | null, ActualVisitStartTime?: { value?: string | null, displayValue?: string | null } | null, LS_Territory_Name__c?: { value?: string | null, displayValue?: string | null } | null, StatusRemarks?: { value?: string | null, displayValue?: string | null } | null, Account?: { Name?: { value?: string | null, displayValue?: string | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

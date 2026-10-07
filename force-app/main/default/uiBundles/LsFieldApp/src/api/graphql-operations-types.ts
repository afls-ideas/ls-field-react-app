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

export type CaseCreateInput = {
  Case: CaseCreateRepresentation;
};

export type CaseCreateRepresentation = {
  AccountId?: InputMaybe<Scalars['IdOrRef']['input']>;
  AssetId?: InputMaybe<Scalars['IdOrRef']['input']>;
  AssetWarrantyId?: InputMaybe<Scalars['IdOrRef']['input']>;
  BusinessHoursId?: InputMaybe<Scalars['IdOrRef']['input']>;
  CSAT__c?: InputMaybe<Scalars['Double']['input']>;
  Case_Assignment_Timestamp__c?: InputMaybe<Scalars['DateTime']['input']>;
  Case_Feedback__c?: InputMaybe<Scalars['LongTextArea']['input']>;
  ClosedDate?: InputMaybe<Scalars['DateTime']['input']>;
  ClosedDate__c?: InputMaybe<Scalars['DateTime']['input']>;
  Comments?: InputMaybe<Scalars['LongTextArea']['input']>;
  ContactId?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedDate?: InputMaybe<Scalars['DateTime']['input']>;
  CreatedDate__c?: InputMaybe<Scalars['DateTime']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  DB_Case_Duration_Hours__c?: InputMaybe<Scalars['Double']['input']>;
  DB_Hours__c?: InputMaybe<Scalars['Double']['input']>;
  DateTime_Closed_c__c?: InputMaybe<Scalars['DateTime']['input']>;
  DateTime_Opened_c__c?: InputMaybe<Scalars['DateTime']['input']>;
  Description?: InputMaybe<Scalars['LongTextArea']['input']>;
  EDY_ORGCUSTOM__DB__c?: InputMaybe<Scalars['Boolean']['input']>;
  EDY_ORGCUSTOM__Old_Description__c?: InputMaybe<Scalars['LongTextArea']['input']>;
  EDY_ORGCUSTOM__Old_Subject__c?: InputMaybe<Scalars['String']['input']>;
  EntitlementId?: InputMaybe<Scalars['IdOrRef']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  FeedItemId?: InputMaybe<Scalars['IdOrRef']['input']>;
  First_Contact_Close__c?: InputMaybe<Scalars['Boolean']['input']>;
  IsEscalated?: InputMaybe<Scalars['Boolean']['input']>;
  IsSelfServiceClosed?: InputMaybe<Scalars['Boolean']['input']>;
  IsStopped?: InputMaybe<Scalars['Boolean']['input']>;
  IsVisibleInSelfService?: InputMaybe<Scalars['Boolean']['input']>;
  LSDO_Case_Category__c?: InputMaybe<Scalars['Picklist']['input']>;
  LSDO_Inquiry__c?: InputMaybe<Scalars['IdOrRef']['input']>;
  Language?: InputMaybe<Scalars['Picklist']['input']>;
  LastModifiedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  LastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  MilestoneStatus__c?: InputMaybe<Scalars['String']['input']>;
  Offer_Voucher__c?: InputMaybe<Scalars['Boolean']['input']>;
  Opportunity__c?: InputMaybe<Scalars['IdOrRef']['input']>;
  Origin?: InputMaybe<Scalars['Picklist']['input']>;
  OwnerId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ParentId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Priority?: InputMaybe<Scalars['Picklist']['input']>;
  ProductId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Product_Family_KB__c?: InputMaybe<Scalars['Picklist']['input']>;
  Reason?: InputMaybe<Scalars['Picklist']['input']>;
  RecordTypeId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SDO_Article_Helpful_Reason__c?: InputMaybe<Scalars['LongTextArea']['input']>;
  SDO_Article_Helpful__c?: InputMaybe<Scalars['Picklist']['input']>;
  SDO_Einstein_Discovery_Leading_Causes__c?: InputMaybe<Scalars['RichTextArea']['input']>;
  SDO_Einstein_Discovery_Outcome__c?: InputMaybe<Scalars['Double']['input']>;
  SDO_Einstein_Discovery_Prescription__c?: InputMaybe<Scalars['RichTextArea']['input']>;
  SDO_OMS_Order_Summary__c?: InputMaybe<Scalars['IdOrRef']['input']>;
  SDO_Quality_Score__c?: InputMaybe<Scalars['Double']['input']>;
  SDO_SFS_City__c?: InputMaybe<Scalars['String']['input']>;
  SDO_SFS_Country__c?: InputMaybe<Scalars['String']['input']>;
  SDO_SFS_State__c?: InputMaybe<Scalars['String']['input']>;
  SDO_SFS_Street__c?: InputMaybe<Scalars['String']['input']>;
  SDO_SFS_Work_Type__c?: InputMaybe<Scalars['IdOrRef']['input']>;
  SDO_SFS_Zip__c?: InputMaybe<Scalars['String']['input']>;
  SDO_Servcie_Response_Time_mins__c?: InputMaybe<Scalars['Double']['input']>;
  SDO_Service_Article_Created__c?: InputMaybe<Scalars['Boolean']['input']>;
  SDO_Service_ChatKey__c?: InputMaybe<Scalars['String']['input']>;
  SDO_Service_Close_Summary__c?: InputMaybe<Scalars['LongTextArea']['input']>;
  SDO_Service_Contact_Reason__c?: InputMaybe<Scalars['LongTextArea']['input']>;
  SDO_Service_Customer_Type__c?: InputMaybe<Scalars['Picklist']['input']>;
  SDO_Service_Est_Cost__c?: InputMaybe<Scalars['Double']['input']>;
  SDO_Service_NBA_to_Display__c?: InputMaybe<Scalars['String']['input']>;
  SDO_Service_Resolution__c?: InputMaybe<Scalars['LongTextArea']['input']>;
  SDO_Service_SLA_Compliant__c?: InputMaybe<Scalars['Boolean']['input']>;
  SDO_Service_SLA_Type__c?: InputMaybe<Scalars['Picklist']['input']>;
  SDO_Service_Send_Email_Trigger__c?: InputMaybe<Scalars['Boolean']['input']>;
  SDO_Service_Surveys_CSAT_Score__c?: InputMaybe<Scalars['Double']['input']>;
  SDO_Service_Surveys_Comment__c?: InputMaybe<Scalars['TextArea']['input']>;
  SDO_Service_Surveys_NPS_Score__c?: InputMaybe<Scalars['Double']['input']>;
  SDO_Service_Surveys_NPS__c?: InputMaybe<Scalars['String']['input']>;
  SDO_Service_Territory__c?: InputMaybe<Scalars['IdOrRef']['input']>;
  SDO_Sub_Type__c?: InputMaybe<Scalars['Picklist']['input']>;
  SDO_Survey_CSAT__c?: InputMaybe<Scalars['String']['input']>;
  SDO_Volume__c?: InputMaybe<Scalars['Double']['input']>;
  Send_FieldService__c?: InputMaybe<Scalars['Boolean']['input']>;
  ServiceContractId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SlaStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  SourceId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Status?: InputMaybe<Scalars['Picklist']['input']>;
  Subject?: InputMaybe<Scalars['String']['input']>;
  SuppliedCompany?: InputMaybe<Scalars['String']['input']>;
  SuppliedEmail?: InputMaybe<Scalars['Email']['input']>;
  SuppliedName?: InputMaybe<Scalars['String']['input']>;
  SuppliedPhone?: InputMaybe<Scalars['String']['input']>;
  Time_Open__c?: InputMaybe<Scalars['Double']['input']>;
  Type?: InputMaybe<Scalars['Picklist']['input']>;
  Type_of_Support__c?: InputMaybe<Scalars['Picklist']['input']>;
  db_hours_DateTime_Closed_c__c?: InputMaybe<Scalars['Double']['input']>;
  db_hours_DateTime_Opened_c__c?: InputMaybe<Scalars['Double']['input']>;
  demoRecommendations__c?: InputMaybe<Scalars['LongTextArea']['input']>;
  inov8__PMT_Project__c?: InputMaybe<Scalars['IdOrRef']['input']>;
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

export type InquiryCreateInput = {
  Inquiry: InquiryCreateRepresentation;
};

export type InquiryCreateRepresentation = {
  Account__c?: InputMaybe<Scalars['IdOrRef']['input']>;
  AdditionalInformation?: InputMaybe<Scalars['LongTextArea']['input']>;
  CaseId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Comment?: InputMaybe<Scalars['LongTextArea']['input']>;
  CreatedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedDate?: InputMaybe<Scalars['DateTime']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  DisclaimerText?: InputMaybe<Scalars['LongTextArea']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  InquiryChannelType?: InputMaybe<Scalars['Picklist']['input']>;
  IsSignatureCopyRequested?: InputMaybe<Scalars['Boolean']['input']>;
  LastModifiedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  LastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  Priority?: InputMaybe<Scalars['Picklist']['input']>;
  RecordTypeId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ReferenceRecordId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ResponseContactPointRecId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SourceSystemIdentifier?: InputMaybe<Scalars['String']['input']>;
  SourceSystemName?: InputMaybe<Scalars['String']['input']>;
  SubmittedDateTime?: InputMaybe<Scalars['DateTime']['input']>;
  Territory2Id?: InputMaybe<Scalars['IdOrRef']['input']>;
  TerritoryName?: InputMaybe<Scalars['String']['input']>;
  Type?: InputMaybe<Scalars['Picklist']['input']>;
};

export type InquiryQuestionCreateInput = {
  InquiryQuestion: InquiryQuestionCreateRepresentation;
};

export type InquiryQuestionCreateRepresentation = {
  CaseId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Comment?: InputMaybe<Scalars['LongTextArea']['input']>;
  CreatedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedDate?: InputMaybe<Scalars['DateTime']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  InquiryId?: InputMaybe<Scalars['IdOrRef']['input']>;
  LastModifiedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  LastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  OwnerId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ProductReferenceRecordId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Question?: InputMaybe<Scalars['LongTextArea']['input']>;
  ResponseStatus?: InputMaybe<Scalars['Picklist']['input']>;
  SourceSystemIdentifier?: InputMaybe<Scalars['String']['input']>;
  SourceSystemName?: InputMaybe<Scalars['String']['input']>;
};

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

export type ProviderVisitCreateInput = {
  ProviderVisit: ProviderVisitCreateRepresentation;
};

export type ProviderVisitCreateRepresentation = {
  AdditionalInformation?: InputMaybe<Scalars['LongTextArea']['input']>;
  BookingStatus?: InputMaybe<Scalars['Picklist']['input']>;
  BookingStatusReason?: InputMaybe<Scalars['Picklist']['input']>;
  ComplianceStatements?: InputMaybe<Scalars['LongTextArea']['input']>;
  CreatedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedDate?: InputMaybe<Scalars['DateTime']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  GeoLocOnSubmitLatitude?: InputMaybe<Scalars['Latitude']['input']>;
  GeoLocOnSubmitLongitude?: InputMaybe<Scalars['Longitude']['input']>;
  HasAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  InvitationEmailAddress?: InputMaybe<Scalars['Email']['input']>;
  InvitationEmailBouncedRsn?: InputMaybe<Scalars['String']['input']>;
  InvitationEmailStatus?: InputMaybe<Scalars['Picklist']['input']>;
  IsAdhocProviderVisit?: InputMaybe<Scalars['Boolean']['input']>;
  IsBackdatedSbmtVldSkipped?: InputMaybe<Scalars['Boolean']['input']>;
  IsBackdatedSgnVldSkipped?: InputMaybe<Scalars['Boolean']['input']>;
  IsConfirmed?: InputMaybe<Scalars['Boolean']['input']>;
  IsOfflineModeSignature?: InputMaybe<Scalars['Boolean']['input']>;
  IsOfflineModeSubmit?: InputMaybe<Scalars['Boolean']['input']>;
  IsSignedAwayFrmAllowDstn?: InputMaybe<Scalars['Boolean']['input']>;
  IsSubmitAwayFrmAllowDstn?: InputMaybe<Scalars['Boolean']['input']>;
  LastModifiedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  LastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  LifeScienceAccountListId?: InputMaybe<Scalars['IdOrRef']['input']>;
  NextProviderVisitObjective?: InputMaybe<Scalars['LongTextArea']['input']>;
  NextPrvdVisitObjectiveType?: InputMaybe<Scalars['MultiPicklist']['input']>;
  OwnerId?: InputMaybe<Scalars['IdOrRef']['input']>;
  PhysicalFormIdentifier?: InputMaybe<Scalars['String']['input']>;
  PreProviderVisitNotes?: InputMaybe<Scalars['LongTextArea']['input']>;
  RecordTypeId?: InputMaybe<Scalars['IdOrRef']['input']>;
  RemoteAttendanceStatus?: InputMaybe<Scalars['Picklist']['input']>;
  RemoteChannelServiceProvider?: InputMaybe<Scalars['Picklist']['input']>;
  RemoteSessionStatus?: InputMaybe<Scalars['Picklist']['input']>;
  RemoteSessionStatusReason?: InputMaybe<Scalars['Picklist']['input']>;
  ShippingAddressId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SourceSystemIdentifier?: InputMaybe<Scalars['String']['input']>;
  SourceSystemName?: InputMaybe<Scalars['String']['input']>;
  SubmitDelayReason?: InputMaybe<Scalars['String']['input']>;
  SubmitDelayReasonType?: InputMaybe<Scalars['Picklist']['input']>;
  SubmitGeolcMissingReason?: InputMaybe<Scalars['Picklist']['input']>;
  SubmitGeolocationTimestamp?: InputMaybe<Scalars['DateTime']['input']>;
  TerritoryName?: InputMaybe<Scalars['String']['input']>;
  VisitId?: InputMaybe<Scalars['IdOrRef']['input']>;
  VisitSubmitDateTime?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ProviderVisitProdDetailingCreateInput = {
  ProviderVisitProdDetailing: ProviderVisitProdDetailingCreateRepresentation;
};

export type ProviderVisitProdDetailingCreateRepresentation = {
  AdditionalInformation?: InputMaybe<Scalars['LongTextArea']['input']>;
  BrandId?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedDate?: InputMaybe<Scalars['DateTime']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  IsGeneratedFromPresentation?: InputMaybe<Scalars['Boolean']['input']>;
  IsOffLabel?: InputMaybe<Scalars['Boolean']['input']>;
  IsSignatureCaptured?: InputMaybe<Scalars['Boolean']['input']>;
  LastModifiedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  LastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  NextPrvdVisitObjectives?: InputMaybe<Scalars['LongTextArea']['input']>;
  OwnerId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Priority?: InputMaybe<Scalars['Double']['input']>;
  ProductHierarchyName?: InputMaybe<Scalars['String']['input']>;
  ProductId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ProductIndicationId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ProductTherapeuticAreaId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ProviderVisitId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SourceSystemIdentifier?: InputMaybe<Scalars['String']['input']>;
  SourceSystemName?: InputMaybe<Scalars['String']['input']>;
};

export type ProviderVisitProdDetailingUpdateInput = {
  Id: Scalars['IdOrRef']['input'];
  ProviderVisitProdDetailing: ProviderVisitProdDetailingUpdateRepresentation;
};

export type ProviderVisitProdDetailingUpdateRepresentation = {
  AdditionalInformation?: InputMaybe<Scalars['LongTextArea']['input']>;
  BrandId?: InputMaybe<Scalars['IdOrRef']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  IsGeneratedFromPresentation?: InputMaybe<Scalars['Boolean']['input']>;
  IsOffLabel?: InputMaybe<Scalars['Boolean']['input']>;
  IsSignatureCaptured?: InputMaybe<Scalars['Boolean']['input']>;
  NextPrvdVisitObjectives?: InputMaybe<Scalars['LongTextArea']['input']>;
  OwnerId?: InputMaybe<Scalars['IdOrRef']['input']>;
  Priority?: InputMaybe<Scalars['Double']['input']>;
  ProductHierarchyName?: InputMaybe<Scalars['String']['input']>;
  ProductId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ProductIndicationId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ProductTherapeuticAreaId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SourceSystemIdentifier?: InputMaybe<Scalars['String']['input']>;
  SourceSystemName?: InputMaybe<Scalars['String']['input']>;
};

/** Input to the mutation to delete a Record */
export type RecordDeleteInput = {
  /** The ID of the Record to delete */
  Id: Scalars['IdOrRef']['input'];
};

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

export type VisitCreateInput = {
  Visit: VisitCreateRepresentation;
};

export type VisitCreateRepresentation = {
  AccountId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ActualVisitEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  ActualVisitStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  Call_type__c?: InputMaybe<Scalars['Picklist']['input']>;
  Channel?: InputMaybe<Scalars['Picklist']['input']>;
  ContextId?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  CreatedDate?: InputMaybe<Scalars['DateTime']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  InstructionDescription?: InputMaybe<Scalars['LongTextArea']['input']>;
  LastModifiedById?: InputMaybe<Scalars['IdOrRef']['input']>;
  LastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  OwnerId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ParentOrganizationId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ParentVisitId?: InputMaybe<Scalars['IdOrRef']['input']>;
  PlaceId?: InputMaybe<Scalars['IdOrRef']['input']>;
  PlannedVisitEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  PlannedVisitStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  RecordTypeId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SignatureType?: InputMaybe<Scalars['Picklist']['input']>;
  Status?: InputMaybe<Scalars['Picklist']['input']>;
  StatusRemarks?: InputMaybe<Scalars['LongTextArea']['input']>;
  TerritoryId?: InputMaybe<Scalars['IdOrRef']['input']>;
  VisitPriority?: InputMaybe<Scalars['Picklist']['input']>;
  VisitTypeId?: InputMaybe<Scalars['IdOrRef']['input']>;
  VisitorId?: InputMaybe<Scalars['IdOrRef']['input']>;
};

export type VisitUpdateInput = {
  Id: Scalars['IdOrRef']['input'];
  Visit: VisitUpdateRepresentation;
};

export type VisitUpdateRepresentation = {
  AccountId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ActualVisitEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  ActualVisitStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  Call_type__c?: InputMaybe<Scalars['Picklist']['input']>;
  Channel?: InputMaybe<Scalars['Picklist']['input']>;
  ContextId?: InputMaybe<Scalars['IdOrRef']['input']>;
  CurrencyIsoCode?: InputMaybe<Scalars['Picklist']['input']>;
  External_ID__c?: InputMaybe<Scalars['String']['input']>;
  InstructionDescription?: InputMaybe<Scalars['LongTextArea']['input']>;
  OwnerId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ParentOrganizationId?: InputMaybe<Scalars['IdOrRef']['input']>;
  ParentVisitId?: InputMaybe<Scalars['IdOrRef']['input']>;
  PlaceId?: InputMaybe<Scalars['IdOrRef']['input']>;
  PlannedVisitEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  PlannedVisitStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  RecordTypeId?: InputMaybe<Scalars['IdOrRef']['input']>;
  SignatureType?: InputMaybe<Scalars['Picklist']['input']>;
  Status?: InputMaybe<Scalars['Picklist']['input']>;
  StatusRemarks?: InputMaybe<Scalars['LongTextArea']['input']>;
  TerritoryId?: InputMaybe<Scalars['IdOrRef']['input']>;
  VisitPriority?: InputMaybe<Scalars['Picklist']['input']>;
  VisitTypeId?: InputMaybe<Scalars['IdOrRef']['input']>;
  VisitorId?: InputMaybe<Scalars['IdOrRef']['input']>;
};

export type CreateCaseMutationVariables = Exact<{
  input: CaseCreateInput;
}>;


export type CreateCaseMutation = { uiapi: { CaseCreate?: { Record?: { Id: string } | null } | null } };

export type CreateInquiryMutationVariables = Exact<{
  input: InquiryCreateInput;
}>;


export type CreateInquiryMutation = { uiapi: { InquiryCreate?: { Record?: { Id: string } | null } | null } };

export type CreateInquiryQuestionMutationVariables = Exact<{
  input: InquiryQuestionCreateInput;
}>;


export type CreateInquiryQuestionMutation = { uiapi: { InquiryQuestionCreate?: { Record?: { Id: string } | null } | null } };

export type CreateProviderVisitMutationVariables = Exact<{
  input: ProviderVisitCreateInput;
}>;


export type CreateProviderVisitMutation = { uiapi: { ProviderVisitCreate?: { Record?: { Id: string } | null } | null } };

export type CreateProviderVisitProdDetailingMutationVariables = Exact<{
  input: ProviderVisitProdDetailingCreateInput;
}>;


export type CreateProviderVisitProdDetailingMutation = { uiapi: { ProviderVisitProdDetailingCreate?: { Record?: { Id: string } | null } | null } };

export type CreateVisitMutationVariables = Exact<{
  input: VisitCreateInput;
}>;


export type CreateVisitMutation = { uiapi: { VisitCreate?: { Record?: { Id: string } | null } | null } };

export type DeleteProviderVisitProdDetailingMutationVariables = Exact<{
  input: RecordDeleteInput;
}>;


export type DeleteProviderVisitProdDetailingMutation = { uiapi: { ProviderVisitProdDetailingDelete?: { Id?: string | null } | null } };

export type DeleteVisitMutationVariables = Exact<{
  input: RecordDeleteInput;
}>;


export type DeleteVisitMutation = { uiapi: { VisitDelete?: { Id?: string | null } | null } };

export type GetAccountAddressesQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAccountAddressesQuery = { uiapi: { query: { ContactPointAddress?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Street?: { value?: string | null } | null, City?: { value?: string | null } | null, State?: { value?: string | null } | null, PostalCode?: { value?: string | null } | null, IsPrimary?: { value?: boolean | null } | null } | null } | null> | null } | null } } };

export type GetAccountDetailQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAccountDetailQuery = { uiapi: { query: { Account?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null, displayValue?: string | null } | null, RecordType?: { Name?: { value?: string | null } | null } | null, Type?: { value?: string | null, displayValue?: string | null } | null, Phone?: { value?: string | null } | null, PersonEmail?: { value?: string | null } | null, PersonMailingStreet?: { value?: string | null } | null, PersonMailingCity?: { value?: string | null } | null, PersonMailingState?: { value?: string | null } | null, PersonMailingPostalCode?: { value?: string | null } | null } | null } | null> | null } | null } } };

export type GetAccountTerritoriesQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAccountTerritoriesQuery = { uiapi: { query: { ProviderAcctTerritoryInfo?: { edges?: Array<{ node?: { Id: string, Territory2Id?: { value?: string | null } | null, Territory2?: { Name?: { value?: string | null } | null } | null, IsTargetedAccount?: { value?: boolean | null } | null, LastProviderVisitDate?: { value?: string | null } | null, NextProviderVisitDate?: { value?: string | null } | null, YearToDatePrvdVisitCount?: { value?: number | null } | null } | null } | null> | null } | null } } };

export type GetAccountVisitsQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAccountVisitsQuery = { uiapi: { query: { Visit?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Status?: { value?: string | null } | null, Channel?: { value?: string | null } | null, Call_type__c?: { value?: string | null, displayValue?: string | null } | null, PlannedVisitStartTime?: { value?: string | null } | null, LS_Territory_Name__c?: { value?: string | null } | null, Account?: { Name?: { value?: string | null } | null } | null } | null } | null> | null } | null } } };

export type GetAccountsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAccountsQuery = { uiapi: { query: { Account?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null, displayValue?: string | null } | null, RecordType?: { Name?: { value?: string | null } | null } | null, Type?: { value?: string | null, displayValue?: string | null } | null, Phone?: { value?: string | null } | null, PersonEmail?: { value?: string | null } | null, PersonMailingCity?: { value?: string | null } | null, PersonMailingState?: { value?: string | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetBrandsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBrandsQuery = { uiapi: { query: { LifeSciMarketableProduct?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null } | null } | null> | null } | null } } };

export type GetDisbursementsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDisbursementsQuery = { uiapi: { query: { ProductDisbursement?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null, displayValue?: string | null } | null, ProductName?: { value?: string | null, displayValue?: string | null } | null, QuantityDisbursed?: { value?: number | null, displayValue?: string | null } | null, QuantityRequested?: { value?: number | null, displayValue?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, DisbursementDate?: { value?: string | null, displayValue?: string | null } | null, IsSignatureCaptured?: { value?: boolean | null, displayValue?: string | null } | null, Comments?: { value?: string | null, displayValue?: string | null } | null, DisbursementToAccount?: { Name?: { value?: string | null, displayValue?: string | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetEventsInRangeQueryVariables = Exact<{
  from?: InputMaybe<Scalars['DateTime']['input']>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetEventsInRangeQuery = { uiapi: { query: { Event?: { edges?: Array<{ node?: { Id: string, Subject?: { value?: string | null } | null, StartDateTime?: { value?: string | null } | null, EndDateTime?: { value?: string | null } | null, IsAllDayEvent?: { value?: boolean | null } | null, Location?: { value?: string | null } | null } | null } | null> | null } | null } } };

export type GetInquiriesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetInquiriesQuery = { uiapi: { query: { Inquiry?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Type?: { value?: string | null, displayValue?: string | null } | null, Priority?: { value?: string | null, displayValue?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, InquiryChannelType?: { value?: string | null, displayValue?: string | null } | null, SubmittedDateTime?: { value?: string | null } | null, CreatedDate?: { value?: string | null } | null, TerritoryName?: { value?: string | null } | null, Account?: { Name?: { value?: string | null } | null } | null } | null } | null> | null, pageInfo: { hasNextPage: boolean, endCursor?: string | null } } | null } } };

export type GetInquiryRecordTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInquiryRecordTypesQuery = { uiapi: { query: { RecordType?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, SobjectType?: { value?: string | null } | null } | null } | null> | null } | null } } };

export type GetInventoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInventoryQuery = { uiapi: { query: { ProductBatchItem?: { edges?: Array<{ node?: { Id: string, IsActive?: { value?: boolean | null } | null, RemainingQuantity?: { value?: number | null } | null, ExpirationDate?: { value?: string | null } | null, Product?: { Name?: { value?: string | null } | null } | null, ProductionBatch?: { Name?: { value?: string | null } | null } | null, Location?: { Name?: { value?: string | null } | null } | null, Assignee?: { Name?: { value?: string | null } | null } | null } | null } | null> | null } | null } } };

export type GetInventoryCountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInventoryCountsQuery = { uiapi: { query: { InventoryCountAssessment?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, Type?: { value?: string | null, displayValue?: string | null } | null, Purpose?: { value?: string | null, displayValue?: string | null } | null, PlannedStartDateTime?: { value?: string | null } | null, ActualEndDateTime?: { value?: string | null } | null, Location?: { Name?: { value?: string | null } | null } | null, LocationPrimaryUser?: { Name?: { value?: string | null } | null } | null } | null } | null> | null } | null } } };

export type GetInventoryOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInventoryOperationsQuery = { uiapi: { query: { InventoryOperation?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, OperationType?: { value?: string | null, displayValue?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, CreatedDate?: { value?: string | null } | null, SourceLocation?: { Name?: { value?: string | null } | null } | null, DestinationLocation?: { Name?: { value?: string | null } | null } | null, Comment?: { value?: string | null } | null } | null } | null> | null } | null } } };

export type GetProductRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductRequestsQuery = { uiapi: { query: { ProductRequest?: { edges?: Array<{ node?: { Id: string, ProductRequestNumber?: { value?: string | null } | null, Status?: { value?: string | null, displayValue?: string | null } | null, NeedByDate?: { value?: string | null } | null, CreatedDate?: { value?: string | null } | null, ShipmentType?: { value?: string | null, displayValue?: string | null } | null, DestinationLocation?: { Name?: { value?: string | null } | null } | null } | null } | null> | null } | null } } };

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

export type GetVisitDetailQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetVisitDetailQuery = { uiapi: { query: { Visit?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Status?: { value?: string | null } | null, Channel?: { value?: string | null } | null, Call_type__c?: { value?: string | null, displayValue?: string | null } | null, VisitPriority?: { value?: string | null, displayValue?: string | null } | null, PlannedVisitStartTime?: { value?: string | null } | null, PlannedVisitEndTime?: { value?: string | null } | null, ActualVisitStartTime?: { value?: string | null } | null, ActualVisitEndTime?: { value?: string | null } | null, InstructionDescription?: { value?: string | null } | null, StatusRemarks?: { value?: string | null } | null, LS_Territory_Name__c?: { value?: string | null } | null, ContactPointAddress?: { value?: string | null } | null, AccountId?: { value?: string | null } | null, PlaceId?: { value?: string | null } | null, TerritoryId?: { value?: string | null } | null, Account?: { Name?: { value?: string | null } | null } | null } | null } | null> | null } | null, ProviderVisit?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Status?: { value?: string | null } | null, VisitSubmitDateTime?: { value?: string | null } | null, PreProviderVisitNotes?: { value?: string | null } | null } | null } | null> | null } | null, ProviderVisitProdDetailing?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Priority?: { value?: number | null } | null, ProductId?: { value?: string | null } | null, Product?:
              | { Name?: { value?: string | null } | null }
              | { Name?: { value?: string | null } | null }
             | null } | null } | null> | null } | null } } };

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

export type GetVisitsInRangeQueryVariables = Exact<{
  from?: InputMaybe<Scalars['DateTime']['input']>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetVisitsInRangeQuery = { uiapi: { query: { Visit?: { edges?: Array<{ node?: { Id: string, Name?: { value?: string | null } | null, Status?: { value?: string | null } | null, Channel?: { value?: string | null } | null, Call_type__c?: { value?: string | null, displayValue?: string | null } | null, PlannedVisitStartTime?: { value?: string | null } | null, PlannedVisitEndTime?: { value?: string | null } | null, LS_Territory_Name__c?: { value?: string | null } | null, Account?: { Name?: { value?: string | null } | null } | null } | null } | null> | null } | null } } };

export type UpdateProviderVisitProdDetailingMutationVariables = Exact<{
  input: ProviderVisitProdDetailingUpdateInput;
}>;


export type UpdateProviderVisitProdDetailingMutation = { uiapi: { ProviderVisitProdDetailingUpdate?: { Record?: { Id: string } | null } | null } };

export type UpdateVisitMutationVariables = Exact<{
  input: VisitUpdateInput;
}>;


export type UpdateVisitMutation = { uiapi: { VisitUpdate?: { Record?: { Id: string } | null } | null } };

import { z } from 'zod';

/**
 * Locally persisted Salesforce entities.
 *
 * CRM records the plugin creates, reads, updates and deletes are mirrored:
 * Account, Contact, Lead, Opportunity, Campaign, CampaignMember, Note, Task,
 * OpportunityLineItem, Pricebook2, PricebookEntry, User, EmailMessage, and
 * ContentDocument. Bulk jobs, UI-API layout metadata, and Tooling/Metadata
 * describe payloads are not — they are transport, not records.
 *
 * Field names match official REST/SOAP API names (PascalCase).
 * Object reference: https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_list.htm
 * REST retrieve: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve.htm
 *
 * Each field is labeled from the official object-reference table. Only `Id` is
 * required: Salesforce omits or nulls most fields depending on FLS, record
 * type, and which columns a SOQL SELECT asked for. `.loose()` keeps custom
 * fields (`__c`) and the REST `attributes` envelope.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * Compound address. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/compound_fields_address.htm
 */
export const SalesforceAddress = z
	.object({
		city: S,
		country: S,
		countryCode: S,
		geocodeAccuracy: S,
		latitude: N,
		longitude: N,
		postalCode: S,
		state: S,
		stateCode: S,
		street: S,
	})
	.loose();
export type SalesforceAddress = z.infer<typeof SalesforceAddress>;

const Address = SalesforceAddress.nullable().optional();

/**
 * Account. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_account.htm
 */
export const SalesforceAccountEntity = z
	.object({
		/** Unique 15/18-character Salesforce identifier. */
		Id: z.string(),
		/** Account number assigned to this account (not the system Id). */
		AccountNumber: S,
		/** Source of the account record (Advertisement, Trade Show, …). */
		AccountSource: S,
		/** Estimated annual revenue of the account. */
		AnnualRevenue: N,
		/** Compound billing address. Read-only. */
		BillingAddress: Address,
		BillingCity: S,
		BillingCountry: S,
		BillingGeocodeAccuracy: S,
		BillingLatitude: N,
		BillingLongitude: N,
		BillingPostalCode: S,
		BillingState: S,
		BillingStreet: S,
		CreatedById: S,
		CreatedDate: S,
		/** Text description of the account. */
		Description: S,
		Fax: S,
		/** Industry associated with this account. */
		Industry: S,
		IsDeleted: B,
		IsPersonAccount: B,
		LastActivityDate: S,
		LastModifiedById: S,
		LastModifiedDate: S,
		LastReferencedDate: S,
		LastViewedDate: S,
		MasterRecordId: S,
		/** Required. Account Name. Max 255 characters. */
		Name: S,
		/** Label: Employees. */
		NumberOfEmployees: N,
		OwnerId: S,
		/** Ownership type: Private, Public, Subsidiary. */
		Ownership: S,
		ParentId: S,
		Phone: S,
		PhotoUrl: S,
		/** Prospect rating: Hot, Warm, Cold. */
		Rating: S,
		RecordTypeId: S,
		ShippingAddress: Address,
		ShippingCity: S,
		ShippingCountry: S,
		ShippingGeocodeAccuracy: S,
		ShippingLatitude: N,
		ShippingLongitude: N,
		ShippingPostalCode: S,
		ShippingState: S,
		ShippingStreet: S,
		Sic: S,
		SicDesc: S,
		/** Label: Account Site. */
		Site: S,
		SystemModstamp: S,
		TickerSymbol: S,
		/** Type of account: Customer, Competitor, Partner. */
		Type: S,
		Website: S,
	})
	.loose();
export type SalesforceAccountEntity = z.infer<typeof SalesforceAccountEntity>;

/**
 * Contact. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contact.htm
 */
export const SalesforceContactEntity = z
	.object({
		Id: z.string(),
		AccountId: S,
		AssistantName: S,
		AssistantPhone: S,
		Birthdate: S,
		CreatedById: S,
		CreatedDate: S,
		Department: S,
		Description: S,
		DoNotCall: B,
		Email: S,
		EmailBouncedDate: S,
		EmailBouncedReason: S,
		Fax: S,
		FirstName: S,
		HasOptedOutOfEmail: B,
		HasOptedOutOfFax: B,
		HomePhone: S,
		IndividualId: S,
		IsDeleted: B,
		IsEmailBounced: B,
		LastActivityDate: S,
		LastModifiedById: S,
		LastModifiedDate: S,
		LastReferencedDate: S,
		LastViewedDate: S,
		/** Required on create. Max 80 characters. */
		LastName: S,
		LeadSource: S,
		MailingAddress: Address,
		MailingCity: S,
		MailingCountry: S,
		MailingGeocodeAccuracy: S,
		MailingLatitude: N,
		MailingLongitude: N,
		MailingPostalCode: S,
		MailingState: S,
		MailingStreet: S,
		MasterRecordId: S,
		MobilePhone: S,
		Name: S,
		OtherAddress: Address,
		OtherCity: S,
		OtherCountry: S,
		OtherPhone: S,
		OtherPostalCode: S,
		OtherState: S,
		OtherStreet: S,
		OwnerId: S,
		Phone: S,
		PhotoUrl: S,
		RecordTypeId: S,
		ReportsToId: S,
		Salutation: S,
		SystemModstamp: S,
		Title: S,
	})
	.loose();
export type SalesforceContactEntity = z.infer<typeof SalesforceContactEntity>;

/**
 * Lead. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_lead.htm
 */
export const SalesforceLeadEntity = z
	.object({
		Id: z.string(),
		Address: Address,
		AnnualRevenue: N,
		City: S,
		Company: S,
		ConvertedAccountId: S,
		ConvertedContactId: S,
		ConvertedDate: S,
		ConvertedOpportunityId: S,
		Country: S,
		CreatedById: S,
		CreatedDate: S,
		Description: S,
		Email: S,
		EmailBouncedDate: S,
		EmailBouncedReason: S,
		Fax: S,
		FirstName: S,
		HasOptedOutOfEmail: B,
		IndividualId: S,
		Industry: S,
		IsConverted: B,
		IsDeleted: B,
		IsUnreadByOwner: B,
		LastActivityDate: S,
		LastModifiedById: S,
		LastModifiedDate: S,
		LastReferencedDate: S,
		LastViewedDate: S,
		/** Required on create unless person accounts are enabled. */
		LastName: S,
		LeadSource: S,
		MasterRecordId: S,
		MobilePhone: S,
		Name: S,
		NumberOfEmployees: N,
		OwnerId: S,
		Phone: S,
		PostalCode: S,
		Rating: S,
		RecordTypeId: S,
		Salutation: S,
		State: S,
		/** Lead status picklist. */
		Status: S,
		Street: S,
		SystemModstamp: S,
		Title: S,
		Website: S,
	})
	.loose();
export type SalesforceLeadEntity = z.infer<typeof SalesforceLeadEntity>;

/**
 * Opportunity. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_opportunity.htm
 */
export const SalesforceOpportunityEntity = z
	.object({
		Id: z.string(),
		AccountId: S,
		Amount: N,
		CampaignId: S,
		/** Required on create. Date the opportunity closes. */
		CloseDate: S,
		ContactId: S,
		CreatedById: S,
		CreatedDate: S,
		Description: S,
		ExpectedRevenue: N,
		ForecastCategory: S,
		ForecastCategoryName: S,
		HasOpportunityLineItem: B,
		IsClosed: B,
		IsDeleted: B,
		IsPrivate: B,
		IsWon: B,
		LastActivityDate: S,
		LastModifiedById: S,
		LastModifiedDate: S,
		LastReferencedDate: S,
		LastViewedDate: S,
		LeadSource: S,
		/** Required on create. */
		Name: S,
		NextStep: S,
		OwnerId: S,
		Pricebook2Id: S,
		Probability: N,
		RecordTypeId: S,
		/** Required on create. Sales stage picklist. */
		StageName: S,
		SystemModstamp: S,
		TotalOpportunityQuantity: N,
		Type: S,
	})
	.loose();
export type SalesforceOpportunityEntity = z.infer<
	typeof SalesforceOpportunityEntity
>;

/**
 * Campaign. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_campaign.htm
 */
export const SalesforceCampaignEntity = z
	.object({
		Id: z.string(),
		ActualCost: N,
		AmountAllOpportunities: N,
		AmountWonOpportunities: N,
		BudgetedCost: N,
		CampaignMemberRecordTypeId: S,
		CreatedById: S,
		CreatedDate: S,
		Description: S,
		EndDate: S,
		ExpectedResponse: N,
		ExpectedRevenue: N,
		IsActive: B,
		IsDeleted: B,
		LastActivityDate: S,
		LastModifiedById: S,
		LastModifiedDate: S,
		LastReferencedDate: S,
		LastViewedDate: S,
		/** Required on create. */
		Name: S,
		NumberOfContacts: N,
		NumberOfConvertedLeads: N,
		NumberOfLeads: N,
		NumberOfOpportunities: N,
		NumberOfResponses: N,
		NumberOfWonOpportunities: N,
		NumberSent: N,
		OwnerId: S,
		ParentId: S,
		RecordTypeId: S,
		StartDate: S,
		Status: S,
		SystemModstamp: S,
		Type: S,
	})
	.loose();
export type SalesforceCampaignEntity = z.infer<typeof SalesforceCampaignEntity>;

/**
 * CampaignMember. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_campaignmember.htm
 */
export const SalesforceCampaignMemberEntity = z
	.object({
		Id: z.string(),
		CampaignId: S,
		ContactId: S,
		CreatedById: S,
		CreatedDate: S,
		FirstRespondedDate: S,
		HasResponded: B,
		IsDeleted: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		LeadId: S,
		Status: S,
		SystemModstamp: S,
	})
	.loose();
export type SalesforceCampaignMemberEntity = z.infer<
	typeof SalesforceCampaignMemberEntity
>;

/**
 * Note. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_note.htm
 */
export const SalesforceNoteEntity = z
	.object({
		Id: z.string(),
		Body: S,
		CreatedById: S,
		CreatedDate: S,
		IsDeleted: B,
		IsPrivate: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		OwnerId: S,
		ParentId: S,
		SystemModstamp: S,
		Title: S,
	})
	.loose();
export type SalesforceNoteEntity = z.infer<typeof SalesforceNoteEntity>;

/**
 * Task. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_task.htm
 */
export const SalesforceTaskEntity = z
	.object({
		Id: z.string(),
		AccountId: S,
		ActivityDate: S,
		CallDisposition: S,
		CallDurationInSeconds: N,
		CallObject: S,
		CallType: S,
		CompletedDateTime: S,
		CreatedById: S,
		CreatedDate: S,
		Description: S,
		IsArchived: B,
		IsClosed: B,
		IsDeleted: B,
		IsHighPriority: B,
		IsRecurrence: B,
		IsReminderSet: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		OwnerId: S,
		Priority: S,
		RecurrenceRegeneratedType: S,
		ReminderDateTime: S,
		Status: S,
		Subject: S,
		SystemModstamp: S,
		TaskSubtype: S,
		WhatId: S,
		WhoId: S,
	})
	.loose();
export type SalesforceTaskEntity = z.infer<typeof SalesforceTaskEntity>;

/**
 * OpportunityLineItem. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_opportunitylineitem.htm
 */
export const SalesforceOpportunityLineItemEntity = z
	.object({
		Id: z.string(),
		CreatedById: S,
		CreatedDate: S,
		Description: S,
		IsDeleted: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		ListPrice: N,
		Name: S,
		OpportunityId: S,
		PricebookEntryId: S,
		Product2Id: S,
		ProductCode: S,
		Quantity: N,
		ServiceDate: S,
		SortOrder: N,
		SystemModstamp: S,
		TotalPrice: N,
		UnitPrice: N,
	})
	.loose();
export type SalesforceOpportunityLineItemEntity = z.infer<
	typeof SalesforceOpportunityLineItemEntity
>;

/**
 * Pricebook2. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_pricebook2.htm
 */
export const SalesforcePricebookEntity = z
	.object({
		Id: z.string(),
		CreatedById: S,
		CreatedDate: S,
		Description: S,
		IsActive: B,
		IsArchived: B,
		IsDeleted: B,
		IsStandard: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		LastReferencedDate: S,
		LastViewedDate: S,
		Name: S,
		SystemModstamp: S,
	})
	.loose();
export type SalesforcePricebookEntity = z.infer<
	typeof SalesforcePricebookEntity
>;

/**
 * PricebookEntry. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_pricebookentry.htm
 */
export const SalesforcePricebookEntryEntity = z
	.object({
		Id: z.string(),
		CreatedById: S,
		CreatedDate: S,
		IsActive: B,
		IsArchived: B,
		IsDeleted: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		Name: S,
		Pricebook2Id: S,
		Product2Id: S,
		ProductCode: S,
		SystemModstamp: S,
		UnitPrice: N,
		UseStandardPrice: B,
	})
	.loose();
export type SalesforcePricebookEntryEntity = z.infer<
	typeof SalesforcePricebookEntryEntity
>;

/**
 * User. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_user.htm
 */
export const SalesforceUserEntity = z
	.object({
		Id: z.string(),
		AboutMe: S,
		AccountId: S,
		Alias: S,
		City: S,
		CompanyName: S,
		Country: S,
		CreatedById: S,
		CreatedDate: S,
		Department: S,
		Email: S,
		EmailEncodingKey: S,
		FirstName: S,
		IsActive: B,
		LanguageLocaleKey: S,
		LastLoginDate: S,
		LastModifiedById: S,
		LastModifiedDate: S,
		LastName: S,
		LocaleSidKey: S,
		MobilePhone: S,
		Name: S,
		Phone: S,
		PostalCode: S,
		ProfileId: S,
		State: S,
		Street: S,
		SystemModstamp: S,
		TimeZoneSidKey: S,
		Title: S,
		Username: S,
		UserRoleId: S,
		UserType: S,
	})
	.loose();
export type SalesforceUserEntity = z.infer<typeof SalesforceUserEntity>;

/**
 * EmailMessage. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_emailmessage.htm
 */
export const SalesforceEmailMessageEntity = z
	.object({
		Id: z.string(),
		BccAddress: S,
		CcAddress: S,
		CreatedById: S,
		CreatedDate: S,
		FromAddress: S,
		FromName: S,
		HasAttachment: B,
		Headers: S,
		HtmlBody: S,
		Incoming: B,
		IsDeleted: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		MessageDate: S,
		ParentId: S,
		RelatedToId: S,
		Status: S,
		Subject: S,
		SystemModstamp: S,
		TextBody: S,
		ToAddress: S,
	})
	.loose();
export type SalesforceEmailMessageEntity = z.infer<
	typeof SalesforceEmailMessageEntity
>;

/**
 * ContentDocument. Official:
 * https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contentdocument.htm
 */
export const SalesforceContentDocumentEntity = z
	.object({
		Id: z.string(),
		ContentModifiedDate: S,
		ContentSize: N,
		CreatedById: S,
		CreatedDate: S,
		Description: S,
		FileExtension: S,
		FileType: S,
		IsDeleted: B,
		LastModifiedById: S,
		LastModifiedDate: S,
		LatestPublishedVersionId: S,
		OwnerId: S,
		ParentId: S,
		PublishStatus: S,
		SharingOption: S,
		SharingPrivacy: S,
		SystemModstamp: S,
		Title: S,
	})
	.loose();
export type SalesforceContentDocumentEntity = z.infer<
	typeof SalesforceContentDocumentEntity
>;

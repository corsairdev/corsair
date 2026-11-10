import { z } from 'zod';

// Salesforce records and writes inside Mixmax (developer.mixmax.com/reference,
// Salesforce section). Field names, types, and required-ness mirror the
// official SalesforceRecord, SalesforceRecordPage, SalesforceRecordResult,
// SalesforceWriteBody and SalesforceRelatedList schemas and the
// /v1/salesforce/* operation definitions.

// A Salesforce record, keyed by Salesforce field API names. Only the fields
// listed in the `fields` query parameter are returned and single-record
// responses add `salesforceURL`, so the documented fields stay optional and
// the object stays passthrough: Salesforce record fields are provider- and
// org-defined.
export const SalesforceRecordSchema = z
	.object({
		// The record's 18-character Salesforce Id.
		Id: z.string().optional(),
		// Link to the record in Salesforce; records in lists omit it.
		salesforceURL: z.string().optional(),
	})
	.passthrough();

export type SalesforceRecord = z.infer<typeof SalesforceRecordSchema>;

// The update routes take the record's Id twice: in the URL and in the body.
// Mixmax picks the record from the body `Id` and ignores the one in the URL,
// so a call whose two ids disagree would silently update a record other than
// the one the caller addressed. Salesforce writes the same record's Id in a
// 15-character and an 18-character form (the 18-character one adds a
// checksum suffix), so only the first 15 characters are compared.
const isSameSalesforceRecord = (input: { id: string; Id: string }) =>
	input.id.length >= 15 && input.Id.length >= 15
		? input.id.slice(0, 15) === input.Id.slice(0, 15)
		: input.id === input.Id;

const SALESFORCE_ID_MISMATCH = {
	message:
		'`Id` must name the same Salesforce record as `id`: Mixmax updates the record in the body `Id`, not the one in the URL',
	path: ['Id'],
};

// A page of Salesforce records, matching the official SalesforceRecordPage
// schema. Both cursors are always returned, so `next`, `hasNext`, `previous`
// and `hasPrevious` stay optional while `results` is the page's payload.
export const SalesforceRecordPageSchema = z.object({
	results: z.array(SalesforceRecordSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type SalesforceRecordPage = z.infer<typeof SalesforceRecordPageSchema>;

// One Salesforce error, matching the official SalesforceRecordResult error
// items: every documented field is optional and the object stays passthrough
// because Salesforce adds error detail it does not pin down.
const SalesforceErrorSchema = z
	.object({
		// The Salesforce error name, e.g. `REQUIRED_FIELD_MISSING`.
		name: z.string().optional(),
		// The Salesforce error code.
		errorCode: z.string().optional(),
		message: z.string().optional(),
		// The fields the error is about, when Salesforce names them.
		fields: z.array(z.string()).optional(),
	})
	.passthrough();

export type SalesforceError = z.infer<typeof SalesforceErrorSchema>;

// The result Salesforce returned for a create, update or delete, matching the
// official SalesforceRecordResult schema. `id` can be absent on a successful
// create that Mixmax treated as a retry, so every field stays optional.
export const SalesforceRecordResultSchema = z.object({
	id: z.string().optional(),
	success: z.boolean().optional(),
	errors: z.array(SalesforceErrorSchema).optional(),
});

export type SalesforceRecordResult = z.infer<
	typeof SalesforceRecordResultSchema
>;

// A create or update body, matching the official SalesforceWriteBody schema:
// the record's fields, keyed by Salesforce field API name. The object stays
// passthrough because Salesforce write bodies accept org-defined fields.
// `OwnerId` takes a Salesforce User Id, or `myself` for the API caller.
export const SalesforceWriteBodySchema = z
	.object({
		OwnerId: z.string().optional(),
	})
	.passthrough();

export type SalesforceWriteBody = z.infer<typeof SalesforceWriteBodySchema>;

// Up to 11 related records, newest first, matching the official
// SalesforceRelatedList schema; which keys appear depends on the related
// object, so every field stays optional.
export const SalesforceRelatedListSchema = z.object({
	// The records. Named `tasks` for open and closed Tasks.
	tasks: z.array(SalesforceRecordSchema).optional(),
	// The records. Named `events` for Events.
	events: z.array(SalesforceRecordSchema).optional(),
	// Whether Salesforce has more records than the ones returned.
	hasMore: z.boolean().optional(),
	// Link to the full list in Salesforce.
	listLink: z.string().optional(),
});

export type SalesforceRelatedList = z.infer<typeof SalesforceRelatedListSchema>;

// One synced field, matching the official /salesforce/syncedFields field
// objects, which document every property as optional.
const SalesforceSyncedFieldSchema = z.object({
	// The field's API name.
	fieldName: z.string().optional(),
	fieldLabel: z.string().optional(),
	objectName: z.string().optional(),
	// The field's Salesforce type, e.g. `text` or `picklist`.
	fieldType: z.string().optional(),
	required: z.boolean().optional(),
	createable: z.boolean().optional(),
	isDefault: z.boolean().optional(),
	picklistValues: z
		.array(
			z.object({
				label: z.string().optional(),
				value: z.string().optional(),
				active: z.boolean().optional(),
				defaultValue: z.boolean().optional(),
			}),
		)
		.optional(),
});

export type SalesforceSyncedField = z.infer<typeof SalesforceSyncedFieldSchema>;

// GET /v1/salesforce/account. `fields` is required: requests without it
// answer 400.
export const SalesforceListAccountsInputSchema = z.object({
	// Comma-separated list of Salesforce field API names to return, e.g.
	// `Id,Name`. `GET /v1/salesforce/syncedFields` lists the fields available
	// in your org.
	fields: z.string().min(1),
	// Cursor from a previous response's `next`, to fetch the next page.
	next: z.string().optional(),
	// Cursor from a previous response's `previous`, to fetch the previous page.
	previous: z.string().optional(),
});

export type SalesforceListAccountsInput = z.infer<
	typeof SalesforceListAccountsInputSchema
>;

// GET /v1/salesforce/account answers 200 with a page of Accounts.
export const SalesforceListAccountsOutputSchema = SalesforceRecordPageSchema;

export type SalesforceListAccountsOutput = z.infer<
	typeof SalesforceListAccountsOutputSchema
>;

// POST /v1/salesforce/account body. The provider marks the body required but
// none of its fields: `Name` (plus the org's required fields) is enforced by
// Salesforce itself and answers 500 when missing.
export const SalesforceCreateAccountInputSchema = SalesforceWriteBodySchema;

export type SalesforceCreateAccountInput = z.infer<
	typeof SalesforceCreateAccountInputSchema
>;

// POST /v1/salesforce/account answers 200 with the write result.
export const SalesforceCreateAccountOutputSchema = SalesforceRecordResultSchema;

export type SalesforceCreateAccountOutput = z.infer<
	typeof SalesforceCreateAccountOutputSchema
>;

export const SalesforceGetAccountImplicitInputSchema = z.object({
	// The email domain to look up, for example `mixmax.com`. Domains of free
	// email providers, such as `gmail.com`, never match.
	emailDomain: z.string().min(1),
});

export type SalesforceGetAccountImplicitInput = z.infer<
	typeof SalesforceGetAccountImplicitInputSchema
>;

// GET /v1/salesforce/account/implicit answers 200 with the matching Account
// envelope, or 204 with no body when no implicit match exists. The envelope
// stays passthrough like the record it wraps, so provider-added keys survive
// output parsing.
export const SalesforceGetAccountImplicitOutputSchema = z.union([
	z
		.object({
			account: SalesforceRecordSchema.optional(),
		})
		.passthrough(),
	z.undefined(),
]);

export type SalesforceGetAccountImplicitOutput = z.infer<
	typeof SalesforceGetAccountImplicitOutputSchema
>;

export const SalesforceGetAccountInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return; requests
	// without it answer 400.
	fields: z.string().min(1),
});

export type SalesforceGetAccountInput = z.infer<
	typeof SalesforceGetAccountInputSchema
>;

// GET /v1/salesforce/account/{id} answers 200 with the Account, or 204 with
// no body when no record matches.
export const SalesforceGetAccountOutputSchema = z.union([
	SalesforceRecordSchema,
	z.undefined(),
]);

export type SalesforceGetAccountOutput = z.infer<
	typeof SalesforceGetAccountOutputSchema
>;

// PUT /v1/salesforce/account/{id}. The provider requires the Account's `Id`
// in the body — the Id in the URL is not used to pick the record — so the
// path `id` and the body `Id` are both required here, exactly as the official
// example sends them.
export const SalesforceUpdateAccountInputSchema =
	SalesforceWriteBodySchema.extend({
		id: z.string().min(1),
		Id: z.string().min(1),
	}).refine(isSameSalesforceRecord, SALESFORCE_ID_MISMATCH);

export type SalesforceUpdateAccountInput = z.infer<
	typeof SalesforceUpdateAccountInputSchema
>;

// PUT /v1/salesforce/account/{id} answers 200 with the write result.
export const SalesforceUpdateAccountOutputSchema = SalesforceRecordResultSchema;

export type SalesforceUpdateAccountOutput = z.infer<
	typeof SalesforceUpdateAccountOutputSchema
>;

// POST /v1/salesforce/contact body. The provider marks the body required but
// none of its fields: `LastName` (plus the org's required fields) is enforced
// by Salesforce itself and answers 500 when missing.
export const SalesforceCreateContactInputSchema = SalesforceWriteBodySchema;

export type SalesforceCreateContactInput = z.infer<
	typeof SalesforceCreateContactInputSchema
>;

// POST /v1/salesforce/contact answers 200 with the write result.
export const SalesforceCreateContactOutputSchema = SalesforceRecordResultSchema;

export type SalesforceCreateContactOutput = z.infer<
	typeof SalesforceCreateContactOutputSchema
>;

export const SalesforceGetContactInputSchema = z.object({
	// Both 15- and 18-character Ids are accepted.
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return; requests
	// without it answer 400.
	fields: z.string().min(1),
});

export type SalesforceGetContactInput = z.infer<
	typeof SalesforceGetContactInputSchema
>;

// GET /v1/salesforce/contact/{id} answers 200 with the Contact, or 204 with
// no body when no record matches.
export const SalesforceGetContactOutputSchema = z.union([
	SalesforceRecordSchema,
	z.undefined(),
]);

export type SalesforceGetContactOutput = z.infer<
	typeof SalesforceGetContactOutputSchema
>;

// PUT /v1/salesforce/contact/{id}. The provider requires the Contact's `Id`
// in the body — the Id in the URL is not used to pick the record — so the
// path `id` and the body `Id` are both required here.
export const SalesforceUpdateContactInputSchema =
	SalesforceWriteBodySchema.extend({
		id: z.string().min(1),
		Id: z.string().min(1),
	}).refine(isSameSalesforceRecord, SALESFORCE_ID_MISMATCH);

export type SalesforceUpdateContactInput = z.infer<
	typeof SalesforceUpdateContactInputSchema
>;

// PUT /v1/salesforce/contact/{id} answers 200 with the write result.
export const SalesforceUpdateContactOutputSchema = SalesforceRecordResultSchema;

export type SalesforceUpdateContactOutput = z.infer<
	typeof SalesforceUpdateContactOutputSchema
>;

// GET /v1/salesforce/contact/{id}/tasks lists the Tasks whose `WhoId` is this
// Contact. `fields` is required: requests without it answer 400.
export const SalesforceListContactTasksInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return.
	fields: z.string().min(1),
	// Cursor from a previous response's `next`, to fetch the next page.
	next: z.string().optional(),
	// Cursor from a previous response's `previous`, to fetch the previous page.
	previous: z.string().optional(),
});

export type SalesforceListContactTasksInput = z.infer<
	typeof SalesforceListContactTasksInputSchema
>;

// GET /v1/salesforce/contact/{id}/tasks answers 200 with a page of Tasks.
export const SalesforceListContactTasksOutputSchema =
	SalesforceRecordPageSchema;

export type SalesforceListContactTasksOutput = z.infer<
	typeof SalesforceListContactTasksOutputSchema
>;

export const SalesforceGetContactOrLeadInputSchema = z.object({
	// The email address to look up; requests without it answer 400.
	email: z.string().min(1),
	// `true` to also include the related Account, Opportunities, Events and
	// Tasks.
	withRelatedObjects: z.enum(['true', 'false']).optional(),
	// Any non-empty value looks the email up in Salesforce directly instead of
	// Mixmax's synced copy — including `false` — so leave it out for the
	// default.
	fetch: z.string().optional(),
});

export type SalesforceGetContactOrLeadInput = z.infer<
	typeof SalesforceGetContactOrLeadInputSchema
>;

// GET /v1/salesforce/contactOrLead answers 200 with the matching record under
// `contact` or `lead`, or 204 with no body when no record matches. The
// related-object keys are present only with `withRelatedObjects=true` and
// `account` is `null` when the record has none, so every key stays optional
// and the envelope passthrough.
export const SalesforceGetContactOrLeadOutputSchema = z.union([
	z
		.object({
			contact: SalesforceRecordSchema.optional(),
			lead: SalesforceRecordSchema.optional(),
			// The record's Account, or `null` if it has none.
			account: SalesforceRecordSchema.nullable().optional(),
			// Opportunities the Contact has a contact role on.
			opportunities: z.array(SalesforceRecordSchema).optional(),
			events: SalesforceRelatedListSchema.optional(),
			openTasks: SalesforceRelatedListSchema.optional(),
			closedTasks: SalesforceRelatedListSchema.optional(),
		})
		.passthrough(),
	z.undefined(),
]);

export type SalesforceGetContactOrLeadOutput = z.infer<
	typeof SalesforceGetContactOrLeadOutputSchema
>;

// POST /v1/salesforce/lead body. The provider schema marks `LastName` and
// `Company` required — Salesforce rejects the create without them, along with
// the org's required fields.
export const SalesforceCreateLeadInputSchema = SalesforceWriteBodySchema.extend(
	{
		// The Lead's last name.
		LastName: z.string().min(1),
		// The Lead's company.
		Company: z.string().min(1),
	},
);

export type SalesforceCreateLeadInput = z.infer<
	typeof SalesforceCreateLeadInputSchema
>;

// POST /v1/salesforce/lead answers 200 with the write result.
export const SalesforceCreateLeadOutputSchema = SalesforceRecordResultSchema;

export type SalesforceCreateLeadOutput = z.infer<
	typeof SalesforceCreateLeadOutputSchema
>;

export const SalesforceGetLeadInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return; requests
	// without it answer 400.
	fields: z.string().min(1),
});

export type SalesforceGetLeadInput = z.infer<
	typeof SalesforceGetLeadInputSchema
>;

// GET /v1/salesforce/lead/{id} answers 200 with the Lead, or 204 with no body
// when no record matches.
export const SalesforceGetLeadOutputSchema = z.union([
	SalesforceRecordSchema,
	z.undefined(),
]);

export type SalesforceGetLeadOutput = z.infer<
	typeof SalesforceGetLeadOutputSchema
>;

// PUT /v1/salesforce/lead/{id}. The provider requires the Lead's `Id` in the
// body — the Id in the URL is not used to pick the record — so the path `id`
// and the body `Id` are both required here.
export const SalesforceUpdateLeadInputSchema = SalesforceWriteBodySchema.extend(
	{
		id: z.string().min(1),
		Id: z.string().min(1),
	},
).refine(isSameSalesforceRecord, SALESFORCE_ID_MISMATCH);

export type SalesforceUpdateLeadInput = z.infer<
	typeof SalesforceUpdateLeadInputSchema
>;

// PUT /v1/salesforce/lead/{id} answers 200 with the write result.
export const SalesforceUpdateLeadOutputSchema = SalesforceRecordResultSchema;

export type SalesforceUpdateLeadOutput = z.infer<
	typeof SalesforceUpdateLeadOutputSchema
>;

// GET /v1/salesforce/lead/{id}/tasks lists the Tasks whose `WhoId` is this
// Lead. `fields` is required: requests without it answer 400.
export const SalesforceListLeadTasksInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return.
	fields: z.string().min(1),
	// Cursor from a previous response's `next`, to fetch the next page.
	next: z.string().optional(),
	// Cursor from a previous response's `previous`, to fetch the previous page.
	previous: z.string().optional(),
});

export type SalesforceListLeadTasksInput = z.infer<
	typeof SalesforceListLeadTasksInputSchema
>;

// GET /v1/salesforce/lead/{id}/tasks answers 200 with a page of Tasks.
export const SalesforceListLeadTasksOutputSchema = SalesforceRecordPageSchema;

export type SalesforceListLeadTasksOutput = z.infer<
	typeof SalesforceListLeadTasksOutputSchema
>;

// POST /v1/salesforce/opportunity body. The provider requires `ContactId` —
// the Contact is attached to the Opportunity as a contact role — and
// Salesforce requires `Name`, `StageName` and `CloseDate` on top.
export const SalesforceCreateOpportunityInputSchema =
	SalesforceWriteBodySchema.extend({
		// The Salesforce Id of the Contact to attach to the Opportunity.
		ContactId: z.string().min(1),
		// The Account for the Opportunity; defaults to the Contact's Account.
		AccountId: z.string().optional(),
		// `true` to make the Contact the Opportunity's primary contact.
		mm_IsPrimaryContactRole: z.boolean().optional(),
	});

export type SalesforceCreateOpportunityInput = z.infer<
	typeof SalesforceCreateOpportunityInputSchema
>;

// POST /v1/salesforce/opportunity answers 200 with the write result (the
// Opportunity's, even when only its contact role failed).
export const SalesforceCreateOpportunityOutputSchema =
	SalesforceRecordResultSchema;

export type SalesforceCreateOpportunityOutput = z.infer<
	typeof SalesforceCreateOpportunityOutputSchema
>;

export const SalesforceGetOpportunityInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return; requests
	// without it answer 400.
	fields: z.string().min(1),
});

export type SalesforceGetOpportunityInput = z.infer<
	typeof SalesforceGetOpportunityInputSchema
>;

// GET /v1/salesforce/opportunity/{id} answers 200 with the Opportunity, or
// 204 with no body when no record matches.
export const SalesforceGetOpportunityOutputSchema = z.union([
	SalesforceRecordSchema,
	z.undefined(),
]);

export type SalesforceGetOpportunityOutput = z.infer<
	typeof SalesforceGetOpportunityOutputSchema
>;

// PUT /v1/salesforce/opportunity/{id}. The provider requires the
// Opportunity's `Id` and a valid `CloseDate` in the body even when neither
// changes — the Id in the URL is not used to pick the record — so the path
// `id` and both body fields are required here.
export const SalesforceUpdateOpportunityInputSchema =
	SalesforceWriteBodySchema.extend({
		id: z.string().min(1),
		Id: z.string().min(1),
		// The Opportunity's close date, for example `2026-12-31`.
		CloseDate: z.string().min(1),
		// A Contact to add to the Opportunity as a contact role.
		ContactId: z.string().optional(),
		// With `ContactId`, `true` makes that Contact the primary contact.
		mm_IsPrimaryContactRole: z.boolean().optional(),
	}).refine(isSameSalesforceRecord, SALESFORCE_ID_MISMATCH);

export type SalesforceUpdateOpportunityInput = z.infer<
	typeof SalesforceUpdateOpportunityInputSchema
>;

// PUT /v1/salesforce/opportunity/{id} answers 200 with the write result; an
// invalid `CloseDate` answers 500 with `success: false`.
export const SalesforceUpdateOpportunityOutputSchema =
	SalesforceRecordResultSchema;

export type SalesforceUpdateOpportunityOutput = z.infer<
	typeof SalesforceUpdateOpportunityOutputSchema
>;

export const SalesforceDeleteOpportunityInputSchema = z.object({
	id: z.string().min(1),
});

export type SalesforceDeleteOpportunityInput = z.infer<
	typeof SalesforceDeleteOpportunityInputSchema
>;

// DELETE /v1/salesforce/opportunity/{id} answers 200 with no body.
export const SalesforceDeleteOpportunityOutputSchema = z.undefined();

export type SalesforceDeleteOpportunityOutput = z.infer<
	typeof SalesforceDeleteOpportunityOutputSchema
>;

// GET /v1/salesforce/search. `type`, `q` and `fields` are required: requests
// without them, or with an unknown `type`, answer 400.
export const SalesforceSearchInputSchema = z.object({
	// The type of record to search.
	type: z.enum([
		'Account',
		'Campaign',
		'Contact',
		'Lead',
		'Opportunity',
		'User',
	]),
	// The start of the name to search for; the match ignores case, so
	// `q=burl` finds `Burlington Textiles`.
	q: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return, e.g.
	// `Id,Name`.
	fields: z.string().min(1),
	// Cursor from a previous response's `next`, to fetch the next page.
	next: z.string().optional(),
	// Cursor from a previous response's `previous`, to fetch the previous page.
	previous: z.string().optional(),
});

export type SalesforceSearchInput = z.infer<typeof SalesforceSearchInputSchema>;

// GET /v1/salesforce/search answers 200 with a page of matching records.
export const SalesforceSearchOutputSchema = SalesforceRecordPageSchema;

export type SalesforceSearchOutput = z.infer<
	typeof SalesforceSearchOutputSchema
>;

// GET /v1/salesforce/syncedFields. `fields` is required: requests without it
// answer 400.
export const SalesforceSyncedFieldsInputSchema = z.object({
	// Comma-separated list of Salesforce object types, for example
	// `Account,Contact`. The response has one key per type.
	fields: z.string().min(1),
	// `true` to read the fields through your workspace's Salesforce sync user.
	useSyncUser: z.enum(['true', 'false']).optional(),
});

export type SalesforceSyncedFieldsInput = z.infer<
	typeof SalesforceSyncedFieldsInputSchema
>;

// GET /v1/salesforce/syncedFields answers 200 with one key per requested
// object type, each holding that type's synced fields.
export const SalesforceSyncedFieldsOutputSchema = z.record(
	z.string(),
	z.array(SalesforceSyncedFieldSchema),
);

export type SalesforceSyncedFieldsOutput = z.infer<
	typeof SalesforceSyncedFieldsOutputSchema
>;

// POST /v1/salesforce/task body. The provider marks the body required but
// none of its fields; `Subject`, `WhoId`, `WhatId`, `ActivityDate` and
// `Status` are the fields the prose calls out.
export const SalesforceCreateTaskInputSchema = SalesforceWriteBodySchema;

export type SalesforceCreateTaskInput = z.infer<
	typeof SalesforceCreateTaskInputSchema
>;

// POST /v1/salesforce/task answers 200 with the write result.
export const SalesforceCreateTaskOutputSchema = SalesforceRecordResultSchema;

export type SalesforceCreateTaskOutput = z.infer<
	typeof SalesforceCreateTaskOutputSchema
>;

export const SalesforceGetTaskInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return; requests
	// without it answer 400.
	fields: z.string().min(1),
});

export type SalesforceGetTaskInput = z.infer<
	typeof SalesforceGetTaskInputSchema
>;

// GET /v1/salesforce/task/{id} answers 200 with the Task, or 204 with no body
// when no record matches.
export const SalesforceGetTaskOutputSchema = z.union([
	SalesforceRecordSchema,
	z.undefined(),
]);

export type SalesforceGetTaskOutput = z.infer<
	typeof SalesforceGetTaskOutputSchema
>;

// PUT /v1/salesforce/task/{id}. The provider requires the Task's `Id` in the
// body — the Id in the URL is not used to pick the record — so the path `id`
// and the body `Id` are both required here.
export const SalesforceUpdateTaskInputSchema = SalesforceWriteBodySchema.extend(
	{
		id: z.string().min(1),
		Id: z.string().min(1),
	},
).refine(isSameSalesforceRecord, SALESFORCE_ID_MISMATCH);

export type SalesforceUpdateTaskInput = z.infer<
	typeof SalesforceUpdateTaskInputSchema
>;

// PUT /v1/salesforce/task/{id} answers 200 with the write result; unlike the
// other updates, a Salesforce rejection answers 400 with the same shape.
export const SalesforceUpdateTaskOutputSchema = SalesforceRecordResultSchema;

export type SalesforceUpdateTaskOutput = z.infer<
	typeof SalesforceUpdateTaskOutputSchema
>;

export const SalesforceDeleteTaskInputSchema = z.object({
	id: z.string().min(1),
});

export type SalesforceDeleteTaskInput = z.infer<
	typeof SalesforceDeleteTaskInputSchema
>;

// DELETE /v1/salesforce/task/{id} answers 200 with the Salesforce result.
export const SalesforceDeleteTaskOutputSchema = SalesforceRecordResultSchema;

export type SalesforceDeleteTaskOutput = z.infer<
	typeof SalesforceDeleteTaskOutputSchema
>;

export const SalesforceGetWhatInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return; requests
	// without it answer 400. Add `type` to learn whether the record is an
	// Account or an Opportunity.
	fields: z.string().min(1),
});

export type SalesforceGetWhatInput = z.infer<
	typeof SalesforceGetWhatInputSchema
>;

// GET /v1/salesforce/what/{id} answers 200 with the Account (checked first)
// or Opportunity, or 204 with no body when no record matches.
export const SalesforceGetWhatOutputSchema = z.union([
	SalesforceRecordSchema,
	z.undefined(),
]);

export type SalesforceGetWhatOutput = z.infer<
	typeof SalesforceGetWhatOutputSchema
>;

export const SalesforceGetWhoInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated list of Salesforce field API names to return; requests
	// without it answer 400. Add `type` to learn whether the record is a
	// Contact or a Lead.
	fields: z.string().min(1),
});

export type SalesforceGetWhoInput = z.infer<typeof SalesforceGetWhoInputSchema>;

// GET /v1/salesforce/who/{id} answers 200 with the Contact (checked first) or
// Lead, or 204 with no body when no record matches.
export const SalesforceGetWhoOutputSchema = z.union([
	SalesforceRecordSchema,
	z.undefined(),
]);

export type SalesforceGetWhoOutput = z.infer<
	typeof SalesforceGetWhoOutputSchema
>;

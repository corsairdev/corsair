import { z } from 'zod';

// Field names match the EmailOctopus v2 OpenAPI spec:
// https://emailoctopus.com/api-documentation/v2
// Outputs are `.loose()` and documented fields nullish, so a field the API
// adds, omits, or sets to null cannot fail a call that has already happened.

const IdSchema = z.string().min(1);
const LimitSchema = z.number().int().min(1).max(100);
const CursorSchema = z.string().min(1);

export const EMAILOCTOPUS_CONTACT_STATUSES = [
	'pending',
	'subscribed',
	'unsubscribed',
] as const;

export const EMAILOCTOPUS_REPORT_STATUSES = [
	'bounced',
	'clicked',
	'complained',
	'opened',
	'sent',
	'unsubscribed',
	'not-opened',
	'not-clicked',
] as const;

export const EMAILOCTOPUS_SCALAR_FIELD_TYPES = [
	'text',
	'number',
	'date',
] as const;

export const EMAILOCTOPUS_CHOICE_FIELD_TYPES = [
	'choice_single',
	'choice_multiple',
] as const;

const ContactStatusSchema = z.enum(EMAILOCTOPUS_CONTACT_STATUSES);

// A field value is text, a date, a number, a list of choices, or null to clear it.
const FieldValueSchema = z.union([
	z.string(),
	z.number().int(),
	z.array(z.string()),
	z.null(),
]);

const FieldsSchema = z.record(z.string(), FieldValueSchema);
const TagFlagsSchema = z.record(z.string(), z.boolean());

const PageInput = {
	limit: LimitSchema.optional().describe(
		'Page size. EmailOctopus returns at most 100.',
	),
	starting_after: CursorSchema.optional().describe(
		'Cursor from paging.next.starting_after. Pass it back unchanged.',
	),
};

const EmptyOutputSchema = z.object({}).loose();

const PagingNextSchema = z
	.object({
		url: z.string().nullish(),
		starting_after: z.string().nullish(),
	})
	.loose();

const PagingSchema = z
	.object({
		next: PagingNextSchema.nullish(),
	})
	.loose();

const ListFieldOutputSchema = z
	.object({
		label: z.string().nullish(),
		tag: z.string().nullish(),
		type: z.string().nullish(),
		choices: z.array(z.string()).nullish(),
		fallback: z.string().nullish(),
	})
	.loose();

const ListCountSchema = z
	.object({
		pending: z.number().int().nullish(),
		subscribed: z.number().int().nullish(),
		unsubscribed: z.number().int().nullish(),
	})
	.loose();

const ListOutputSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		double_opt_in: z.boolean().nullish(),
		fields: z.array(ListFieldOutputSchema).nullish(),
		tags: z.array(z.string()).nullish(),
		counts: z.array(ListCountSchema).nullish(),
		created_at: z.string().nullish(),
		last_updated_at: z.string().nullish(),
	})
	.loose();

const ListPageOutputSchema = z
	.object({
		data: z.array(ListOutputSchema).nullish(),
		paging: PagingSchema.nullish(),
	})
	.loose();

const ContactOutputSchema = z
	.object({
		id: z.string().nullish(),
		email_address: z.string().nullish(),
		fields: FieldsSchema.nullish(),
		tags: z.array(z.string()).nullish(),
		status: z.string().nullish(),
		created_at: z.string().nullish(),
		last_updated_at: z.string().nullish(),
	})
	.loose();

const ContactPageOutputSchema = z
	.object({
		data: z.array(ContactOutputSchema).nullish(),
		paging: PagingSchema.nullish(),
	})
	.loose();

const TagOutputSchema = z.object({ tag: z.string().nullish() }).loose();

const TagPageOutputSchema = z
	.object({
		data: z.array(TagOutputSchema).nullish(),
		paging: PagingSchema.nullish(),
	})
	.loose();

const CampaignFromSchema = z
	.object({
		name: z.string().nullish(),
		email_address: z.string().nullish(),
	})
	.loose();

const CampaignOutputSchema = z
	.object({
		id: z.string().nullish(),
		status: z.string().nullish(),
		name: z.string().nullish(),
		subject: z.string().nullish(),
		preview_text: z.string().nullish(),
		to: z.array(z.string()).nullish(),
		from: CampaignFromSchema.nullish(),
		content: z.object({ html: z.string().nullish() }).loose().nullish(),
		created_at: z.string().nullish(),
		sent_at: z.string().nullish(),
	})
	.loose();

const CampaignPageOutputSchema = z
	.object({
		data: z.array(CampaignOutputSchema).nullish(),
		paging: PagingSchema.nullish(),
	})
	.loose();

const ReportContactSchema = z
	.object({
		contact_id: z.string().nullish(),
		contact_email_address: z.string().nullish(),
		occurred_at: z.string().nullish(),
	})
	.loose();

const ReportContactsOutputSchema = z
	.object({
		status: z.string().nullish(),
		data: z.array(ReportContactSchema).nullish(),
		paging: PagingSchema.nullish(),
	})
	.loose();

const ReportLinkSchema = z
	.object({
		url: z.string().nullish(),
		clicked_total: z.number().int().nullish(),
		clicked_unique: z.number().int().nullish(),
	})
	.loose();

const ReportLinksOutputSchema = z
	.object({
		data: z.array(ReportLinkSchema).nullish(),
	})
	.loose();

const ReportSummaryOutputSchema = z
	.object({
		id: z.string().nullish(),
		sent: z.number().int().nullish(),
		bounced: z
			.object({
				hard: z.number().int().nullish(),
				soft: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		opened: z
			.object({
				total: z.number().int().nullish(),
				unique: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		clicked: z
			.object({
				total: z.number().int().nullish(),
				unique: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		complained: z.number().int().nullish(),
		unsubscribed: z.number().int().nullish(),
	})
	.loose();

const BatchSuccessSchema = z
	.object({
		success: z.boolean().nullish(),
		data: ContactOutputSchema.nullish(),
	})
	.loose();

const BatchErrorSchema = z
	.object({
		success: z.boolean().nullish(),
		id: z.string().nullish(),
		type: z.string().nullish(),
		title: z.string().nullish(),
		detail: z.string().nullish(),
		status: z.number().int().nullish(),
	})
	.loose();

const BatchOutputSchema = z
	.object({
		success: z.array(BatchSuccessSchema).nullish(),
		errors: z.array(BatchErrorSchema).nullish(),
	})
	.loose();

const ListsListInputSchema = z.object(PageInput).strict();
const ListsGetInputSchema = z.object({ list_id: IdSchema }).strict();
const ListsCreateInputSchema = z
	.object({
		name: z.string().min(1).max(255),
	})
	.strict();
const ListsUpdateInputSchema = z
	.object({
		list_id: IdSchema,
		name: z.string().min(1).max(255),
	})
	.strict();
const ListsDeleteInputSchema = ListsGetInputSchema;

const ContactsListInputSchema = z
	.object({
		list_id: IdSchema,
		...PageInput,
		tag: z.string().min(1).optional(),
		status: ContactStatusSchema.optional(),
		'created_at.lte': z.string().min(1).optional(),
		'created_at.gte': z.string().min(1).optional(),
		'last_updated_at.lte': z.string().min(1).optional(),
		'last_updated_at.gte': z.string().min(1).optional(),
	})
	.strict();

const ContactsGetInputSchema = z
	.object({ list_id: IdSchema, contact_id: IdSchema })
	.strict();

const ContactsCreateInputSchema = z
	.object({
		list_id: IdSchema,
		email_address: z.string().min(1),
		fields: FieldsSchema.optional(),
		tags: z.array(z.string()).optional(),
		status: ContactStatusSchema.optional(),
	})
	.strict();

const ContactsUpsertInputSchema = z
	.object({
		list_id: IdSchema,
		email_address: z.string().min(1),
		fields: FieldsSchema.optional(),
		tags: TagFlagsSchema.optional(),
		status: ContactStatusSchema.optional(),
	})
	.strict();

const ContactsUpdateInputSchema = z
	.object({
		list_id: IdSchema,
		contact_id: IdSchema,
		email_address: z.string().min(1).optional(),
		fields: FieldsSchema.optional(),
		tags: TagFlagsSchema.optional(),
		status: ContactStatusSchema.optional(),
	})
	.strict();

const ContactsDeleteInputSchema = ContactsGetInputSchema;

const ContactsBatchInputSchema = z
	.object({
		list_id: IdSchema,
		contacts: z
			.array(
				z
					.object({
						id: IdSchema,
						email_address: z.string().min(1).optional(),
						fields: FieldsSchema.optional(),
						tags: TagFlagsSchema.optional(),
						status: ContactStatusSchema.optional(),
					})
					.strict(),
			)
			.min(1),
	})
	.strict();

const ScalarFieldSchema = z
	.object({
		list_id: IdSchema,
		label: z.string().min(1),
		tag: z.string().min(1),
		type: z.enum(EMAILOCTOPUS_SCALAR_FIELD_TYPES),
		fallback: z.string().nullable().optional(),
	})
	.strict();

const ChoiceFieldSchema = z
	.object({
		list_id: IdSchema,
		label: z.string().min(1),
		tag: z.string().min(1),
		type: z.enum(EMAILOCTOPUS_CHOICE_FIELD_TYPES),
		choices: z.array(z.string()).min(1),
		fallback: z.string().nullable().optional(),
	})
	.strict();

const FieldsCreateInputSchema = z.discriminatedUnion('type', [
	ScalarFieldSchema,
	ChoiceFieldSchema,
]);

const FieldsUpdateInputSchema = ScalarFieldSchema;
const FieldsDeleteInputSchema = z
	.object({ list_id: IdSchema, tag: IdSchema })
	.strict();

const TagsListInputSchema = z
	.object({ list_id: IdSchema, ...PageInput })
	.strict();
const TagsCreateInputSchema = z
	.object({ list_id: IdSchema, tag: z.string().min(1) })
	.strict();
const TagsUpdateInputSchema = z
	.object({
		list_id: IdSchema,
		tag: z.string().min(1).describe('Current tag name. Sent in the URL.'),
		name: z.string().min(1).describe('Replacement tag name. Sent as body.tag.'),
	})
	.strict();
const TagsDeleteInputSchema = FieldsDeleteInputSchema;

const CampaignsListInputSchema = z.object(PageInput).strict();
const CampaignsGetInputSchema = z.object({ campaign_id: IdSchema }).strict();
const CampaignsReportContactsInputSchema = z
	.object({
		campaign_id: IdSchema,
		status: z.enum(EMAILOCTOPUS_REPORT_STATUSES),
		...PageInput,
	})
	.strict();
const CampaignsReportLinksInputSchema = CampaignsGetInputSchema;
const CampaignsReportSummaryInputSchema = CampaignsGetInputSchema;

const AutomationsStartInputSchema = z
	.object({
		automation_id: IdSchema,
		contact_id: IdSchema,
	})
	.strict();

export const EmailOctopusEndpointInputSchemas = {
	listsList: ListsListInputSchema,
	listsGet: ListsGetInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsUpdate: ListsUpdateInputSchema,
	listsDelete: ListsDeleteInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpsert: ContactsUpsertInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsBatch: ContactsBatchInputSchema,
	fieldsCreate: FieldsCreateInputSchema,
	fieldsUpdate: FieldsUpdateInputSchema,
	fieldsDelete: FieldsDeleteInputSchema,
	tagsList: TagsListInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	campaignsReportContacts: CampaignsReportContactsInputSchema,
	campaignsReportLinks: CampaignsReportLinksInputSchema,
	campaignsReportSummary: CampaignsReportSummaryInputSchema,
	automationsStart: AutomationsStartInputSchema,
};

export const EmailOctopusEndpointOutputSchemas = {
	listsList: ListPageOutputSchema,
	listsGet: ListOutputSchema,
	listsCreate: ListOutputSchema,
	listsUpdate: ListOutputSchema,
	listsDelete: EmptyOutputSchema,
	contactsList: ContactPageOutputSchema,
	contactsGet: ContactOutputSchema,
	contactsCreate: ContactOutputSchema,
	contactsUpsert: ContactOutputSchema,
	contactsUpdate: ContactOutputSchema,
	contactsDelete: EmptyOutputSchema,
	contactsBatch: BatchOutputSchema,
	fieldsCreate: ListFieldOutputSchema,
	fieldsUpdate: ListFieldOutputSchema,
	fieldsDelete: EmptyOutputSchema,
	tagsList: TagPageOutputSchema,
	tagsCreate: TagOutputSchema,
	tagsUpdate: TagOutputSchema,
	tagsDelete: EmptyOutputSchema,
	campaignsList: CampaignPageOutputSchema,
	campaignsGet: CampaignOutputSchema,
	campaignsReportContacts: ReportContactsOutputSchema,
	campaignsReportLinks: ReportLinksOutputSchema,
	campaignsReportSummary: ReportSummaryOutputSchema,
	automationsStart: EmptyOutputSchema,
};

export type EmailOctopusEndpointInputs = {
	[K in keyof typeof EmailOctopusEndpointInputSchemas]: z.infer<
		(typeof EmailOctopusEndpointInputSchemas)[K]
	>;
};

export type EmailOctopusEndpointOutputs = {
	[K in keyof typeof EmailOctopusEndpointOutputSchemas]: z.infer<
		(typeof EmailOctopusEndpointOutputSchemas)[K]
	>;
};

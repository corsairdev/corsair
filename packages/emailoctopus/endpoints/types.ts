import { z } from 'zod';

// Field names match the EmailOctopus v2 OpenAPI spec:
// https://emailoctopus.com/api-documentation/v2
// Outputs are `.loose()` and documented fields optional, so a field the API
// adds or omits cannot fail a call that has already happened.

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
		url: z.string().optional(),
		starting_after: z.string().optional(),
	})
	.loose();

const PagingSchema = z
	.object({
		next: PagingNextSchema.nullable().optional(),
	})
	.loose();

const ListFieldOutputSchema = z
	.object({
		label: z.string().optional(),
		tag: z.string().optional(),
		type: z.string().optional(),
		choices: z.array(z.string()).optional(),
		fallback: z.string().nullable().optional(),
	})
	.loose();

const ListCountSchema = z
	.object({
		pending: z.number().int().optional(),
		subscribed: z.number().int().optional(),
		unsubscribed: z.number().int().optional(),
	})
	.loose();

const ListOutputSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		double_opt_in: z.boolean().optional(),
		fields: z.array(ListFieldOutputSchema).optional(),
		tags: z.array(z.string()).optional(),
		counts: z.array(ListCountSchema).optional(),
		created_at: z.string().optional(),
		last_updated_at: z.string().optional(),
	})
	.loose();

const ListPageOutputSchema = z
	.object({
		data: z.array(ListOutputSchema).optional(),
		paging: PagingSchema.optional(),
	})
	.loose();

const ContactOutputSchema = z
	.object({
		id: z.string().optional(),
		email_address: z.string().optional(),
		fields: FieldsSchema.optional(),
		tags: z.array(z.string()).optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		last_updated_at: z.string().optional(),
	})
	.loose();

const ContactPageOutputSchema = z
	.object({
		data: z.array(ContactOutputSchema).optional(),
		paging: PagingSchema.optional(),
	})
	.loose();

const TagOutputSchema = z.object({ tag: z.string().optional() }).loose();

const TagPageOutputSchema = z
	.object({
		data: z.array(TagOutputSchema).optional(),
		paging: PagingSchema.optional(),
	})
	.loose();

const CampaignFromSchema = z
	.object({
		name: z.string().optional(),
		email_address: z.string().optional(),
	})
	.loose();

const CampaignOutputSchema = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		subject: z.string().optional(),
		preview_text: z.string().nullable().optional(),
		to: z.array(z.string()).optional(),
		from: CampaignFromSchema.optional(),
		content: z.object({ html: z.string().optional() }).loose().optional(),
		created_at: z.string().optional(),
		sent_at: z.string().optional(),
	})
	.loose();

const CampaignPageOutputSchema = z
	.object({
		data: z.array(CampaignOutputSchema).optional(),
		paging: PagingSchema.optional(),
	})
	.loose();

const ReportContactSchema = z
	.object({
		contact_id: z.string().optional(),
		contact_email_address: z.string().optional(),
		occurred_at: z.string().optional(),
	})
	.loose();

const ReportContactsOutputSchema = z
	.object({
		status: z.string().optional(),
		data: z.array(ReportContactSchema).optional(),
		paging: PagingSchema.optional(),
	})
	.loose();

const ReportLinkSchema = z
	.object({
		url: z.string().optional(),
		clicked_total: z.number().int().optional(),
		clicked_unique: z.number().int().optional(),
	})
	.loose();

const ReportLinksOutputSchema = z
	.object({
		data: z.array(ReportLinkSchema).optional(),
	})
	.loose();

const ReportSummaryOutputSchema = z
	.object({
		id: z.string().optional(),
		sent: z.number().int().optional(),
		bounced: z
			.object({
				hard: z.number().int().optional(),
				soft: z.number().int().optional(),
			})
			.loose()
			.optional(),
		opened: z
			.object({
				total: z.number().int().optional(),
				unique: z.number().int().optional(),
			})
			.loose()
			.optional(),
		clicked: z
			.object({
				total: z.number().int().optional(),
				unique: z.number().int().optional(),
			})
			.loose()
			.optional(),
		complained: z.number().int().optional(),
		unsubscribed: z.number().int().optional(),
	})
	.loose();

const BatchSuccessSchema = z
	.object({
		success: z.boolean().optional(),
		data: ContactOutputSchema.optional(),
	})
	.loose();

const BatchErrorSchema = z
	.object({
		success: z.boolean().optional(),
		id: z.string().optional(),
		type: z.string().optional(),
		title: z.string().optional(),
		detail: z.string().optional(),
		status: z.number().int().optional(),
	})
	.loose();

const BatchOutputSchema = z
	.object({
		success: z.array(BatchSuccessSchema).optional(),
		errors: z.array(BatchErrorSchema).optional(),
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

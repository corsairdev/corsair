import { z } from 'zod';

const uniqueValues = <T>(values: T[]) => new Set(values).size === values.length;

const DealStatusSchema = z.enum(['open', 'won', 'lost', 'deleted']);
const DealIncludeFieldSchema = z.enum([
	'next_activity_id',
	'last_activity_id',
	'first_won_time',
	'products_count',
	'files_count',
	'notes_count',
	'followers_count',
	'email_messages_count',
	'activities_count',
	'done_activities_count',
	'undone_activities_count',
	'participants_count',
	'last_incoming_mail_time',
	'last_outgoing_mail_time',
	'smart_bcc_email',
	'source_lead_id',
]);

const DealListInputSchema = z
	.object({
		filter_id: z.number().int().optional(),
		ids: z.array(z.number().int()).max(100).refine(uniqueValues).optional(),
		owner_id: z.number().int().optional(),
		person_id: z.number().int().optional(),
		org_id: z.number().int().optional(),
		pipeline_id: z.number().int().optional(),
		stage_id: z.number().int().optional(),
		status: z.array(DealStatusSchema).refine(uniqueValues).optional(),
		updated_since: z.string().optional(),
		updated_until: z.string().optional(),
		sort_by: z.enum(['id', 'update_time', 'add_time']).optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		include_fields: z
			.array(DealIncludeFieldSchema)
			.refine(uniqueValues)
			.optional(),
		custom_fields: z.array(z.string()).max(15).refine(uniqueValues).optional(),
		include_option_labels: z.boolean().optional(),
		include_labels: z.boolean().optional(),
		limit: z.number().int().min(1).max(500).optional(),
		cursor: z.string().optional(),
	})
	.strict();

const DealIdInputSchema = z.object({ id: z.number().int() }).strict();
const DealGetInputSchema = DealIdInputSchema.extend({
	include_fields: z
		.array(DealIncludeFieldSchema)
		.refine(uniqueValues)
		.optional(),
	custom_fields: z.array(z.string()).max(15).refine(uniqueValues).optional(),
	include_option_labels: z.boolean().optional(),
	include_labels: z.boolean().optional(),
}).strict();

// `unknown` is necessary because Pipedrive documents custom field values as arbitrary provider-defined JSON.
const DealCustomFieldsSchema = z.record(z.string(), z.unknown());

const DealOptionalInputFields = {
	owner_id: z.number().int().optional(),
	person_id: z.number().int().nullable().optional(),
	org_id: z.number().int().nullable().optional(),
	pipeline_id: z.number().int().optional(),
	stage_id: z.number().int().optional(),
	value: z.number().optional(),
	currency: z.string().optional(),
	is_archived: z.boolean().optional(),
	archive_time: z.string().nullable().optional(),
	status: z.string().optional(),
	probability: z.number().optional(),
	lost_reason: z.string().optional(),
	visible_to: z.number().int().optional(),
	close_time: z.string().optional(),
	won_time: z.string().optional(),
	lost_time: z.string().optional(),
	expected_close_date: z.iso.date().optional(),
	label_ids: z.array(z.number().int()).optional(),
	channel: z.number().int().nullable().optional(),
	channel_id: z.string().nullable().optional(),
	origin_id: z.string().nullable().optional(),
	custom_fields: DealCustomFieldsSchema.optional(),
} as const;

const DealCreateInputSchema = z
	.object({ title: z.string(), ...DealOptionalInputFields })
	.strict();
const DealUpdateInputSchema = z
	.object({
		id: z.number().int(),
		title: z.string().optional(),
		...DealOptionalInputFields,
		is_deleted: z.literal(false).optional(),
	})
	.strict();

// Response objects are extensible in OpenAPI (additionalProperties is not false).
const DealResponseSchema = z
	.object({
		id: z.number().int().optional(),
		title: z.string().optional(),
		owner_id: z.number().int().optional(),
		person_id: z.number().int().nullable().optional(),
		org_id: z.number().int().nullable().optional(),
		pipeline_id: z.number().int().optional(),
		stage_id: z.number().int().optional(),
		value: z.number().optional(),
		currency: z.string().optional(),
		add_time: z.string().optional(),
		update_time: z.string().nullable().optional(),
		stage_change_time: z.string().nullable().optional(),
		is_deleted: z.boolean().optional(),
		is_archived: z.boolean().optional(),
		status: z.string().optional(),
		probability: z.number().nullable().optional(),
		lost_reason: z.string().nullable().optional(),
		visible_to: z.number().int().optional(),
		close_time: z.string().nullable().optional(),
		won_time: z.string().nullable().optional(),
		lost_time: z.string().nullable().optional(),
		expected_close_date: z.string().nullable().optional(),
		label_ids: z.array(z.number().int()).optional(),
		origin: z.string().optional(),
		origin_id: z.string().nullable().optional(),
		channel: z.number().int().nullable().optional(),
		channel_id: z.string().nullable().optional(),
		source_lead_id: z.string().nullable().optional(),
		arr: z.number().nullable().optional(),
		mrr: z.number().nullable().optional(),
		acv: z.number().nullable().optional(),
		custom_fields: DealCustomFieldsSchema.optional(),
	})
	.passthrough();

const DealResponseEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: DealResponseSchema.optional(),
	})
	.passthrough();
const DealListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(DealResponseSchema).optional(),
		additional_data: z
			.object({ next_cursor: z.string().nullable().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const DealDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({ id: z.number().int().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const PersonIncludeFieldSchema = z.enum([
	'next_activity_id',
	'last_activity_id',
	'open_deals_count',
	'related_open_deals_count',
	'closed_deals_count',
	'related_closed_deals_count',
	'participant_open_deals_count',
	'participant_closed_deals_count',
	'email_messages_count',
	'activities_count',
	'done_activities_count',
	'undone_activities_count',
	'files_count',
	'notes_count',
	'followers_count',
	'won_deals_count',
	'related_won_deals_count',
	'lost_deals_count',
	'related_lost_deals_count',
	'last_incoming_mail_time',
	'last_outgoing_mail_time',
	'marketing_status',
	'doi_status',
	'smart_bcc_email',
]);

const PersonContactItemInputSchema = z
	.object({
		value: z.string().optional(),
		primary: z.boolean().optional(),
		label: z.string().optional(),
	})
	.strict();

// Response contact objects remain extensible because OpenAPI does not close their properties.
const PersonContactItemResponseSchema = z
	.object({
		value: z.string().optional(),
		primary: z.boolean().optional(),
		label: z.string().optional(),
	})
	.passthrough();

const PersonAddressInputSchema = z
	.object({
		value: z.string().optional(),
		country: z.string().nullable().optional(),
		admin_area_level_1: z.string().nullable().optional(),
		admin_area_level_2: z.string().nullable().optional(),
		locality: z.string().nullable().optional(),
		sublocality: z.string().nullable().optional(),
		route: z.string().nullable().optional(),
		street_number: z.string().nullable().optional(),
		subpremise: z.string().nullable().optional(),
		postal_code: z.string().nullable().optional(),
	})
	.strict();

// Response addresses remain extensible because OpenAPI does not close their properties.
const PersonAddressResponseSchema = z
	.object({
		value: z.string().optional(),
		country: z.string().nullable().optional(),
		admin_area_level_1: z.string().nullable().optional(),
		admin_area_level_2: z.string().nullable().optional(),
		locality: z.string().nullable().optional(),
		sublocality: z.string().nullable().optional(),
		route: z.string().nullable().optional(),
		street_number: z.string().nullable().optional(),
		subpremise: z.string().nullable().optional(),
		postal_code: z.string().nullable().optional(),
	})
	.passthrough();

const PersonMarketingStatusSchema = z.enum([
	'no_consent',
	'unsubscribed',
	'subscribed',
	'archived',
]);

// `unknown` is necessary because Pipedrive custom-field values are provider-defined JSON.
const PersonCustomFieldsSchema = z.record(z.string(), z.unknown());

const PersonListInputSchema = z
	.object({
		filter_id: z.number().int().optional(),
		ids: z.array(z.number().int()).max(100).refine(uniqueValues).optional(),
		owner_id: z.number().int().optional(),
		org_id: z.number().int().optional(),
		deal_id: z.number().int().optional(),
		updated_since: z.string().optional(),
		updated_until: z.string().optional(),
		sort_by: z.enum(['id', 'update_time', 'add_time']).optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		include_fields: z
			.array(PersonIncludeFieldSchema)
			.refine(uniqueValues)
			.optional(),
		custom_fields: z.array(z.string()).max(15).refine(uniqueValues).optional(),
		include_option_labels: z.boolean().optional(),
		include_labels: z.boolean().optional(),
		limit: z.number().int().min(1).max(500).optional(),
		cursor: z.string().optional(),
	})
	.strict();

const PersonIdInputSchema = z.object({ id: z.number().int() }).strict();
const PersonGetInputSchema = PersonIdInputSchema.extend({
	include_fields: z
		.array(PersonIncludeFieldSchema)
		.refine(uniqueValues)
		.optional(),
	custom_fields: z.array(z.string()).max(15).refine(uniqueValues).optional(),
	include_option_labels: z.boolean().optional(),
	include_labels: z.boolean().optional(),
}).strict();

const PersonWriteFields = {
	owner_id: z.number().int().optional(),
	org_id: z.number().int().optional(),
	emails: z.array(PersonContactItemInputSchema).optional(),
	phones: z.array(PersonContactItemInputSchema).optional(),
	visible_to: z.number().int().optional(),
	label_ids: z.array(z.number().int()).optional(),
	postal_address: PersonAddressInputSchema.nullable().optional(),
	notes: z.string().max(10_000).optional(),
	im: z.array(PersonContactItemInputSchema).optional(),
	birthday: z.string().optional(),
	job_title: z.string().optional(),
	marketing_status: PersonMarketingStatusSchema.optional(),
	custom_fields: PersonCustomFieldsSchema.optional(),
} as const;

const PersonCreateInputSchema = z
	.object({
		name: z.string(),
		add_time: z.string().optional(),
		...PersonWriteFields,
	})
	.strict();
const PersonUpdateInputSchema = z
	.object({
		id: z.number().int(),
		name: z.string().optional(),
		...PersonWriteFields,
	})
	.strict();

// Response objects are extensible in OpenAPI; contact fields are optional and several are nullable.
const PersonResponseSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		owner_id: z.number().int().optional(),
		org_id: z.number().int().optional(),
		add_time: z.string().optional(),
		update_time: z.string().nullable().optional(),
		emails: z.array(PersonContactItemResponseSchema).optional(),
		phones: z.array(PersonContactItemResponseSchema).optional(),
		is_deleted: z.boolean().optional(),
		visible_to: z.number().int().optional(),
		label_ids: z.array(z.number().int()).optional(),
		picture_id: z.number().int().nullable().optional(),
		postal_address: PersonAddressResponseSchema.nullable().optional(),
		notes: z.string().optional(),
		im: z.array(PersonContactItemResponseSchema).optional(),
		birthday: z.string().optional(),
		job_title: z.string().optional(),
		custom_fields: PersonCustomFieldsSchema.optional(),
	})
	.passthrough();

const PersonResponseEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: PersonResponseSchema.optional(),
	})
	.passthrough();
const PersonListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(PersonResponseSchema).optional(),
		additional_data: z
			.object({ next_cursor: z.string().nullable().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const PersonDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({ id: z.number().int().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const OrganizationIncludeFieldSchema = z.enum([
	'next_activity_id',
	'last_activity_id',
	'open_deals_count',
	'related_open_deals_count',
	'closed_deals_count',
	'related_closed_deals_count',
	'email_messages_count',
	'people_count',
	'activities_count',
	'done_activities_count',
	'undone_activities_count',
	'files_count',
	'notes_count',
	'followers_count',
	'won_deals_count',
	'related_won_deals_count',
	'lost_deals_count',
	'related_lost_deals_count',
	'smart_bcc_email',
]);

const OrganizationListInputSchema = z
	.object({
		filter_id: z.number().int().optional(),
		ids: z.array(z.number().int()).max(100).refine(uniqueValues).optional(),
		owner_id: z.number().int().optional(),
		updated_since: z.string().optional(),
		updated_until: z.string().optional(),
		sort_by: z.enum(['id', 'update_time', 'add_time']).optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		include_fields: z
			.array(OrganizationIncludeFieldSchema)
			.refine(uniqueValues)
			.optional(),
		custom_fields: z.array(z.string()).max(15).refine(uniqueValues).optional(),
		include_option_labels: z.boolean().optional(),
		include_labels: z.boolean().optional(),
		limit: z.number().int().min(1).max(500).optional(),
		cursor: z.string().optional(),
	})
	.strict();

const OrganizationIdInputSchema = z.object({ id: z.number().int() }).strict();
const OrganizationGetInputSchema = OrganizationIdInputSchema.extend({
	include_fields: z
		.array(OrganizationIncludeFieldSchema)
		.refine(uniqueValues)
		.optional(),
	custom_fields: z.array(z.string()).max(15).refine(uniqueValues).optional(),
	include_option_labels: z.boolean().optional(),
	include_labels: z.boolean().optional(),
}).strict();

const OrganizationAddressInputSchema = z
	.object({
		value: z.string().optional(),
		country: z.string().nullable().optional(),
		admin_area_level_1: z.string().nullable().optional(),
		admin_area_level_2: z.string().nullable().optional(),
		locality: z.string().nullable().optional(),
		sublocality: z.string().nullable().optional(),
		route: z.string().nullable().optional(),
		street_number: z.string().nullable().optional(),
		subpremise: z.string().nullable().optional(),
		postal_code: z.string().nullable().optional(),
	})
	.strict();

// Organization custom-field values are provider-defined JSON and are runtime-validated as untrusted values.
// `unknown` is necessary because organization custom-field values are arbitrary JSON defined by each account.
const OrganizationCustomFieldsSchema = z.record(z.string(), z.unknown());

const OrganizationWriteFields = {
	owner_id: z.number().int().optional(),
	visible_to: z.number().int().optional(),
	label_ids: z.array(z.number().int()).optional(),
	address: OrganizationAddressInputSchema.nullable().optional(),
	website: z.string().nullable().optional(),
	linkedin: z.string().nullable().optional(),
	industry: z.number().int().nullable().optional(),
	annual_revenue: z.number().int().nullable().optional(),
	employee_count: z.number().int().nullable().optional(),
	custom_fields: OrganizationCustomFieldsSchema.optional(),
} as const;

const OrganizationCreateInputSchema = z
	.object({
		name: z.string(),
		add_time: z.string().optional(),
		...OrganizationWriteFields,
	})
	.strict();
const OrganizationUpdateInputSchema = z
	.object({
		id: z.number().int(),
		name: z.string().optional(),
		...OrganizationWriteFields,
	})
	.strict();

const OrganizationAddressResponseSchema = z
	.object({
		value: z.string().optional(),
		country: z.string().nullable().optional(),
		admin_area_level_1: z.string().nullable().optional(),
		admin_area_level_2: z.string().nullable().optional(),
		locality: z.string().nullable().optional(),
		sublocality: z.string().nullable().optional(),
		route: z.string().nullable().optional(),
		street_number: z.string().nullable().optional(),
		subpremise: z.string().nullable().optional(),
		postal_code: z.string().nullable().optional(),
	})
	.passthrough();

// Organization response objects are open in the specification; retain provider-added fields.
const OrganizationResponseSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		owner_id: z.number().int().optional(),
		add_time: z.string().optional(),
		update_time: z.string().nullable().optional(),
		is_deleted: z.boolean().optional(),
		visible_to: z.number().int().optional(),
		address: OrganizationAddressResponseSchema.nullable().optional(),
		label_ids: z.array(z.number().int()).optional(),
		website: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		industry: z.number().int().nullable().optional(),
		annual_revenue: z.number().int().nullable().optional(),
		employee_count: z.number().int().nullable().optional(),
		custom_fields: OrganizationCustomFieldsSchema.optional(),
	})
	.passthrough();
const OrganizationResponseEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: OrganizationResponseSchema.optional(),
	})
	.passthrough();
const OrganizationListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(OrganizationResponseSchema).optional(),
		additional_data: z
			.object({ next_cursor: z.string().nullable().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const OrganizationDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({ id: z.number().int().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

export type DealListInput = z.infer<typeof DealListInputSchema>;
export type DealGetInput = z.infer<typeof DealGetInputSchema>;
export type DealIdInput = z.infer<typeof DealIdInputSchema>;
export type DealCreateInput = z.infer<typeof DealCreateInputSchema>;
export type DealUpdateInput = z.infer<typeof DealUpdateInputSchema>;
export type DealListResponse = z.infer<typeof DealListResponseSchema>;
export type DealResponse = z.infer<typeof DealResponseEnvelopeSchema>;
export type DealDeleteResponse = z.infer<typeof DealDeleteResponseSchema>;
export type PersonListInput = z.infer<typeof PersonListInputSchema>;
export type PersonGetInput = z.infer<typeof PersonGetInputSchema>;
export type PersonIdInput = z.infer<typeof PersonIdInputSchema>;
export type PersonCreateInput = z.infer<typeof PersonCreateInputSchema>;
export type PersonUpdateInput = z.infer<typeof PersonUpdateInputSchema>;
export type PersonListResponse = z.infer<typeof PersonListResponseSchema>;
export type PersonResponse = z.infer<typeof PersonResponseEnvelopeSchema>;
export type PersonDeleteResponse = z.infer<typeof PersonDeleteResponseSchema>;
export type OrganizationListInput = z.infer<typeof OrganizationListInputSchema>;
export type OrganizationGetInput = z.infer<typeof OrganizationGetInputSchema>;
export type OrganizationIdInput = z.infer<typeof OrganizationIdInputSchema>;
export type OrganizationCreateInput = z.infer<
	typeof OrganizationCreateInputSchema
>;
export type OrganizationUpdateInput = z.infer<
	typeof OrganizationUpdateInputSchema
>;
export type OrganizationListResponse = z.infer<
	typeof OrganizationListResponseSchema
>;
export type OrganizationResponse = z.infer<
	typeof OrganizationResponseEnvelopeSchema
>;
export type OrganizationDeleteResponse = z.infer<
	typeof OrganizationDeleteResponseSchema
>;

export type PipedriveEndpointInputs = {
	dealList: DealListInput;
	dealGet: DealGetInput;
	dealCreate: DealCreateInput;
	dealUpdate: DealUpdateInput;
	dealDelete: DealIdInput;
	personList: PersonListInput;
	personGet: PersonGetInput;
	personCreate: PersonCreateInput;
	personUpdate: PersonUpdateInput;
	personDelete: PersonIdInput;
	organizationList: OrganizationListInput;
	organizationGet: OrganizationGetInput;
	organizationCreate: OrganizationCreateInput;
	organizationUpdate: OrganizationUpdateInput;
	organizationDelete: OrganizationIdInput;
};

export type PipedriveEndpointOutputs = {
	dealList: DealListResponse;
	dealGet: DealResponse;
	dealCreate: DealResponse;
	dealUpdate: DealResponse;
	dealDelete: DealDeleteResponse;
	personList: PersonListResponse;
	personGet: PersonResponse;
	personCreate: PersonResponse;
	personUpdate: PersonResponse;
	personDelete: PersonDeleteResponse;
	organizationList: OrganizationListResponse;
	organizationGet: OrganizationResponse;
	organizationCreate: OrganizationResponse;
	organizationUpdate: OrganizationResponse;
	organizationDelete: OrganizationDeleteResponse;
};

export const PipedriveEndpointInputSchemas = {
	dealList: DealListInputSchema,
	dealGet: DealGetInputSchema,
	dealCreate: DealCreateInputSchema,
	dealUpdate: DealUpdateInputSchema,
	dealDelete: DealIdInputSchema,
	personList: PersonListInputSchema,
	personGet: PersonGetInputSchema,
	personCreate: PersonCreateInputSchema,
	personUpdate: PersonUpdateInputSchema,
	personDelete: PersonIdInputSchema,
	organizationList: OrganizationListInputSchema,
	organizationGet: OrganizationGetInputSchema,
	organizationCreate: OrganizationCreateInputSchema,
	organizationUpdate: OrganizationUpdateInputSchema,
	organizationDelete: OrganizationIdInputSchema,
} as const;

export const PipedriveEndpointOutputSchemas = {
	dealList: DealListResponseSchema,
	dealGet: DealResponseEnvelopeSchema,
	dealCreate: DealResponseEnvelopeSchema,
	dealUpdate: DealResponseEnvelopeSchema,
	dealDelete: DealDeleteResponseSchema,
	personList: PersonListResponseSchema,
	personGet: PersonResponseEnvelopeSchema,
	personCreate: PersonResponseEnvelopeSchema,
	personUpdate: PersonResponseEnvelopeSchema,
	personDelete: PersonDeleteResponseSchema,
	organizationList: OrganizationListResponseSchema,
	organizationGet: OrganizationResponseEnvelopeSchema,
	organizationCreate: OrganizationResponseEnvelopeSchema,
	organizationUpdate: OrganizationResponseEnvelopeSchema,
	organizationDelete: OrganizationDeleteResponseSchema,
} as const;

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

const DealResponseEnvelopeSchema = z.object({
	success: z.boolean().optional(),
	data: DealResponseSchema.optional(),
});
const DealListResponseSchema = z.object({
	success: z.boolean().optional(),
	data: z.array(DealResponseSchema).optional(),
	additional_data: z
		.object({ next_cursor: z.string().nullable().optional() })
		.optional(),
});
const DealDeleteResponseSchema = z.object({
	success: z.boolean().optional(),
	data: z.object({ id: z.number().int().optional() }).optional(),
});

export type DealListInput = z.infer<typeof DealListInputSchema>;
export type DealGetInput = z.infer<typeof DealGetInputSchema>;
export type DealIdInput = z.infer<typeof DealIdInputSchema>;
export type DealCreateInput = z.infer<typeof DealCreateInputSchema>;
export type DealUpdateInput = z.infer<typeof DealUpdateInputSchema>;
export type DealListResponse = z.infer<typeof DealListResponseSchema>;
export type DealResponse = z.infer<typeof DealResponseEnvelopeSchema>;
export type DealDeleteResponse = z.infer<typeof DealDeleteResponseSchema>;

export type PipedriveEndpointInputs = {
	dealList: DealListInput;
	dealGet: DealGetInput;
	dealCreate: DealCreateInput;
	dealUpdate: DealUpdateInput;
	dealDelete: DealIdInput;
};

export type PipedriveEndpointOutputs = {
	dealList: DealListResponse;
	dealGet: DealResponse;
	dealCreate: DealResponse;
	dealUpdate: DealResponse;
	dealDelete: DealDeleteResponse;
};

export const PipedriveEndpointInputSchemas = {
	dealList: DealListInputSchema,
	dealGet: DealGetInputSchema,
	dealCreate: DealCreateInputSchema,
	dealUpdate: DealUpdateInputSchema,
	dealDelete: DealIdInputSchema,
} as const;

export const PipedriveEndpointOutputSchemas = {
	dealList: DealListResponseSchema,
	dealGet: DealResponseEnvelopeSchema,
	dealCreate: DealResponseEnvelopeSchema,
	dealUpdate: DealResponseEnvelopeSchema,
	dealDelete: DealDeleteResponseSchema,
} as const;

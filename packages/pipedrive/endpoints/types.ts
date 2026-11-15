import { z } from 'zod';
import type {
	ProductEndpointInputs,
	ProductEndpointOutputs,
} from './products-types';
import {
	ProductEndpointInputSchemas,
	ProductEndpointOutputSchemas,
} from './products-types';

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

const ActivityLocationInputSchema = z
	.object({
		value: z.string().optional(),
		country: z.string().optional(),
		admin_area_level_1: z.string().optional(),
		admin_area_level_2: z.string().optional(),
		locality: z.string().optional(),
		sublocality: z.string().optional(),
		route: z.string().optional(),
		street_number: z.string().optional(),
		subpremise: z.string().optional(),
		postal_code: z.string().optional(),
	})
	.strict();

const ActivityParticipantSchema = z
	.object({
		person_id: z.number().int().optional(),
		primary: z.boolean().optional(),
	})
	.strict();

const ActivityAttendeeSchema = z
	.object({
		email: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		is_organizer: z.boolean().optional(),
		person_id: z.number().int().optional(),
		user_id: z.number().int().optional(),
	})
	.strict();
const ActivityParticipantResponseSchema =
	ActivityParticipantSchema.passthrough();
const ActivityAttendeeResponseSchema = ActivityAttendeeSchema.passthrough();

const ActivityWriteFields = {
	subject: z.string().optional(),
	type: z.string().optional(),
	owner_id: z.number().int().optional(),
	deal_id: z.number().int().optional(),
	lead_id: z.string().optional(),
	org_id: z.number().int().optional(),
	project_id: z.number().int().optional(),
	due_date: z.string().optional(),
	due_time: z.string().optional(),
	duration: z.string().optional(),
	busy: z.boolean().optional(),
	done: z.boolean().optional(),
	location: ActivityLocationInputSchema.optional(),
	participants: z.array(ActivityParticipantSchema).optional(),
	attendees: z.array(ActivityAttendeeSchema).optional(),
	public_description: z.string().optional(),
	priority: z.number().int().optional(),
	outcome: z.number().int().nullable().optional(),
	note: z.string().optional(),
} as const;

const ActivityIncludeFieldsSchema = z
	.array(z.enum(['attendees']))
	.refine(uniqueValues);
const ActivityListInputSchema = z
	.object({
		filter_id: z.number().int().optional(),
		ids: z.array(z.number().int()).max(100).refine(uniqueValues).optional(),
		owner_id: z.number().int().optional(),
		deal_id: z.number().int().optional(),
		lead_id: z.string().optional(),
		person_id: z.number().int().optional(),
		org_id: z.number().int().optional(),
		done: z.boolean().optional(),
		updated_since: z.string().optional(),
		updated_until: z.string().optional(),
		sort_by: z.enum(['id', 'update_time', 'add_time', 'due_date']).optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		include_fields: ActivityIncludeFieldsSchema.optional(),
		limit: z.number().int().min(1).max(500).optional(),
		cursor: z.string().optional(),
	})
	.strict();
const ActivityIdInputSchema = z.object({ id: z.number().int() }).strict();
const ActivityGetInputSchema = ActivityIdInputSchema.extend({
	include_fields: ActivityIncludeFieldsSchema.optional(),
}).strict();
const ActivityCreateInputSchema = z.object(ActivityWriteFields).strict();
const ActivityUpdateInputSchema =
	ActivityIdInputSchema.extend(ActivityWriteFields).strict();

// Response objects are open in the specification; preserve documented provider extensions.
const ActivityLocationResponseSchema = z
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
const ActivityResponseSchema = z
	.object({
		id: z.number().int().optional(),
		subject: z.string().optional(),
		type: z.string().optional(),
		owner_id: z.number().int().optional(),
		creator_user_id: z.number().int().optional(),
		is_deleted: z.boolean().optional(),
		add_time: z.string().optional(),
		update_time: z.string().optional(),
		deal_id: z.number().int().nullable().optional(),
		lead_id: z.string().nullable().optional(),
		person_id: z.number().int().nullable().optional(),
		org_id: z.number().int().nullable().optional(),
		project_id: z.number().int().nullable().optional(),
		due_date: z.string().optional(),
		due_time: z.string().nullable().optional(),
		duration: z.string().nullable().optional(),
		busy: z.boolean().optional(),
		done: z.boolean().optional(),
		marked_as_done_time: z.string().nullable().optional(),
		location: ActivityLocationResponseSchema.nullable().optional(),
		participants: z.array(ActivityParticipantResponseSchema).optional(),
		attendees: z.array(ActivityAttendeeResponseSchema).optional(),
		conference_meeting_client: z.string().optional(),
		conference_meeting_url: z.string().optional(),
		conference_meeting_id: z.string().optional(),
		public_description: z.string().optional(),
		priority: z.number().int().optional(),
		outcome: z.number().int().nullable().optional(),
		note: z.string().optional(),
	})
	.passthrough();
const ActivityResponseEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: ActivityResponseSchema.optional(),
	})
	.passthrough();
const ActivityListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(ActivityResponseSchema).optional(),
		additional_data: z
			.object({ next_cursor: z.string().nullable().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const ActivityDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.object({ id: z.number().int().optional() }).optional(),
	})
	.passthrough();

const TaskParentFilterSchema = z.union([
	z.string(),
	z.number().int(),
	z.null(),
]);
const TaskListInputSchema = z
	.object({
		cursor: z.string().optional(),
		limit: z.number().int().min(1).max(500).optional(),
		is_done: z.boolean().optional(),
		is_milestone: z.boolean().optional(),
		assignee_id: z.number().int().optional(),
		project_id: z.number().int().optional(),
		// The route docs describe null for root tasks and integer IDs; OpenAPI types this query as a string.
		parent_task_id: TaskParentFilterSchema.optional(),
	})
	.strict();
const TaskIdInputSchema = z.object({ id: z.number().int() }).strict();
const TaskCreateInputSchema = z
	.object({
		title: z.string().min(1).max(255),
		project_id: z.number().int(),
		parent_task_id: z.number().int().nullable().optional(),
		description: z.string().nullable().optional(),
		done: z.union([z.literal(0), z.literal(1)]).optional(),
		milestone: z.union([z.literal(0), z.literal(1)]).optional(),
		due_date: z.iso.date().nullable().optional(),
		start_date: z.iso.date().nullable().optional(),
		assignee_id: z.number().int().nullable().optional(),
		assignee_ids: z.array(z.number().int()).max(10).optional(),
		priority: z.number().int().min(0).nullable().optional(),
	})
	.strict();
const TaskUpdateInputSchema = TaskIdInputSchema.extend({
	title: z.string().min(1).max(255).optional(),
	project_id: z.number().int().optional(),
	parent_task_id: z.number().int().nullable().optional(),
	description: z.string().nullable().optional(),
	done: z.union([z.literal(0), z.literal(1)]).optional(),
	milestone: z.union([z.literal(0), z.literal(1)]).optional(),
	due_date: z.iso.date().nullable().optional(),
	start_date: z.iso.date().nullable().optional(),
	assignee_id: z.number().int().nullable().optional(),
	assignee_ids: z.array(z.number().int()).max(10).optional(),
	priority: z.number().int().min(0).nullable().optional(),
}).strict();

const TaskResponseSchema = z
	.object({
		id: z.number().int().optional(),
		title: z.string().min(1).max(255).optional(),
		creator_id: z.number().int().optional(),
		description: z.string().nullable().optional(),
		project_id: z.number().int().optional(),
		is_done: z.boolean().optional(),
		is_milestone: z.boolean().optional(),
		due_date: z.iso.date().nullable().optional(),
		start_date: z.iso.date().nullable().optional(),
		parent_task_id: z.number().int().nullable().optional(),
		assignee_ids: z.array(z.number().int()).optional(),
		priority: z.number().int().min(0).nullable().optional(),
		add_time: z.string().optional(),
		update_time: z.string().optional(),
		marked_as_done_time: z.string().nullable().optional(),
	})
	.passthrough();
const TaskResponseEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: TaskResponseSchema.optional(),
		additional_data: z.object({}).passthrough().nullable().optional(),
	})
	.passthrough();
const TaskListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(TaskResponseSchema).optional(),
		additional_data: z
			.object({ next_cursor: z.string().nullable().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const TaskDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.object({ id: z.number().int().optional() }).optional(),
		additional_data: z.object({}).passthrough().nullable().optional(),
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
export type ActivityListInput = z.infer<typeof ActivityListInputSchema>;
export type ActivityGetInput = z.infer<typeof ActivityGetInputSchema>;
export type ActivityIdInput = z.infer<typeof ActivityIdInputSchema>;
export type ActivityCreateInput = z.infer<typeof ActivityCreateInputSchema>;
export type ActivityUpdateInput = z.infer<typeof ActivityUpdateInputSchema>;
export type ActivityListResponse = z.infer<typeof ActivityListResponseSchema>;
export type ActivityResponse = z.infer<typeof ActivityResponseEnvelopeSchema>;
export type ActivityDeleteResponse = z.infer<
	typeof ActivityDeleteResponseSchema
>;
export type TaskListInput = z.infer<typeof TaskListInputSchema>;
export type TaskIdInput = z.infer<typeof TaskIdInputSchema>;
export type TaskCreateInput = z.infer<typeof TaskCreateInputSchema>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateInputSchema>;
export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;
export type TaskResponse = z.infer<typeof TaskResponseEnvelopeSchema>;
export type TaskDeleteResponse = z.infer<typeof TaskDeleteResponseSchema>;

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
	activityList: ActivityListInput;
	activityGet: ActivityGetInput;
	activityCreate: ActivityCreateInput;
	activityUpdate: ActivityUpdateInput;
	activityDelete: ActivityIdInput;
	taskList: TaskListInput;
	taskGet: TaskIdInput;
	taskCreate: TaskCreateInput;
	taskUpdate: TaskUpdateInput & TaskIdInput;
	taskDelete: TaskIdInput;
} & ProductEndpointInputs;

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
	activityList: ActivityListResponse;
	activityGet: ActivityResponse;
	activityCreate: ActivityResponse;
	activityUpdate: ActivityResponse;
	activityDelete: ActivityDeleteResponse;
	taskList: TaskListResponse;
	taskGet: TaskResponse;
	taskCreate: TaskResponse;
	taskUpdate: TaskResponse;
	taskDelete: TaskDeleteResponse;
} & ProductEndpointOutputs;

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
	activityList: ActivityListInputSchema,
	activityGet: ActivityGetInputSchema,
	activityCreate: ActivityCreateInputSchema,
	activityUpdate: ActivityUpdateInputSchema,
	activityDelete: ActivityIdInputSchema,
	taskList: TaskListInputSchema,
	taskGet: TaskIdInputSchema,
	taskCreate: TaskCreateInputSchema,
	taskUpdate: TaskUpdateInputSchema,
	taskDelete: TaskIdInputSchema,
	...ProductEndpointInputSchemas,
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
	activityList: ActivityListResponseSchema,
	activityGet: ActivityResponseEnvelopeSchema,
	activityCreate: ActivityResponseEnvelopeSchema,
	activityUpdate: ActivityResponseEnvelopeSchema,
	activityDelete: ActivityDeleteResponseSchema,
	taskList: TaskListResponseSchema,
	taskGet: TaskResponseEnvelopeSchema,
	taskCreate: TaskResponseEnvelopeSchema,
	taskUpdate: TaskResponseEnvelopeSchema,
	taskDelete: TaskDeleteResponseSchema,
	...ProductEndpointOutputSchemas,
} as const;

import { z } from 'zod';

const Id = z.union([z.string(), z.number()]);

/**
 * PHP serializes an empty related record as `[]` instead of `null`,
 * which is what GET /v1/calls returns for calls with no member, lead or profile.
 */
const EmptyRelation = z.array(z.never());

const NamedRef = z.object({
	id: Id.optional(),
	name: z.string().optional(),
});

const LeadTag = z.union([z.string(), NamedRef]);

/**
 * Nested call summary on GET /v1/leads.
 */
const CallinglyLeadCall = z.object({
	id: Id,
	source: z.string().nullable().optional(),
	seconds: z.number().optional(),
	direction: z.string().optional(),
	status: z.string().nullable().optional(),
	result: z.string().nullable().optional(),
	agent_retry: z.number().optional(),
	lead_retry: z.number().optional(),
	started_at: z.string().optional(),
	recording_url: z.string().nullable().optional(),
});

/**
 * Lead fields from GET /v1/leads and GET /v1/leads/{id}.
 */
export const CallinglyLead = z.object({
	id: Id,
	account_id: Id.optional(),
	lead_owner_id: Id.nullable().optional(),
	fname: z.string().nullable().optional(),
	lname: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone_number: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	source_id: Id.nullable().optional(),
	created_at: z.string().optional(),
	company: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	result: z.string().nullable().optional(),
	team: NamedRef.nullable().optional(),
	tags: z.array(LeadTag).optional(),
	stage: z.string().nullable().optional(),
	calls: z.array(CallinglyLeadCall).optional(),
	scheduled_call_at: z.string().nullable().optional(),
	lead_owner: z
		.object({
			name: z.string().nullable().optional(),
			phone_number: z.string().nullable().optional(),
			custom_id: Id.nullable().optional(),
		})
		.nullable()
		.optional(),
	is_stopped: z.number().optional(),
	is_blocked: z.number().optional(),
});

const CallUser = z.object({
	id: Id,
	name: z.string().optional(),
	fname: z.string().optional(),
	lname: z.string().optional(),
	email: z.string().optional(),
	phone_number: z.string().optional(),
});

const CallLead = z.object({
	id: Id,
	name: z.string().nullable().optional(),
	label: z.string().nullable().optional(),
	fname: z.string().nullable().optional(),
	lname: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone_number: z.string().nullable().optional(),
	phone_number_formatted: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	crm: z.string().nullable().optional(),
	source_id: Id.nullable().optional(),
	deleted_at: z.string().nullable().optional(),
});

/**
 * Call fields from GET /v1/calls/{id} and GET /v1/calls.
 */
export const CallinglyCall = z.object({
	id: Id,
	started_at: z.string().optional(),
	direction: z.string().optional(),
	status: z.string().nullable().optional(),
	status_formatted: z.string().optional(),
	lead_status: z.string().nullable().optional(),
	lead_status_formatted: z.string().optional(),
	ring_status: z.string().optional(),
	seconds: z.number().optional(),
	duration: z.string().optional(),
	retry: z.number().optional(),
	lead_retry: z.number().optional(),
	time_formatted: z.string().optional(),
	from_formatted: z.string().optional(),
	source: z.string().nullable().optional(),
	recording_url: z.string().nullable().optional(),
	waveform_url: z.string().nullable().optional(),
	error_message: z.string().nullable().optional(),
	phone_number_formatted: z.string().optional(),
	human_result: z.string().nullable().optional(),
	user: z.union([CallUser, EmptyRelation]).nullable().optional(),
	member: z.union([CallUser, EmptyRelation]).nullable().optional(),
	lead: z.union([CallLead, EmptyRelation]).nullable().optional(),
	profile: z.union([NamedRef, EmptyRelation]).nullable().optional(),
	is_voicemail: z.number().optional(),
	is_queue: z.number().optional(),
	is_team_offline: z.number().optional(),
	scheduled_call_type: z.string().nullable().optional(),
	old_lead_owner_id: Id.nullable().optional(),
	transcript: z.string().nullable().optional(),
	is_error: z.number().optional(),
	error_code: z.string().optional(),
});

/**
 * Agent fields from GET /v1/agents.
 */
export const CallinglyUser = z.object({
	id: Id,
	account_id: Id.optional(),
	fname: z.string().optional(),
	lname: z.string().optional(),
	phone_number: z.string().optional(),
	ext: z.string().nullable().optional(),
	donotdisturb: z.number().optional(),
	donotdisturb_until: z.string().nullable().optional(),
	priority: z.number().optional(),
	timezone: z.string().optional(),
	is_available: z.boolean().optional(),
});

/**
 * Team fields from GET /v1/teams and GET /v1/teams/{id}.
 */
export const CallinglyTeam = z.object({
	id: Id,
	account_id: Id.optional(),
	name: z.string(),
	is_record: z.number().optional(),
	call_mode: z.string().optional(),
	whispertext: z.string().optional(),
	post_whispertext: z.string().optional(),
	language: z.string().optional(),
	delay: z.number().optional(),
	is_retry: z.number().optional(),
	retries: z.number().optional(),
	retry_schedule: z.array(z.number()).optional(),
	is_reschedule: z.number().optional(),
	is_retry_lead: z.number().optional(),
	lead_retries: z.number().optional(),
	lead_retry_schedule: z.array(z.number()).optional(),
	is_sms: z.number().optional(),
	sms_body: z.string().optional(),
	whispertext_voice: z.string().optional(),
	is_users_available_for_call: z.boolean().optional(),
});

/**
 * Team agent fields from GET /v1/teams/{id}/agents.
 * `team_id` is added locally so one table can hold every team's members.
 */
export const CallinglyTeamUser = z.object({
	id: Id,
	team_id: Id.optional(),
	name: z.string().optional(),
	priority: z.number().optional(),
	cap: z.number().nullable().optional(),
});

/**
 * One day of GET /v1/agents/{id}/schedule. `start` may be `allday`.
 */
export const CallinglyScheduleDay = z.object({
	label: z.string().optional(),
	day: z.number().int().min(0).max(6),
	is_available: z.boolean(),
	times: z.array(
		z.object({
			start: z.string(),
			end: z.string(),
		}),
	),
});

/**
 * GET /v1/agents/{id}/schedule returns a bare day array.
 * Local sync stores it under the agent id.
 */
export const CallinglySchedule = z.object({
	id: Id,
	days: z.array(CallinglyScheduleDay),
});

/**
 * Client fields from GET /v1/clients.
 */
export const CallinglyClient = z.object({
	id: Id,
	name: z.string().optional(),
	email: z.string().optional(),
	billed_users: z.number().optional(),
	billed_numbers: z.number().optional(),
});

export const CallinglyWebhookEvent = z.enum([
	'call_completed',
	'lead_created',
	'lead_updated',
]);
export const CallinglyCallDirection = z.enum(['outbound', 'inbound']);
export const CallinglyWebhookCallStatus = z.enum([
	'completed',
	'missed',
	'offline',
]);
export const CallinglyWebhookCallLeadStatus = z.enum([
	'contacted',
	'missed',
	'removed',
	'voicemail',
]);
export const CallinglyWebhookLeadField = z.enum([
	'lead_owner',
	'result',
	'stage',
	'status',
	'tags',
]);

/**
 * Webhook fields from GET /v1/webhooks.
 */
export const CallinglyWebhookConfig = z.object({
	id: Id,
	account_id: Id.optional(),
	name: z.string().optional(),
	event: z.string().optional(),
	target_url: z.string().optional(),
	call_direction: z.string().nullable().optional(),
	call_status: z.string().nullable().optional(),
	call_lead_status: z.string().nullable().optional(),
	team_id: Id.nullable().optional(),
	number_id: Id.nullable().optional(),
	field: z.string().nullable().optional(),
	filter: z.string().nullable().optional(),
});

export type CallinglyLead = z.infer<typeof CallinglyLead>;
export type CallinglyCall = z.infer<typeof CallinglyCall>;
export type CallinglyUser = z.infer<typeof CallinglyUser>;
export type CallinglyTeam = z.infer<typeof CallinglyTeam>;
export type CallinglyTeamUser = z.infer<typeof CallinglyTeamUser>;
export type CallinglyScheduleDay = z.infer<typeof CallinglyScheduleDay>;
export type CallinglySchedule = z.infer<typeof CallinglySchedule>;
export type CallinglyClient = z.infer<typeof CallinglyClient>;
export type CallinglyWebhookConfig = z.infer<typeof CallinglyWebhookConfig>;

import { z } from 'zod';

const Id = z.union([z.string(), z.number()]);

/**
 * Lead fields from GET/LIST /v1/leads in the Callingly API docs.
 */
export const CallinglyLead = z
	.object({
		id: Id,
		account_id: Id.optional(),
		lead_owner_id: Id.optional(),
		name: z.string().optional(),
		label: z.string().optional(),
		fname: z.string().optional(),
		lname: z.string().optional(),
		email: z.string().optional(),
		phone_number: z.string().optional(),
		phone_number_formatted: z.string().optional(),
		source: z.string().nullable().optional(),
		crm: z.string().nullable().optional(),
		source_id: z.union([z.string(), z.number()]).nullable().optional(),
		company: z.string().nullable().optional(),
		category: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		result: z.string().nullable().optional(),
		// Official docs show stage/tags as unstructured JSON, not a fixed object.
		stage: z.unknown().nullable().optional(),
		tags: z.array(z.unknown()).optional(),
		team: z
			.object({
				id: Id.optional(),
				name: z.string().optional(),
			})
			.passthrough()
			.optional(),
		lead_owner: z
			.object({
				name: z.string().optional(),
				phone_number: z.string().optional(),
				// custom_id is documented as mixed scalar/object depending on CRM source.
				custom_id: z.unknown().nullable().optional(),
			})
			.passthrough()
			.optional(),
		// Nested call summaries on a lead omit the full call schema.
		calls: z.array(z.unknown()).optional(),
		scheduled_call_at: z.string().nullable().optional(),
		is_stopped: z.number().optional(),
		is_blocked: z.number().optional(),
		created_at: z.string().optional(),
		deleted_at: z.string().nullable().optional(),
	})
	.passthrough();

/**
 * Call fields from GET /v1/calls/{id} and LIST /v1/calls in the Callingly API docs.
 */
export const CallinglyCall = z
	.object({
		id: Id,
		started_at: z.string().optional(),
		direction: z.string().optional(),
		status: z.string().nullable().optional(),
		status_formatted: z.string().optional(),
		lead_status: z.string().nullable().optional(),
		lead_status_formatted: z.string().optional(),
		ring_status: z.string().optional(),
		seconds: z.number().optional(),
		duration: z.union([z.number(), z.string()]).optional(),
		retry: z.number().optional(),
		lead_retry: z.number().optional(),
		time_formatted: z.string().optional(),
		from_formatted: z.string().optional(),
		source: z.string().nullable().optional(),
		recording_url: z.string().nullable().optional(),
		waveform_url: z.string().optional(),
		// error_message is a string or structured object in list vs get responses.
		error_message: z.unknown().nullable().optional(),
		phone_number_formatted: z.string().optional(),
		human_result: z.string().optional(),
		transcript: z.string().nullable().optional(),
		// sales_advice is omitted or a free-form object when AI notes exist.
		sales_advice: z.unknown().nullable().optional(),
		is_voicemail: z.number().optional(),
		is_queue: z.number().optional(),
		is_team_offline: z.number().optional(),
		is_error: z.number().optional(),
		error_code: z.string().optional(),
		// Nested user/lead/member/number/tag/notes/profile objects vary by call type.
		user: z.unknown().optional(),
		lead: z.unknown().optional(),
		member: z.unknown().optional(),
		number: z.unknown().nullable().optional(),
		tag: z.unknown().nullable().optional(),
		notes: z.array(z.unknown()).optional(),
		profile: z.unknown().optional(),
	})
	.passthrough();

/**
 * Agent fields from GET /v1/agents in the Callingly API docs.
 */
export const CallinglyUser = z
	.object({
		id: Id,
		account_id: Id.optional(),
		fname: z.string().optional(),
		lname: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		phone_number: z.string().optional(),
		ext: z.string().optional(),
		donotdisturb: z.number().optional(),
		priority: z.number().optional(),
		timezone: z.string().optional(),
		is_available: z.boolean().optional(),
	})
	.passthrough();

export const CallinglyAgent = CallinglyUser;

/**
 * Team fields from GET /v1/teams and GET /v1/teams/{id} in the Callingly API docs.
 */
export const CallinglyTeam = z
	.object({
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
	})
	.passthrough();

/**
 * Team agent fields from GET /v1/teams/{id}/agents in the Callingly API docs.
 */
export const CallinglyTeamUser = z
	.object({
		id: Id,
		team_id: Id.optional(),
		name: z.string().optional(),
		priority: z.number().optional(),
		cap: z.number().nullable().optional(),
	})
	.passthrough();

export const CallinglyScheduleDay = z
	.object({
		label: z.string().optional(),
		day: z.union([z.string(), z.number()]).optional(),
		is_available: z.boolean().optional(),
		times: z
			.array(
				z
					.object({
						start: z.string().optional(),
						end: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

/**
 * GET /v1/agents/{id}/schedule returns an array of day records.
 * Local sync wraps that array with the agent id.
 */
export const CallinglySchedule = z
	.object({
		id: Id.optional(),
		agent_id: Id.optional(),
		days: z.array(CallinglyScheduleDay).optional(),
	})
	.passthrough();

/**
 * Client fields from GET /v1/clients in the Callingly API docs.
 */
export const CallinglyClient = z
	.object({
		id: Id,
		name: z.string().optional(),
		email: z.string().optional(),
		billed_users: z.number().optional(),
		billed_numbers: z.number().optional(),
		fname: z.string().optional(),
		lname: z.string().optional(),
		company: z.string().optional(),
		phone_number: z.string().optional(),
	})
	.passthrough();

/**
 * Webhook fields from GET /v1/webhooks in the Callingly API docs.
 */
export const CallinglyWebhookConfig = z
	.object({
		id: Id,
		account_id: Id.optional(),
		name: z.string().optional(),
		event: z.string().optional(),
		target_url: z.string().optional(),
		call_status: z.string().nullable().optional(),
		call_lead_status: z.string().nullable().optional(),
		team_id: Id.nullable().optional(),
		number_id: Id.nullable().optional(),
		field: z.string().nullable().optional(),
		filter: z.string().nullable().optional(),
		call_direction: z.string().nullable().optional(),
	})
	.passthrough();

export type CallinglyLead = z.infer<typeof CallinglyLead>;
export type CallinglyCall = z.infer<typeof CallinglyCall>;
export type CallinglyUser = z.infer<typeof CallinglyUser>;
export type CallinglyAgent = z.infer<typeof CallinglyAgent>;
export type CallinglyTeam = z.infer<typeof CallinglyTeam>;
export type CallinglyTeamUser = z.infer<typeof CallinglyTeamUser>;
export type CallinglySchedule = z.infer<typeof CallinglySchedule>;
export type CallinglyClient = z.infer<typeof CallinglyClient>;
export type CallinglyWebhookConfig = z.infer<typeof CallinglyWebhookConfig>;

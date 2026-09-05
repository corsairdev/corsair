import { z } from 'zod';

/**
 * Callingly Lead entity schema
 */
export const CallinglyLead = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		phone: z.string().optional(),
		phone_number: z.string().optional(),
		email: z.string().optional(),
		status: z.string().optional(),
		team_id: z.union([z.string(), z.number()]).optional(),
		user_id: z.union([z.string(), z.number()]).optional(),
		agent_id: z.union([z.string(), z.number()]).optional(),
		scheduled_at: z.string().optional(),
		notes: z.string().optional(),
		tags: z.array(z.string()).optional(),
		custom_fields: z.record(z.string(), z.unknown()).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

/**
 * Callingly Call entity schema
 */
export const CallinglyCall = z
	.object({
		id: z.union([z.string(), z.number()]),
		lead_id: z.union([z.string(), z.number()]).optional(),
		team_id: z.union([z.string(), z.number()]).optional(),
		user_id: z.union([z.string(), z.number()]).optional(),
		agent_id: z.union([z.string(), z.number()]).optional(),
		phone_number: z.string().optional(),
		status: z.string().optional(),
		duration: z.number().optional(),
		outcome: z.string().optional(),
		recording_url: z.string().optional(),
		scheduled_at: z.string().optional(),
		started_at: z.string().optional(),
		ended_at: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

/**
 * Callingly Agent / User entity schema
 */
export const CallinglyUser = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		phone_number: z.string().optional(),
		role: z.string().optional(),
		status: z.string().optional(),
		active: z.boolean().optional(),
		account_id: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const CallinglyAgent = CallinglyUser;

/**
 * Callingly Team entity schema
 */
export const CallinglyTeam = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		description: z.string().optional(),
		user_ids: z.array(z.union([z.string(), z.number()])).optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

/**
 * Callingly Team User Assignment
 */
export const CallinglyTeamUser = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		priority: z.number().optional(),
		call_cap: z.number().optional(),
		integration_id: z.string().optional(),
	})
	.passthrough();

/**
 * Callingly Agent Schedule
 */
export const CallinglySchedule = z
	.object({
		agent_id: z.union([z.string(), z.number()]).optional(),
		user_id: z.union([z.string(), z.number()]).optional(),
		timezone: z.string().optional(),
		schedule: z.record(z.string(), z.unknown()).optional(),
		days: z.array(z.string()).optional(),
	})
	.passthrough();

/**
 * Callingly Client entity schema (Agency sub-accounts)
 */
export const CallinglyClient = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		email: z.string().optional(),
		company: z.string().optional(),
		active: z.boolean().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

/**
 * Callingly Webhook Configuration
 */
export const CallinglyWebhookConfig = z
	.object({
		id: z.union([z.string(), z.number()]),
		url: z.string(),
		event: z.string().optional(),
		events: z.array(z.string()).optional(),
		call_status: z.string().optional(),
		call_lead_status: z.string().optional(),
		field: z.string().optional(),
		filter: z.string().optional(),
		active: z.boolean().optional(),
		created_at: z.string().optional(),
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

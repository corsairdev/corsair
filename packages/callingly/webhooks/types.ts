import { z } from 'zod';

export const CallCompletedWebhookEventSchema = z
	.object({
		event: z.string().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		call_id: z.union([z.string(), z.number()]).optional(),
		lead_id: z.union([z.string(), z.number()]).optional(),
		team_id: z.union([z.string(), z.number()]).optional(),
		user_id: z.union([z.string(), z.number()]).optional(),
		phone_number: z.string().optional(),
		status: z.string().optional(),
		duration: z.number().optional(),
		recording_url: z.string().optional(),
		outcome: z.string().optional(),
		timestamp: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();

export const LeadCreatedWebhookEventSchema = z
	.object({
		event: z.string().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		lead_id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		phone_number: z.string().optional(),
		email: z.string().optional(),
		team_id: z.union([z.string(), z.number()]).optional(),
		timestamp: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();

export type CallCompletedWebhookEvent = z.infer<
	typeof CallCompletedWebhookEventSchema
>;
export type LeadCreatedWebhookEvent = z.infer<
	typeof LeadCreatedWebhookEventSchema
>;

export type CallinglyWebhookOutputs = {
	callCompleted: CallCompletedWebhookEvent;
	leadCreated: LeadCreatedWebhookEvent;
};

export const CallinglyWebhookEventSchemas = {
	callCompleted: CallCompletedWebhookEventSchema,
	leadCreated: LeadCreatedWebhookEventSchema,
} as const;

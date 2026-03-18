import { z } from 'zod';

export const CalendlyScheduledEvent = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	status: z.enum(['active', 'canceled']).optional(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
	event_type: z.string().optional(),
	location: z
		.object({
			type: z.string(),
			location: z.string().optional(),
			join_url: z.string().optional(),
		})
		.optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyScheduledEvent = z.infer<typeof CalendlyScheduledEvent>;

export const CalendlyEventType = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	active: z.boolean().optional(),
	slug: z.string().optional(),
	scheduling_url: z.string().optional(),
	duration: z.number().optional(),
	kind: z.string().optional(),
	color: z.string().optional(),
	description_plain: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyEventType = z.infer<typeof CalendlyEventType>;

export const CalendlyInvitee = z.object({
	id: z.string(),
	uri: z.string().optional(),
	email: z.string().optional(),
	name: z.string().optional(),
	status: z.enum(['active', 'canceled']).optional(),
	event: z.string().optional(),
	timezone: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyInvitee = z.infer<typeof CalendlyInvitee>;

export const CalendlyUser = z.object({
	id: z.string(),
	uri: z.string().optional(),
	name: z.string().optional(),
	slug: z.string().optional(),
	email: z.string().optional(),
	scheduling_url: z.string().optional(),
	timezone: z.string().optional(),
	avatar_url: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyUser = z.infer<typeof CalendlyUser>;

export const CalendlyWebhookSubscription = z.object({
	id: z.string(),
	uri: z.string().optional(),
	callback_url: z.string().optional(),
	state: z.enum(['active', 'disabled']).optional(),
	scope: z.string().optional(),
	organization: z.string().optional(),
	user: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type CalendlyWebhookSubscription = z.infer<
	typeof CalendlyWebhookSubscription
>;
